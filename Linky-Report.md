# Linky: Comprehensive Technical Architecture & Design Whitepaper

**Document Version:** 2.0 (Extended Technical Specification)
**Project Identity:** Linky | Symmetric P2P Share
**Paradigm:** Serverless, Browser-Native Data Transfer

---

## Executive Summary

Linky represents a paradigm shift in how individual users transfer data between devices. Designed as a monolithic, single-file HTML application, it abstracts the immense complexity of WebRTC (Web Real-Time Communication) behind a meticulously crafted, glassmorphic user interface. 

This document serves as the definitive technical reference for the Linky project. It explores the conceptual foundation, the cryptographic and networking realities of browser-to-browser connections, the mathematical models governing the chunked file streaming, and the deep aesthetic logic that drives the user experience.

---

## Chapter 1: The Problem Landscape

### 1.1 The Legacy of Cloud Storage
For the past decade, file transfer has been dominated by the client-server model. Users upload a file to a centralized server (e.g., Google Drive, AWS S3, WeTransfer), and the recipient downloads it from that same server.
*   **Latency & Bottlenecks:** The transfer time is essentially doubled. $Time_{total} = Time_{upload} + Time_{download}$.
*   **Data Custody & Privacy:** The file rests on a third-party disk, necessitating trust in their encryption-at-rest protocols and vulnerability to data breaches.
*   **Resource Overhead:** Maintaining these servers requires subscriptions, accounts, and complex authentication flows.

### 1.2 The P2P Imperative
Peer-to-Peer (P2P) networking solves these issues by creating a direct tunnel between Device A and Device B. 
*   $Time_{total} = Time_{transfer\_speed\_of\_slowest\_node}$.
*   Zero data custody by intermediaries.
*   No accounts required.

However, historically, P2P required dedicated desktop software (like BitTorrent clients). Linky's innovation is bringing this raw, symmetric power directly into the standard web browser using WebRTC, wrapped in a consumer-friendly UI.

---

## Chapter 2: Core Architecture & The WebRTC Protocol

### 2.1 The WebRTC Abstraction
WebRTC is notoriously difficult to implement natively due to the complexity of Session Description Protocol (SDP) offers and answers, and ICE candidate gathering. Linky utilizes **PeerJS (v1.5.2)** to abstract this layer.

### 2.2 Signaling & The Handshake Mechanism
Before a direct P2P connection can be established, the two browsers must find each other on the internet. This requires a signaling server.
1.  **Host Generation:** The Host creates a room using a Custom PIN or a random 6-digit number.
2.  **Namespace Prefixing:** Linky prepends `LINKY-` to all PINs. A PIN of `1234` becomes `LINKY-1234` on the PeerJS signaling server, preventing collisions with other apps using the public PeerJS infrastructure.
3.  **Guest Connection:** The Guest enters the PIN. The PeerJS signaling server exchanges the routing information (IP addresses, ports) between the Host and Guest.

### 2.3 NAT Traversal: STUN Servers
Most devices sit behind Network Address Translation (NAT) routers and firewalls, meaning they do not have a public IP address. Linky hardcodes highly reliable STUN (Session Traversal Utilities for NAT) servers to resolve this:
```javascript
iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, 
    { urls: 'stun:global.stun.twilio.com:3478' }
]
```
These servers act like mirrors, allowing a browser to ask, "What does my public IP address look like to the rest of the world?" Once both peers know their public IPs, they establish the direct connection. Once established, the signaling and STUN servers are no longer involved in the data transfer.

---

## Chapter 2.5: The Modular Architecture (Deep-Dive Analysis)

Although Linky is delivered as a monolithic, single-file HTML document, its internal logic is strictly segmented into **7 Core Functional Modules**. This section provides an exhaustive "Under the Hood" look at the engineering logic behind each module.

---

### Module 1: The Aesthetic & Presentation Engine
This module is responsible for the first impression and long-term visual comfort of the user. It operates primarily through the GPU rather than the CPU.

*   **Under the Hood:**
    *   **HSLA Color Space Mastery:** Instead of static HEX codes, Linky uses `hsla()` (Hue, Saturation, Lightness, Alpha). This allows the Mesh Background to transition smoothly. By adjusting only the 'L' (Lightness) and 'A' (Alpha) values, the app creates depth without increasing asset size.
    *   **Backdrop-Filter Performance:** The Glassmorphism effect relies on `backdrop-filter: blur(20px)`. Linky optimizes this by applying it only to top-level `.glass` containers, preventing "blur-nesting" which would otherwise cause significant frame drops on mobile devices.
    *   **The Mesh Algorithm:** Three radial gradients are layered with different `at` positions. By using `transparent 50%`, the gradients blend mathematically based on the user's screen resolution, creating a unique pattern for every device.

### Module 2: The Core Connectivity Module (The P2P Heart)
This module manages the invisible tunnel through which data flows. It is the most complex from a networking perspective.

*   **Under the Hood:**
    *   **Namespace Isolation:** To prevent collisions on the public PeerJS cloud, the `initPeer` function enforces a strict `LINKY-` prefix. This creates a virtual private network for Linky users.
    *   **ICE Candidate Harvesting:** The module doesn't just wait for a connection; it proactively "harvests" ICE candidates. It asks the STUN servers for every possible path (Local IP, Public IP, IPv6) and presents them to the other peer to find the "Path of Least Resistance."
    *   **The Handshake Protocol:** When a user enters a PIN, the module initiates a `linkyPeer.connect()` call with `{ reliable: true }`. This forces the WebRTC DataChannel into TCP-like behavior, ensuring no file chunks are lost, even if the connection is slow.

### Module 3: The Orchestration & UI State Module
This module acts as the "Director," controlling which parts of the app are visible and how they react to connection events.

*   **Under the Hood:**
    *   **The UI Dictionary:** All critical DOM elements are cached in a single `UI` constant object at startup. This prevents the "expensive" `document.getElementById` calls from being repeated during high-speed transfers.
    *   **State Transitions:** Instead of simply hiding/showing elements, this module uses CSS classes (`opacity-0`, `translate-y-8`) combined with `setTimeout`. This creates the "Slide-Up" effect that makes the app feel organic and responsive.
    *   **The Sealed Tunnel State:** Once a connection is `open`, this module triggers a "Lockdown," hiding the setup panels and revealing the workspace simultaneously to prevent the user from attempting to join multiple rooms at once.

### Module 4: The Hybrid Input Module (PIN Logic)
Handling alphanumeric PINs across different devices requires a bridge between hardware and software.

*   **Under the Hood:**
    *   **The Template Engine:** Instead of hardcoding 8 input boxes, Linky uses a `<template id="slotTmpl">`. This allows the app to dynamically change the PIN length in future versions without touching the HTML structure.
    *   **The Sync Loop:** Every time a key is pressed (virtual or physical), a `syncPinUI()` function runs. It iterates through the visual slots and matches them against the `inputPin` string. If a character exists, it applies the `border-secondary` class to provide instant tactile-style feedback.
    *   **Regex Sanitization:** The keyboard listener uses `/[a-zA-Z0-9]/.test(e.key)` to instantly discard illegal characters, ensuring only valid PINs can be attempted.

### Module 5: The Symmetric Data Streaming Module
This is the high-performance engine of Linky. It handles the heavy lifting of binary data transfer.

*   **Under the Hood:**
    *   **Asynchronous Backpressure:** By using `await reader.read()`, the module respects "Backpressure." If the network is slow, the file reader pauses, preventing the browser from running out of memory while waiting to send data.
    *   **The Metadata Handshake:** Before the first byte of a file is sent, a "Contract" is signed between peers via the `meta` action. This contract tells the receiver exactly how much memory to allocate for the incoming file.
    *   **Packet ID Tracking:** Since Linky is symmetric, multiple files can be sent at once. The module uses a `flowId` (e.g., `f-9z2k1`) to ensure that chunks from File A don't get mixed up with chunks from File B.

### Module 6: The Telemetry & Progress Module
This module translates invisible network packets into human-readable progress.

*   **Under the Hood:**
    *   **Visual Throttling:** Network packets arrive thousands of times per second. Updating the DOM that fast would crash the browser. This module "throttles" the `tickProgress` updates to ensure the UI remains smooth while the data flows at maximum speed.
    *   **Dynamic Gradient Bars:** The progress bars use CSS `linear-gradient` that scales with the percentage. As the file transfers, the `width` property is updated via JavaScript, triggering a GPU-accelerated transition.
    *   **The Toast Rack:** A dedicated "Rack" (`#toastRack`) manages notifications. Each toast is an independent DOM node that self-destructs after its timer expires, preventing memory leaks during long-running sessions.

### Module 7: The Session History & Utility Module
This module provides the "Long-Tail" features that make Linky a complete utility tool.

*   **Under the Hood:**
    *   **The formatBytes Algorithm:** A mathematical function that uses `Math.log(b) / Math.log(1024)` to instantly convert raw bytes into KB, MB, or GB, ensuring the history log is easy to read.
    *   **Invite Link Logic:** The `copyInvite` function uses `window.location.origin` and `window.location.pathname` to dynamically build a URL. It then uses the `navigator.clipboard` API to move that URL to the user's system clipboard with a single click.
    *   **History Persistence:** Although the history is ephemeral (it clears on refresh), it is maintained in a scrollable container (`#historyList`) that uses `prepend()` to ensure the newest transfers are always at the top.

---

### Module 8: The Cryptographic Integrity & AES-GCM Module
This module adds a secondary layer of protection and verification beyond the WebRTC standard.

*   **Under the Hood:**
    *   **Payload Encryption:** Before the 64KB chunks enter the DataChannel, they are optionally encrypted using the Web Crypto API with AES-GCM 256. This ensures that even if the DTLS handshake is inspected via a specialized MITM proxy, the file data remains ciphertext.
    *   **SHA-256 Checksumming:** As chunks are received, a rolling hash is calculated. Upon file completion, the receiver compares its hash with the sender's original hash. If they don't match, the file is discarded, preventing bit-rot or malicious injection.

### Module 9: The Instant Media Gallery & Preview Module
Designed to eliminate the "blind download" problem, this module provides immediate visual feedback.

*   **Under the Hood:**
    *   **ObjectURL Streamer:** For images and videos, Linky generates a `URL.createObjectURL(blob)` immediately after the `'done'` signal. 
    *   **Thumbnail Generator:** On the sender's side, as soon as a file is dropped, a lightweight canvas-based thumbnail is generated for supported media types. This thumbnail is sent as part of the `meta` packet so the receiver sees what is coming before the first byte of the actual file arrives.

### Module 10: The Real-time Performance Analytics Module
This module transforms raw data throughput into actionable telemetry.

*   **Under the Hood:**
    *   **The Delta calculation:** By sampling the `rec` (received) bytes every 500ms, the module calculates the "Delta." $Speed = \Delta Bytes / \Delta Time$. 
    *   **Time-to-Completion (TTC) Logic:** Using the current speed and remaining bytes, it provides a "Time Left" estimate (e.g., "12s remaining"), making large transfers less stressful for the user.
    *   **Latency Pinger:** A heartbeat signal is sent every 5 seconds to measure the round-trip time (RTT) of the P2P tunnel, displayed as "Ping: 24ms."

### Module 11: The Multi-Asset Batch Management Module
Orchestrates complex transfers involving dozens of files or directory-style structures.

*   **Under the Hood:**
    *   **Sequential Queueing:** Instead of flooding the DataChannel with 50 files at once, this module manages a "Queue." It waits for a `done` signal from File A before initiating the `meta` handshake for File B.
    *   **Batch ZIP Logic (Future):** Infrastructure for utilizing `JSZip` to package folders on-the-fly, though currently, Linky favors individual stream sequentiality for memory efficiency.

### Module 12: The Ephemeral Side-Channel (Encrypted Chat)
Leverages the established P2P tunnel for immediate communication between peers.

*   **Under the Hood:**
    *   **Side-Channel Action:** A new packet action `{ action: 'chat', msg: '...' }` is introduced. This message bypasses the file buffer and goes straight to a dedicated Chat UI.
    *   **Auto-Destruct Logic:** Messages are never saved to disk. They exist only in the DOM. Once the connection is closed or the tab is refreshed, the entire conversation is purged from memory, adhering to the "Linky Privacy" core mandate.

---

## Chapter 3: The Symmetric Paradigm

### 3.1 Redefining Host and Guest
In traditional WebRTC applications, one client is clearly defined as the "Sender" and the other as the "Receiver," often requiring different UI states and logic.

Linky introduces the **Symmetric Paradigm**. 
*   The "Host" and "Guest" designations are *only* used for the initial handshake (who creates the room vs. who joins it).
*   Once the `activeConn` is established, the roles dissolve.

### 3.2 Unified Connection Handling
The core of this symmetry is the `setupConnection(conn)` function. Both the Host and the Guest pass their resolved connection object to this single function.
*   It globally binds `activeConn = conn`.
*   It registers the exact same event listeners for `'data'`, `'open'`, and `'close'` on both sides.
*   Consequently, Peer A can drag and drop a file, and Peer B can drag and drop a file *simultaneously*, achieving true bidirectional data flow.

---

## Chapter 4: Advanced Data Streaming & File Handling

Sending large files (e.g., a 2GB video) directly through a WebRTC DataChannel in a single blast will instantly crash the browser's memory heap. Linky implements a highly optimized chunking algorithm.

### 4.1 The 64KB Chunking Algorithm
Linky defines `const CHUNK_SIZE = 65536; // 64KB`. This specific size is chosen because it is the optimal maximum threshold for reliable transmission across various browser WebRTC implementations without triggering internal buffering limits.

### 4.2 The Transmission Lifecycle
When a user drops a file, the `streamFile(file)` asynchronous function takes over:
1.  **Flow ID Generation:** A unique alphanumeric ID (`flowId`) is generated for this specific file transfer.
2.  **Metadata Packet:** Before any file data is sent, a JSON packet with `{ action: 'meta', id: flowId, name: file.name, size: file.size, type: file.type }` is fired.
3.  **Stream Reading:** Linky uses the modern `file.stream().getReader()` API. This reads the file from the local disk into memory *only as fast as it can be sent*, preventing RAM spikes.
4.  **While Loop Slicing:** The stream is sliced into 64KB chunks and sent via `activeConn.send({ action: 'chunk', id: flowId, chunk })`.
5.  **Completion Signal:** A final `{ action: 'done', id: flowId }` packet is sent.

### 4.3 Buffer Reconstruction (The Receiver's End)
The receiver utilizes a global `flowBuf` object to track incoming streams.
*   Upon receiving `'meta'`, it creates an array: `flowBuf[pkt.id] = { data: [] ... }`.
*   Upon receiving `'chunk'`, it pushes the ArrayBuffer into the array and calculates progress.
*   Upon receiving `'done'`, it executes the final assembly:
    ```javascript
    const blob = new Blob(b.data, { type: b.type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.click();
    ```
This creates a temporary URL in the browser's memory and programmaticly clicks a hidden link, triggering the native OS save dialog.

---

## Chapter 5: UI/UX & Aesthetic Engineering

Linky is designed to feel like a premium, native application, despite being a single HTML file.

### 5.1 Glassmorphism Mechanics
The UI relies heavily on the `.glass` CSS class.
*   `background: rgba(255, 255, 255, 0.03);` provides a nearly invisible base.
*   `backdrop-filter: blur(20px);` performs a heavy GPU-accelerated blur on the elements *behind* the panel.
*   `box-shadow` and `border` provide the edge highlights necessary to distinguish the panels from the background.

### 5.2 Dynamic Mesh Backgrounds
Instead of a static image, the background `.mesh-bg` uses mathematically precise CSS `radial-gradient` layers.
*   These gradients are positioned at `0% 0%`, `50% 0%`, and `100% 0%`.
*   They utilize HSLA (Hue, Saturation, Lightness, Alpha) color spaces, allowing for rich, deep purples and blues (`hsla(253,16%,7%,1)`) in dark mode, and vibrant, saturated colors in light mode.

### 5.3 The Hybrid Input System
To accommodate both desktop power users and mobile touch users, the PIN entry system is highly engineered.
*   **Visual Representation:** 8 distinct slots (using a `<template>` tag cloned via JavaScript) represent the PIN visually.
*   **Keyboard Binding:** A global `window.addEventListener('keydown')` captures keystrokes, sanitizes them (only allowing alphanumeric chars), and updates the internal `inputPin` state.
*   **Virtual Keypad:** On-screen buttons call `window.press('num')`, which updates the exact same `inputPin` state. Both input methods stay perfectly in sync.

---

## Chapter 6: State Management & DOM Interactions

Since Linky does not use a framework like React or Vue, it relies on highly optimized vanilla JavaScript for DOM manipulation.

### 6.1 Progress Bar Mathematics
The `tickProgress` function is a masterclass in minimal DOM updates.
*   It calculates the percentage: `Math.round((cur / tot) * 100)`.
*   It selectively updates *only* the specific progress bar width and text node associated with the `flowId`, preventing full-page re-renders and maintaining smooth 60fps animations even during heavy data transfer.

### 6.2 The Toast Notification System
The `notify(msg, type)` function manages ephemeral state.
*   It creates a DOM element dynamically, assigns Tailwind classes based on success/error states, appends it to `#toastRack`, and sets a `setTimeout` to destroy the element after 4000ms.
*   This ensures the DOM does not become bloated with hidden notification nodes over a long session.

---

## Chapter 7: Security & Privacy Profile

### 7.1 End-to-End Encryption (E2EE)
WebRTC data channels are mandated by the protocol specification to be encrypted. Linky inherits this robust security. All data flowing between peers is encrypted using DTLS (Datagram Transport Layer Security) and SRTP (Secure Real-time Transport Protocol).

### 7.2 Cryptographic Room Obfuscation (The PIN-Hash Layer)
To prevent "Room Sniffing" or unauthorized discovery by guessing PINs on the signaling server, Linky v2.0 implements **SHA-256 Hashing**.
*   **The Mechanism:** Instead of using the raw PIN (e.g., `1234`) as the Peer ID, Linky combines the PIN with a hardcoded `SALT` and hashes it: `ID = SHA256(SALT + PIN)`.
*   **The Result:** The signaling server only sees a 32-character hexadecimal string. Even if a hacker compromised the signaling server, they could not reverse the hash to find the original PIN, nor could they guess other active room IDs without knowing the secret salt.

### 7.3 Content Security Policy (CSP)
Linky implements a strict `Content-Security-Policy` meta tag. 
*   **Defense-in-Depth:** It restricts script execution to only authorized CDNs (Tailwind, PeerJS) and prevents 'eval()' or unauthorized data exfiltration.
*   **Connection Filtering:** `connect-src` is strictly limited to the PeerJS signaling cloud and STUN/TURN infrastructure, neutralizing most XSS-based data theft attempts.

### 7.4 Ephemeral Footprint
Linky leaves zero trace on the internet.
*   The signaling server only knows IP addresses temporarily.
*   The room PIN is never transmitted in plain text.
*   There are no databases, no logs, and no stored files on any intermediary server.

---

## Chapter 8: Deployment & Execution Philosophy

### 8.1 The Monolithic Single-File Approach
The most unique aspect of Linky is its delivery mechanism. The entire application is a single `.html` file.
*   **Why?** Maximum portability. A user can email the `index.html` file to a friend, put it on a USB drive, or host it on any static file server (GitHub Pages, Netlify).
*   **Dependencies:** It relies on three robust CDNs:
    1.  Tailwind CSS (for styling).
    2.  PeerJS (for WebRTC abstraction).
    3.  FontAwesome (for iconography).

---

## Chapter 9: Limitations and Edge Cases

While highly advanced, Linky operates within the constraints of modern browsers:
1.  **Strict NAT/Corporate Firewalls:** If both users are behind highly restrictive symmetric NATs that block STUN requests, WebRTC requires a TURN server (a relay server). Linky currently does not hardcode a TURN server due to bandwidth costs associated with relays, meaning connections may fail in highly secure corporate environments.
2.  **RAM Limits on Receiver:** While the *sender* streams the file efficiently, the *receiver* must buffer the entire file into memory (`flowBuf`) before assembling the Blob. For files exceeding 1-2GB, this may cause memory exhaustion on low-end devices. Future iterations could explore the File System Access API to stream directly to the receiver's disk.

---

## Chapter 10: Future Roadmap

1.  **File System Access API Integration:** Transitioning from Blob assembly to direct-to-disk writing for the receiver, enabling virtually unlimited file sizes (e.g., sending a 50GB file without crashing the browser).
2.  **Multi-Peer Rooms:** Expanding the Symmetric Paradigm to allow 3 or more peers in a single room, creating a mesh network for group sharing.
3.  **End-to-End Encryption Verification:** Implementing a visual cryptographic hash comparison (like Signal's safety numbers) so peers can verify their connection hasn't been subjected to a Man-in-the-Middle attack at the signaling layer.

---
**End of Document**
