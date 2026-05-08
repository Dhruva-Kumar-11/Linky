// --- UI UTILS ---

function renderFlowUI(id, name, size, dir, isLarge = false) {
    const card = document.createElement('div');
    card.id = `f-${id}`;
    card.className = 'glass p-6 rounded-[2rem] animate-slide border-l-[6px] ' + (dir === 'out' ? 'border-l-primary' : 'border-l-secondary');
    
    let btnHtml = '';
    let wrapperClasses = '';
    
    if (dir === 'in' && isLarge) {
        wrapperClasses = 'hidden';
        btnHtml = `
        <div id="accept-btn-${id}" class="mt-4 text-center">
            <button onclick="acceptLargeFile('${id}')" class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-black rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"><i class="fas fa-hdd mr-2"></i> Save to Disk (Large File)</button>
        </div>`;
    }

    card.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4 overflow-hidden">
                <i class="fas ${dir === 'out' ? 'fa-arrow-up text-primary' : 'fa-arrow-down text-secondary'} text-sm"></i>
                <span class="text-xs font-black text-white truncate">${name}</span>
            </div>
            <div class="speed-wrapper flex items-center space-x-3 ${wrapperClasses}">
                <span id="s-${id}" class="text-[9px] font-bold text-slate-500 uppercase">0 MB/s</span>
                <span id="p-${id}" class="text-[10px] font-mono text-slate-500">0%</span>
            </div>
        </div>
        <div class="progress-wrapper w-full h-1.5 bg-slate-900/40 rounded-full overflow-hidden ${wrapperClasses}">
            <div id="b-${id}" class="h-full bg-gradient-to-r ${dir === 'out' ? 'from-primary to-indigo-500' : 'from-secondary to-pink-500'} transition-all duration-300" style="width: 0%"></div>
        </div>
        ${btnHtml}`;
    UI.streamBox.prepend(card);
    
    if(dir === 'out') flowStats[id + '_sent'] = 0;

    flowStats[id] = setInterval(() => {
        const b = (dir === 'out') ? flowStats[id + '_sent'] : (flowBuf[id] ? flowBuf[id].rec : null);
        const prev = (dir === 'out') ? flowStats[id + '_prev'] : (flowBuf[id] ? flowBuf[id].lastRec : null);
        if (b === null) return;

        const diff = b - (prev || 0);
        const speed = formatBytes(diff) + '/s';
        const el = document.getElementById(`s-${id}`);
        if(el) el.innerText = speed;

        if(dir === 'out') flowStats[id + '_prev'] = b;
        else if(flowBuf[id]) flowBuf[id].lastRec = b;
    }, 1000);
}

function tickProgress(id, cur, tot) {
    const p = Math.round((cur / tot) * 100);
    const b = document.getElementById(`b-${id}`);
    const t = document.getElementById(`p-${id}`);
    if(b) b.style.width = `${p}%`;
    if(t) t.innerText = `${p}%`;
    
    if(flowStats[id + '_sent'] !== undefined) flowStats[id + '_sent'] = cur;
}

function finishFlow(id, ok) {
    if(flowStats[id]) clearInterval(flowStats[id]);
    delete flowStats[id];
    delete flowStats[id + '_sent'];
    delete flowStats[id + '_prev'];

    const t = document.getElementById(`p-${id}`);
    if(t) t.innerHTML = ok ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-red-500"></i>';
    setTimeout(() => {
        const el = document.getElementById(`f-${id}`);
        if(el) {
            el.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                el.remove();
                if(UI.streamBox.children.length === 1) UI.emptyMsg.classList.remove('hidden');
            }, 500);
        }
    }, 5000);
}

function logHistory(name, size, dir) {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-[11px] font-bold';
    row.innerHTML = `<span class="truncate pr-4">${dir === 'out' ? '↑' : '↓'} ${name}</span><span class="text-slate-500">${formatBytes(size)}</span>`;
    UI.history.prepend(row);
}

function notify(msg, type = 'info') {
    const t = document.createElement('div');
    const scheme = type === 'success' ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-primary/50 bg-primary/10 text-primary';
    t.className = `glass px-6 py-3 rounded-2xl border ${scheme} text-[11px] font-black animate-slide pointer-events-auto shadow-2xl`;
    t.innerText = msg;
    UI.toastRack.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

function formatBytes(b) {
    if(b === 0) return '0 B';
    const k = 1024, i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + ['B','KB','MB','GB'][i];
}

// --- EPHEMERAL CHAT ---
function appendChat(user, msg) {
    const el = document.createElement('div');
    el.className = 'animate-slide';
    el.innerHTML = `<span class="font-black ${user === 'You' ? 'text-primary' : 'text-secondary'} uppercase text-[9px] mr-2">${user}:</span><span>${msg}</span>`;
    UI.chatBox.appendChild(el);
    UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
    
    if(user !== 'You') {
        notify('New Message Received', 'info');
        UI.chatPanel.classList.add('animate-glow', 'animate-shake');
        setTimeout(() => UI.chatPanel.classList.remove('animate-glow', 'animate-shake'), 1500);
    }
}

// --- MEDIA PREVIEWS ---
function showPreview(blob, name, type) {
    UI.previewContent.innerHTML = "";
    const url = URL.createObjectURL(blob);

    const isImg   = type && type.startsWith('image/');
    const isVid   = type && type.startsWith('video/');
    const isAud   = type && type.startsWith('audio/');
    const isPdf   = type === 'application/pdf';
    const isTxt   = type && type.startsWith('text/');

    let el = null;

    if(isImg) {
        el = document.createElement('img');
        el.src = url;
        el.className = 'max-w-full max-h-full rounded-2xl shadow-2xl object-contain';
    } else if(isVid) {
        el = document.createElement('video');
        el.src = url;
        el.controls = true;
        el.autoplay = true;
        el.className = 'max-w-full max-h-full rounded-2xl shadow-2xl';
    } else if(isAud) {
        el = document.createElement('audio');
        el.src = url;
        el.controls = true;
        el.autoplay = true;
        el.className = 'w-full mt-4';
        // wrap with a label
        const wrap = document.createElement('div');
        wrap.className = 'flex flex-col items-center gap-4 p-6';
        const lbl = document.createElement('p');
        lbl.className = 'text-white font-black text-sm truncate max-w-xs';
        lbl.textContent = name;
        const icon = document.createElement('i');
        icon.className = 'fas fa-music text-5xl text-primary';
        wrap.appendChild(icon);
        wrap.appendChild(lbl);
        wrap.appendChild(el);
        UI.previewContent.appendChild(wrap);
        UI.previewOverlay.classList.remove('hidden');
        UI.previewOverlay.classList.add('flex');
        return;
    } else if(isPdf) {
        el = document.createElement('iframe');
        el.src = url;
        el.className = 'w-full rounded-2xl shadow-2xl border-0';
        el.style.height = '80vh';
        el.style.minWidth = 'min(90vw, 900px)';
    } else if(isTxt) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const pre = document.createElement('pre');
            pre.textContent = e.target.result;
            pre.className = 'text-left text-xs text-slate-200 bg-slate-900/80 rounded-2xl p-6 overflow-auto max-h-[70vh] max-w-[80vw] shadow-2xl font-mono';
            UI.previewContent.appendChild(pre);
            UI.previewOverlay.classList.remove('hidden');
            UI.previewOverlay.classList.add('flex');
        };
        reader.readAsText(blob);
        return;
    }

    if(el) {
        UI.previewContent.appendChild(el);
        UI.previewOverlay.classList.remove('hidden');
        UI.previewOverlay.classList.add('flex');
    }
}

window.closePreview = () => {
    UI.previewOverlay.classList.add('hidden');
    UI.previewOverlay.classList.remove('flex');
    UI.previewContent.innerHTML = "";
};

// --- HYBRID PIN INPUT (KEYBOARD + KEYPAD) ---
function syncPinUI() {
    const slots = UI.pinSlots.querySelectorAll('div');
    slots.forEach((s, i) => {
        s.innerText = inputPin[i] || "";
        s.classList.toggle('border-secondary', !!inputPin[i]);
        s.classList.toggle('bg-secondary/10', !!inputPin[i]);
    });
}
