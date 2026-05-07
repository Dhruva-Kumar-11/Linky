// --- CRYPTO MODULE (AES-GCM) ---

// Cryptographic Hash for Peer ID (Obfuscation)
async function hashPin(pin) {
    const msgBuffer = new TextEncoder().encode(SALT + pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

async function deriveKey(pin) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(SALT + pin), { name: "PBKDF2" }, false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: enc.encode(SALT), iterations: 1000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

async function encryptChunk(chunk, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
    return { iv, data: ciphertext };
}

async function decryptChunk(pkt, key) {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv: pkt.iv }, key, pkt.data);
}
