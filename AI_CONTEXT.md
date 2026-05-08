# AI Context: Linky-Share

Linky-Share is a high-performance, privacy-first, peer-to-peer (P2P) file sharing application built with a modular Vanilla JavaScript architecture. It enables secure, encrypted file transfers directly between browsers without intermediate servers.

## 🚀 Tech Stack
- **Core**: HTML5, Vanilla JavaScript (ES6+ Modules)
- **Styling**: Vanilla CSS + Tailwind CSS (via CDN)
- **P2P Engine**: PeerJS (WebRTC wrapper)
- **Security**: Web Crypto API (AES-GCM 256-bit encryption)
- **Deployment**: Netlify (CI/CD via GitHub)

## 📂 Project Structure
- `index.html`: Main entry point and UI layout.
- `css/main.css`: Custom design system, glassmorphism effects, and animations.
- `js/globals.js`: Global state (active connection, room PIN) and UI element mappings.
- `js/crypto.js`: Symmetric encryption/decryption using the room PIN as a key.
- `js/ui.js`: UI rendering logic, notifications, and media previews.
- `js/webrtc.js`: WebRTC handshake, data chunking (64KB), and file streaming engine.
- `js/app.js`: Application initialization and event listeners.

## 🛠 Key Features & Mechanisms
- **Symmetric Handshake**: Both peers use a shared alphanumeric PIN which is hashed to create a unique Peer ID.
- **End-to-End Encryption**: All data (files and chat) is encrypted/decrypted on the fly using the room PIN.
- **Large File Streaming**: Files > 50MB bypass memory buffering and use the **File System Writable File Stream API** to save directly to disk.
- **Ephemeral Chat**: A built-in P2P chat that exists only in memory and is cleared on disconnect.
- **Secure Context**: Requires HTTPS or localhost for WebRTC and Cryptography APIs.

## ⚠️ Development Guidelines
- **Maintain Modularization**: Logic is strictly separated into the `js/` modules. Avoid adding logic back into `index.html`.
- **State Management**: Use `globals.js` for shared state across modules.
- **UI Consistency**: Use the `notify(msg, type)` function for user feedback and `UI.*` mappings for DOM access.
- **Performance**: Chunk size is set to **64KB** for optimal WebRTC data channel performance.

## 🌐 Deployment
The project is configured for **Netlify**.
- **Root Directory**: `./`
- **Build Command**: None (Static)
- **Headers**: `netlify.toml` enforces strict HSTS and CSP headers.
