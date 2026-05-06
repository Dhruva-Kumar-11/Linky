# Algorithms & Security: Technical Foundation

## 1. SHA-256 PIN Hashing (Room Obfuscation)
To prevent "Room Sniffing," Linky does not use the raw PIN as the Peer ID. Instead, it applies a SHA-256 hash with a hardcoded `SALT`.
*   **Formula:** `PeerID = SHA256(SALT + PIN).substring(0, 32)`
*   **Benefit:** The signaling server only sees an opaque hash, making it virtually impossible for attackers to guess active PINs.

## 2. AES-GCM 256 Encryption (Payload Security)
Beyond WebRTC's native DTLS encryption, Linky adds a secondary layer of application-level security.
*   **Key Derivation:** Uses PBKDF2 with the PIN and SALT to derive a 256-bit AES key.
*   **Encryption:** Each 64KB chunk is encrypted with a unique 12-byte IV (Initialization Vector).
*   **Decryption:** The receiver uses the same derived key to decrypt chunks before assembly.

## 3. 64KB Chunking & Backpressure
WebRTC DataChannels have internal buffer limits. Flooding the channel with large files will cause memory crashes.
*   **Chunk Size:** Fixed at `65536` bytes (64KB).
*   **Backpressure Logic:** The `streamFile` function uses `await reader.read()`, ensuring that the next chunk is only read from the disk when the DataChannel is ready to send. This keeps memory usage constant regardless of file size.

## 4. Metadata Contract Handshake
Before data transfer begins, a "Metadata Packet" is sent.
*   **JSON Structure:** `{ action: 'meta', id: flowId, name: 'file.zip', size: 1024, type: 'application/zip' }`
*   **Purpose:** Notifies the receiver of the incoming file's properties so it can allocate buffer space (`flowBuf`) and prepare the progress UI.

## 5. Security Summary
*   **Handshake:** PeerJS/WebRTC signaling.
*   **Tunnel:** DTLS/SRTP (Transport Layer).
*   **Payload:** AES-GCM 256 (Application Layer).
*   **Privacy:** Zero-log, Zero-server policy.
