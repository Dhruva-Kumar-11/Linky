// --- GLOBALS & STATE ---
const CHUNK_SIZE = 65536; // 64KB
const HEARTBEAT_INTERVAL_MS = 5000;
const WATCHDOG_INTERVAL_MS = 15000;
const SALT = "LINKY_V2_PROD_SALT"; // Change this periodically for rotation
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50MB Threshold for Disk Streaming
const acceptPromises = {}; // Store resolve functions for large file acceptance

let linkyPeer = null;
let activeConn = null; // GLOBAL CONNECTION OBJECT
let myRoomPin = "";
let inputPin = "";
let heartbeatTimer = null;
let watchdogTimer = null;
let lastPeerActivity = 0;
let isHost = false;
let isReconnecting = false;
let transferQueue = [];
let isTransferring = false;
const flowStats = {}; // Tracks bytes sent per interval
const flowBuf = {}; // Buffer for incoming flows

// UI Elements
const UI = {};

window.addEventListener('DOMContentLoaded', () => {
    Object.assign(UI, {
        customPin: document.getElementById('customPin'),
        hostBtn: document.getElementById('hostBtn'),
        hostStatus: document.getElementById('hostStatus'),
        pinDisplay: document.getElementById('myPinDisplay'),
        pinSlots: document.getElementById('pinSlots'),
        workspace: document.getElementById('workspace'),
        setup: document.getElementById('setupSection'),
        placeholder: document.getElementById('placeholder'),
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        streamBox: document.getElementById('streamBox'),
        emptyMsg: document.getElementById('emptyMsg'),
        history: document.getElementById('historyList'),
        toastRack: document.getElementById('toastRack'),
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        chatBox: document.getElementById('chatBox'),
        chatInput: document.getElementById('chatInput'),
        sendChat: document.getElementById('sendChat'),
        previewOverlay: document.getElementById('mediaPreview'),
        previewContent: document.getElementById('previewContent'),
        connBadge: document.getElementById('connBadge'),
        chatPanel: document.getElementById('chatPanel')
    });
});
