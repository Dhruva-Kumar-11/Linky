# System Architecture & Technology Stack

## 1. Platform & Environment
*   **Platform:** Web Browsers (Chrome, Firefox, Safari, Edge).
*   **Delivery:** Monolithic Single-file HTML (.html).
*   **Hosting:** Static hosting compatible (GitHub Pages, Netlify, Local FS).

## 2. Programming Languages
*   **HTML5:** Structured semantic markup for accessibility and performance.
*   **CSS3:** Advanced styling using Tailwind CSS and GPU-accelerated transitions.
*   **JavaScript (ES6+):** Vanilla JS for core logic, DOM manipulation, and WebRTC orchestration.

## 3. Technology Stack
| Technology | Usage |
| :--- | :--- |
| **WebRTC** | Peer-to-peer data channel infrastructure. |
| **PeerJS (v1.5.2)** | Abstraction layer for WebRTC signaling and handshake. |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **FontAwesome** | Vector iconography for visual communication. |
| **Web Crypto API** | Native browser API for SHA-256 and AES-GCM 256. |

## 4. System Design: The Symmetric Paradigm
Linky deviates from the standard "Host-Client" model. While a "Host" creates the room and a "Guest" joins it, both peers utilize the same `setupConnection` logic. 

### Architecture Flow:
1.  **Signaling Phase:** Peers exchange SDP (Session Description Protocol) via the PeerJS cloud.
2.  **STUN Discovery:** Peers mirror their public IPs using Google/Twilio STUN servers.
3.  **Direct Link:** A WebRTC DataChannel is opened directly between peers.
4.  **Symmetric Exchange:** Both peers can now act as both sender and receiver simultaneously.

## 5. System Architecture Diagram (Conceptual)
```mermaid
graph LR
    A[Peer A - Host] <--> B((Signaling Server))
    C[Peer B - Guest] <--> B
    A <-.-> D{STUN Server}
    C <-.-> D
    A == Direct Encrypted P2P Tunnel == C
```
