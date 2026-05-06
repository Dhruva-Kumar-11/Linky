# Full Reference: Everything About Linky (Monolithic Documentation)

---

## 1. Abstract
Linky is a high-performance, browser-native Peer-to-Peer (P2P) file sharing application designed with a "Symmetric Paradigm." It eliminates the traditional client-server bottleneck by establishing a direct, encrypted tunnel between two devices using WebRTC technology.

## 1.5 Simple Summary (For Non-Technical Readers)
Imagine you want to hand a physical photo to a friend. You walk over and give it to them directly. No one else sees it, and there's no middleman. **Linky is the digital version of that.** 

Instead of uploading files to a big company's computer (like Google or WhatsApp), Linky creates a private, invisible tunnel between your device and your friend's. It's faster, totally private, and requires no accounts. Just a PIN code, and you're ready to share.

---

## 2. System Architecture
### 2.1 Platform & Environment
*   **Platform:** Web Browsers (Chrome, Firefox, Safari, Edge).
*   **Delivery:** Monolithic Single-file HTML (.html).
*   **Hosting:** Static hosting compatible (GitHub Pages, Netlify, Local FS).

### 2.2 Technology Stack
*   **WebRTC:** Peer-to-peer data channel infrastructure.
*   **PeerJS (v1.5.2):** Abstraction layer for WebRTC signaling and handshake.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **Web Crypto API:** Native browser API for SHA-256 and AES-GCM 256.

---

## 3. Detailed Module Breakdown
Linky is architected into 12 functional modules:
1.  **Aesthetic Engine:** Glassmorphism and Mesh Gradients.
2.  **Core Connectivity:** WebRTC/PeerJS management.
3.  **UI State Module:** Transition logic between Setup and Workspace.
4.  **Hybrid Input:** Keyboard/Keypad synchronization.
5.  **Symmetric Streaming:** 64KB chunked bidirectional transfer.
6.  **Telemetry:** Real-time speed and progress calculation.
7.  **History Log:** Ephemeral transfer tracking.
8.  **Crypto Module:** AES-GCM 256 application-layer encryption.
9.  **Media Preview:** Image/Video instant object-URL generation.
10. **Analytics:** Performance delta sampling.
11. **Batch Management:** Sequential transfer queuing.
12. **Ephemeral Chat:** P2P side-channel messaging.

---

## 4. Algorithms & Security
### 4.1 Room Obfuscation (SHA-256)
`PeerID = SHA256(SALT + PIN).substring(0, 32)`
This ensures the signaling server never knows the plain-text PIN.

### 4.2 Payload Encryption (AES-GCM)
Each file chunk is encrypted using a unique IV and a key derived from the PIN via PBKDF2.

### 4.3 Streaming Algorithm
Utilizes `file.stream().getReader()` to slice files into 64KB chunks, respecting backpressure to prevent RAM exhaustion.

---

## 5. Scope & Constraints
### 5.1 Advantages
*   **Privacy:** No server custody.
*   **Speed:** Direct link bypasses cloud uploads.
*   **Zero-Config:** No accounts or installs.

### 5.2 Limitations
*   **RAM Bound:** Receiver must buffer file into memory before saving.
*   **NAT Restriction:** Requires STUN/TURN for restrictive firewalls.

---

## 6. List of Figures (Conceptual)
1.  **Fig 1:** The Symmetric Handshake Flow.
2.  **Fig 2:** The 64KB Chunk Transmission Lifecycle.
3.  **Fig 3:** Glassmorphic Layering Diagram.

---

## 7. Conclusion
Linky represents the future of private, browser-native file sharing. By combining the raw power of WebRTC with advanced cryptographic standards and a premium aesthetic, it provides a superior alternative to centralized cloud storage for immediate, secure asset transfers.
