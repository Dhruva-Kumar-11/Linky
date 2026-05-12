// --- WEBRTC CORE & SYMMETRIC ENGINE ---

function getPeerOptions() {
    return {
        debug: 1,
        pingInterval: 10000,
        config: { 
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }, 
                { urls: 'stun:global.stun.twilio.com:3478' }
            ] 
        }
    };
}

function stopHeartbeat() {
    if(heartbeatTimer) clearInterval(heartbeatTimer);
    if(watchdogTimer) clearInterval(watchdogTimer);
    heartbeatTimer = null;
    watchdogTimer = null;
}

function startHeartbeat(conn) {
    stopHeartbeat();
    lastPeerActivity = Date.now();
    
    heartbeatTimer = setInterval(() => {
        if(!activeConn || !activeConn.open) return stopHeartbeat();
        try {
            activeConn.send({ action: 'heartbeat', ts: Date.now() });
        } catch(e) {
            console.error("Heartbeat send failed", e);
        }
    }, HEARTBEAT_INTERVAL_MS);

    watchdogTimer = setInterval(() => {
        if(!activeConn) return stopHeartbeat();
        const silenceDuration = Date.now() - lastPeerActivity;
        if(silenceDuration > WATCHDOG_INTERVAL_MS) {
            console.warn(`Watchdog: Peer silent for ${silenceDuration}ms. Triggering reconnect.`);
            handleDisconnect();
        }
    }, 5000);
}

function markConnectionReady() {
    UI.connBadge.innerText = 'Link Established';
    UI.connBadge.className = 'relative px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20 active-ping animate-shake';
    setTimeout(() => UI.connBadge.classList.remove('animate-shake'), 1500);
}

function markConnectionClosed() {
    UI.connBadge.innerText = 'Disconnected';
    UI.connBadge.className = 'relative px-4 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20';
}

function handleDisconnect() {
    if (activeConn) {
        activeConn.close();
        activeConn = null;
    }
    stopHeartbeat();
    markConnectionClosed();

    if (!isHost && myRoomPin && !isReconnecting) {
        isReconnecting = true;
        notify('Link dropped, reconnecting...', 'warning');
        setTimeout(async () => {
            try {
                const hashedTarget = await hashPin(myRoomPin);
                initiateHandshake(`LINKY-${hashedTarget}`);
            } catch(e) {
                console.error('Reconnect failed', e);
                notify('Reconnect Failed', 'error');
            } finally {
                isReconnecting = false;
            }
        }, 2000);
    } else {
        notify('Link Terminated', 'error');
    }
}

function setupConnection(conn) {
    if (activeConn && activeConn.open) {
        activeConn.close();
    }
    
    activeConn = conn;

    activeConn.on('open', () => {
        isReconnecting = false;
        notify('Symmetric Tunnel Sealed', 'success');
        // Keep setup visible for host (they still need the PIN display visible to share)
        if (!isHost) UI.setup.classList.add('hidden');
        UI.placeholder.classList.add('hidden');
        UI.workspace.classList.remove('hidden');
        markConnectionReady();
        startHeartbeat(activeConn);

        setTimeout(() => UI.workspace.classList.remove('opacity-0', 'translate-y-8'), 100);
    });

    activeConn.on('data', onIncomingData);

    activeConn.on('close', () => {
        if(activeConn !== conn) return;
        handleDisconnect();
    });
    
    activeConn.on('error', (err) => {
        if(activeConn !== conn) return;
        handleDisconnect();
    });
}

function initPeer(id, pin) {
    isHost = true;
    if(linkyPeer) linkyPeer.destroy();
    linkyPeer = new Peer(id, getPeerOptions());

    linkyPeer.on('open', () => {
        myRoomPin = pin;
        UI.pinDisplay.innerText = pin;
        UI.hostStatus.classList.remove('hidden');
        notify('Room Broadcasting', 'success');
    });

    linkyPeer.on('connection', setupConnection);

    linkyPeer.on('error', (err) => {
        if(err.type === 'unavailable-id') notify('PIN Busy, try another', 'error');
        else notify(`Error: ${err.type}`, 'error');
    });

    linkyPeer.on('disconnected', () => {
        if(linkyPeer && !linkyPeer.destroyed) {
            notify('Signal reconnecting...', 'info');
            linkyPeer.reconnect();
        }
    });
}

window.joinLinky = async () => {
    if(inputPin.length < 4) return notify('PIN too short', 'warning');
    isHost = false;
    const hashedTarget = await hashPin(inputPin);
    myRoomPin = inputPin;
    if(!linkyPeer) {
        linkyPeer = new Peer(getPeerOptions());
        linkyPeer.on('open', () => initiateHandshake(`LINKY-${hashedTarget}`));
        linkyPeer.on('disconnected', () => {
            if(linkyPeer && !linkyPeer.destroyed) {
                notify('Signal reconnecting...', 'info');
                linkyPeer.reconnect();
            }
        });
    } else {
        initiateHandshake(`LINKY-${hashedTarget}`);
    }
};

function initiateHandshake(targetId) {
    notify('Handshaking...', 'info');
    const c = linkyPeer.connect(targetId, { reliable: true });
    setupConnection(c);
}

function syncFiles(files) {
    if(!activeConn) return notify('Connect first', 'warning');
    transferQueue.push(...Array.from(files));
    processQueue();
}

async function processQueue() {
    if(isTransferring || transferQueue.length === 0) return;
    isTransferring = true;
    const file = transferQueue.shift();
    await streamFile(file);
    isTransferring = false;
    processQueue();
}

// --- MIME TYPE INFERENCE (for files where browser returns empty type) ---
const MIME_MAP = {
    // Video
    mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', mov: 'video/quicktime',
    avi: 'video/x-msvideo', mkv: 'video/x-matroska', flv: 'video/x-flv',
    mpeg: 'video/mpeg', mpg: 'video/mpeg', m4v: 'video/mp4', ts: 'video/mp2t',
    '3gp': 'video/3gpp', wmv: 'video/x-ms-wmv',
    // Audio
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac',
    aac: 'audio/aac', m4a: 'audio/mp4', opus: 'audio/opus', weba: 'audio/webm',
    wma: 'audio/x-ms-wma', aiff: 'audio/aiff', mid: 'audio/midi', midi: 'audio/midi',
    // Image
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', bmp: 'image/bmp', ico: 'image/x-icon',
    tiff: 'image/tiff', tif: 'image/tiff', avif: 'image/avif', heic: 'image/heic',
    // Document
    pdf: 'application/pdf',
    txt: 'text/plain', csv: 'text/csv', html: 'text/html', htm: 'text/html',
    xml: 'text/xml', json: 'application/json', md: 'text/markdown',
    // Archive
    zip: 'application/zip', rar: 'application/x-rar-compressed',
    gz: 'application/gzip', tar: 'application/x-tar', '7z': 'application/x-7z-compressed',
    // Office
    doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Code / Misc
    js: 'text/javascript', css: 'text/css', py: 'text/x-python', apk: 'application/vnd.android.package-archive',
    exe: 'application/octet-stream', dmg: 'application/octet-stream', iso: 'application/octet-stream',
};

function inferMimeType(file) {
    if (file.type) return file.type;
    const ext = file.name.split('.').pop().toLowerCase();
    return MIME_MAP[ext] || 'application/octet-stream';
}

async function streamFile(file) {
    const flowId = Math.random().toString(36).substr(2, 9);
    renderFlowUI(flowId, file.name, file.size, 'out');
    UI.emptyMsg.classList.add('hidden');

    const key = await deriveKey(myRoomPin);
    const mimeType = inferMimeType(file);
    activeConn.send({ action: 'meta', id: flowId, name: file.name, size: file.size, type: mimeType });

    if (file.size >= LARGE_FILE_THRESHOLD) {
        notify('Waiting for peer to accept large file...', 'info');
        await new Promise(resolve => acceptPromises[flowId] = resolve);
    }

    const reader = file.stream().getReader();
    let sent = 0;
    
    if (activeConn && activeConn.dataChannel) {
        activeConn.dataChannel.bufferedAmountLowThreshold = 512 * 1024;
    }

    try {
        while(true) {
            if(!activeConn) throw new Error('Peer Disconnected');
            
            if (activeConn.dataChannel && activeConn.dataChannel.bufferedAmount > 1024 * 1024) {
                await new Promise(resolve => {
                    const onLow = () => {
                        activeConn.dataChannel.removeEventListener('bufferedamountlow', onLow);
                        resolve();
                    };
                    activeConn.dataChannel.addEventListener('bufferedamountlow', onLow);
                });
            }

            const {done, value} = await reader.read();
            if(done) break;
            
            let offset = 0;
            while(offset < value.length) {
                if(!activeConn) throw new Error('Peer Disconnected');
                const chunk = value.slice(offset, offset + CHUNK_SIZE);
                const encrypted = await encryptChunk(chunk, key);
                // Convert iv to plain Array for reliable cross-browser serialization via PeerJS
                activeConn.send({ action: 'chunk', id: flowId, iv: Array.from(encrypted.iv), data: encrypted.data });
                offset += chunk.length;
                sent += chunk.length;
                tickProgress(flowId, sent, file.size);
            }
        }
        if(activeConn) activeConn.send({ action: 'done', id: flowId });
        finishFlow(flowId, true);
        logHistory(file.name, file.size, 'out');
    } catch(e) {
        notify('Flow Interrupted', 'error');
        finishFlow(flowId, false);
    }
}

async function onIncomingData(pkt) {
    lastPeerActivity = Date.now();
    if(pkt.action === 'heartbeat') {
        if(activeConn && activeConn.open) activeConn.send({ action: 'heartbeat-ack', ts: pkt.ts });
        return;
    }
    if(pkt.action === 'heartbeat-ack') return;

    if(pkt.action === 'accept') {
        if(acceptPromises[pkt.id]) {
            acceptPromises[pkt.id]();
            delete acceptPromises[pkt.id];
        }
        return;
    }

    if(pkt.action === 'chat') {
        appendChat('Peer', pkt.msg);
    } else if(pkt.action === 'meta') {
        const isLarge = pkt.size >= LARGE_FILE_THRESHOLD;
        const mime = pkt.type || 'application/octet-stream'; // fallback for unknown types
        flowBuf[pkt.id] = { name: pkt.name, size: pkt.size, mime, data: [], rec: 0, lastRec: 0, lastTime: Date.now(), isLarge, streamWriter: null, key: null };
        // Derive key once per file, not per chunk
        deriveKey(inputPin || myRoomPin).then(k => { if(flowBuf[pkt.id]) flowBuf[pkt.id].key = k; });
        renderFlowUI(pkt.id, pkt.name, pkt.size, 'in', isLarge);
        UI.emptyMsg.classList.add('hidden');
    } else if(pkt.action === 'chunk') {
        const b = flowBuf[pkt.id];
        if(!b) return;
        // Use pre-derived key; fallback to deriving now if key not ready yet
        const key = b.key || await deriveKey(inputPin || myRoomPin);
        try {
            const decrypted = await decryptChunk(pkt, key);
            const chunk = new Uint8Array(decrypted);
            if (b.streamWriter) {
                await b.streamWriter.write(chunk);
            } else {
                b.data.push(chunk);
            }
            b.rec += chunk.byteLength;
            tickProgress(pkt.id, b.rec, b.size);
        } catch(e) {
            notify('Decryption Failed', 'error');
            finishFlow(pkt.id, false);
        }
    } else if(pkt.action === 'done') {
        const b = flowBuf[pkt.id];
        if(!b) return;
        
        if (b.streamWriter) {
            await b.streamWriter.close();
            notify('File Saved Directly to Disk', 'success');
        } else {
            const blob = new Blob(b.data, { type: b.mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = b.name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 10000);
            
            const previewable = b.mime && (
                b.mime.startsWith('image/') ||
                b.mime.startsWith('video/') ||
                b.mime.startsWith('audio/') ||
                b.mime === 'application/pdf' ||
                b.mime.startsWith('text/')
            );
            if(previewable) showPreview(blob, b.name, b.mime);
        }

        finishFlow(pkt.id, true);
        logHistory(b.name, b.size, 'in');
        delete flowBuf[pkt.id];
    }
}

window.acceptLargeFile = async (id) => {
    const b = flowBuf[id];
    if (!b) return;
    const btnContainer = document.getElementById(`accept-btn-${id}`);
    const card = document.getElementById(`f-${id}`);
    
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: b.name
            });
            b.streamWriter = await handle.createWritable();
        } catch(e) {
            if(e.name !== 'AbortError') notify('File Picker Error', 'error');
            return;
        }
    } else {
        notify('Direct disk save not supported by your browser. Using memory buffer (might crash if file is too large).', 'warning');
    }
    
    if(btnContainer) btnContainer.remove();
    if(card) {
        const progressWrapper = card.querySelector('.progress-wrapper');
        const speedWrapper = card.querySelector('.speed-wrapper');
        if(progressWrapper) progressWrapper.classList.remove('hidden');
        if(speedWrapper) speedWrapper.classList.remove('hidden');
    }
    
    if(activeConn) activeConn.send({ action: 'accept', id: id });
};
