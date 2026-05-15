# 🚀 Linky | Symmetric P2P Share (v2.0 Stable)

Welcome to the official repository for **Linky**, a high-performance, browser-native Peer-to-Peer file sharing application. Built as a final-year BCA academic project.
---

## 📂 Quick Access
*   **[index.html](./index.html)** - The core application. Open this in any browser to start sharing.
*   **[Perfect_Linky/](./Perfect_Linky/Master_Index.md)** - 50-Page Technical Whitepaper (Deep-dive documentation).
*   **[Presentation/](./Presentation/Presentation_Outline.md)** - Presentation materials for teachers and classmates.

---

## 🎯 Project Core Concept
Linky is built on the **Symmetric Paradigm**. Unlike traditional cloud storage, it creates a **direct, encrypted tunnel** between two browsers.
*   **Zero-Data Custody:** No servers, no logs, no middleman.
*   **End-to-End Encryption:** Secured via DTLS (WebRTC) and AES-GCM 256.
*   **Symmetric Flow:** Both users can send and receive files simultaneously.

---

## 🎓 Teacher's Cheat Sheet (Quick Presentation Facts)
When presenting to teachers, focus on these high-impact technical points:

1.  **Architecture:** Peer-to-Peer (P2P) using WebRTC (Session Description Protocol & ICE Candidates).
2.  **Security:** 
    *   **SHA-256:** Room PINs are hashed to prevent room sniffing.
    *   **AES-GCM 256:** Payload encryption for military-grade data protection.
3.  **Efficiency:** 64KB Chunking with **Backpressure** logic to prevent browser RAM exhaustion.
4.  **UI/UX:** **Glassmorphic** design implemented with Vanilla CSS and GPU-accelerated mesh gradients.
5.  **Simplicity:** A monolithic single-file HTML delivery—no installation or dependencies.

---

## 🛠️ Technical Stack
*   **Core:** HTML5, CSS3, JavaScript (ES6+).
*   **P2P Infrastructure:** WebRTC via [PeerJS](https://peerjs.com/).
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first).
*   **Encryption:** Browser-native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

---

## 📖 How to Use
1.  **Launch:** Open `index.html` in your browser.
2.  **Establish Link:** One user clicks **HOST** (generates a PIN); the other enters that PIN and clicks **JOIN**.
3.  **Share:** Drag and drop files into the workspace.
4.  **Chat:** Use the P2P chat for immediate, ephemeral communication.

---
*Developed with a focus on Privacy, Speed, and Aesthetic Excellence.*
