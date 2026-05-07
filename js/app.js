// --- APP INITIALIZATION & EVENT LISTENERS ---

window.addEventListener('DOMContentLoaded', () => {
    // --- SECURE CONTEXT GUARD ---
    if (!window.isSecureContext) {
        alert("CRITICAL: Linky-Share requires a Secure Context (HTTPS or localhost) to function properly. Cryptography and Disk Streaming APIs will be disabled by the browser.");
    }

    // --- BROWSER GUARD ---
    if(!window.RTCPeerConnection) {
        alert("Critical: Your browser does not support WebRTC. Linky cannot function on this device.");
    }

    // Initialize Alphanumeric PIN Slots
    for(let i=0; i<12; i++) {
        const slot = document.getElementById('slotTmpl').content.cloneNode(true);
        UI.pinSlots.appendChild(slot);
    }

    // --- THEME ---
    const savedTheme = localStorage.getItem('linky-theme') || 'dark';
    if(savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        UI.themeIcon.className = 'fas fa-sun text-secondary';
    }

    UI.themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('light');
        UI.themeIcon.className = isDark ? 'fas fa-moon text-primary' : 'fas fa-sun text-secondary';
        localStorage.setItem('linky-theme', isDark ? 'dark' : 'light');
    });

    // --- PEER INITIALIZATION EVENTS ---
    UI.hostBtn.addEventListener('click', async () => {
        const pin = UI.customPin.value.trim().toUpperCase() || Math.floor(100000 + Math.random() * 900000).toString();
        const hashedId = await hashPin(pin);
        initPeer(`LINKY-${hashedId}`, pin);
    });

    // --- DRAG & DROP EVENTS ---
    UI.dropZone.addEventListener('click', () => UI.fileInput.click());
    UI.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); UI.dropZone.classList.add('drag-over'); });
    UI.dropZone.addEventListener('dragleave', () => UI.dropZone.classList.remove('drag-over'));
    UI.dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); UI.dropZone.classList.remove('drag-over');
        syncFiles(e.dataTransfer.files);
    });
    UI.fileInput.addEventListener('change', () => syncFiles(UI.fileInput.files));

    // --- KEYBOARD & MOBILE PIN BRIDGE ---
    window.addEventListener('keydown', (e) => {
        const mobileBridge = document.getElementById('mobilePinBridge');
        if (document.activeElement === UI.customPin || document.activeElement === mobileBridge || document.activeElement === UI.chatInput) return;
        if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            if(inputPin.length < 12) { inputPin += e.key.toUpperCase(); syncPinUI(); mobileBridge.value = inputPin; }
        } else if (e.key === 'Backspace') {
            inputPin = inputPin.slice(0, -1); syncPinUI(); mobileBridge.value = inputPin;
        } else if (e.key === 'Enter') joinLinky();
    });

    window.press = (n) => { 
        if(inputPin.length < 12) { 
            inputPin += n; 
            syncPinUI(); 
            document.getElementById('mobilePinBridge').value = inputPin; 
        } 
    };
    
    window.clearP = () => { 
        inputPin = ""; 
        syncPinUI(); 
        document.getElementById('mobilePinBridge').value = ""; 
    };

    const mobileBridge = document.getElementById('mobilePinBridge');
    window.focusMobilePin = () => mobileBridge.focus();
    mobileBridge.addEventListener('input', (e) => {
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        inputPin = val.substring(0, 12);
        syncPinUI();
        e.target.value = inputPin;
        if(inputPin.length === 12) joinLinky();
    });

    window.copyInvite = () => {
        const url = `${window.location.origin}${window.location.pathname}?pin=${myRoomPin}`;
        if(navigator.share) {
            navigator.share({ title: 'Linky Shared Room', text: `Join my private Linky room to share files securely. PIN: ${myRoomPin}`, url })
                .catch(() => navigator.clipboard.writeText(url).then(() => notify('Invite Link Copied', 'success')));
        } else {
            navigator.clipboard.writeText(url).then(() => notify('Invite Link Copied', 'success'));
        }
    };

    // Splash Logic
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 1000);
    }, 5000);

    const p = new URLSearchParams(window.location.search).get('pin');
    if(p) { 
        inputPin = p.substring(0,12).toUpperCase(); 
        mobileBridge.value = inputPin;
        syncPinUI(); 
        notify('PIN Import Success', 'info'); 
    }

    // --- CHAT EVENTS ---
    UI.sendChat.addEventListener('click', () => {
        const msg = UI.chatInput.value.trim();
        if(!msg) return;
        if(!activeConn || !activeConn.open) {
            notify('Not connected to a peer', 'warning');
            return;
        }
        
        activeConn.send({ action: 'chat', msg: msg });
        appendChat('You', msg);
        UI.chatInput.value = '';
    });

    UI.chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') UI.sendChat.click();
    });
});
