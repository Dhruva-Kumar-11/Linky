# Chapter 7: Cryptographic Excellence

## 7.1 The Zero-Trust Model
Linky operates on a zero-trust architecture. Even if the signaling server is compromised, the data exchanged between peers remains completely opaque to the attacker. This is achieved through End-to-End Encryption (E2EE) applied at the application layer, above and beyond the standard DTLS encryption provided by WebRTC.

## 7.2 PBKDF2 Key Derivation
The root of trust in a Linky session is the shared secret—typically a PIN or a high-entropy string shared via a secure out-of-band channel (like a QR code). 
To transform this PIN into a cryptographically strong key, Linky employs the Password-Based Key Derivation Function 2 (PBKDF2). 
The process involves:
1.  Combining the PIN with a dynamically generated, cryptographically secure salt.
2.  Executing thousands of iterations (e.g., 100,000+) of HMAC-SHA-256.
This computational hardness protects against brute-force and dictionary attacks on the PIN.

## 7.3 AES-GCM 256 Encryption
Once the 256-bit symmetric key is derived, Linky uses the Advanced Encryption Standard in Galois/Counter Mode (AES-GCM) with 256-bit keys for data encryption.
AES-GCM was selected because it provides Authenticated Encryption with Associated Data (AEAD). It ensures both:
*   **Confidentiality:** The file chunks are unreadable without the key.
*   **Integrity and Authenticity:** The GCM authentication tag guarantees that the chunk has not been tampered with in transit. If a single bit is flipped, decryption fails immediately.

## 7.4 Implementation Mechanics
Encryption is performed on the fly using the non-blocking Web Crypto API. As the Streaming module chunks a file, each 64KB chunk is passed to the Crypto module, encrypted with AES-GCM (using a unique, incrementing Initialization Vector), and then passed to the WebRTC Data Channel. This pipeline ensures that memory usage remains low, as only individual chunks are held in RAM during the cryptographic operations.