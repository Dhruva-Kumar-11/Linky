# Chapter 14: The Future Roadmap

## 14.1 Beyond the Browser Tab
Linky's current architecture is highly optimized for ephemeral, browser-based sessions. The immediate roadmap focuses on expanding beyond the limitations of the sandbox.

## 14.2 Universal File System Access API
Currently, streaming directly to disk is limited to Chromium browsers. As the File System Access API standardizes across WebKit (Safari) and Gecko (Firefox), Linky will universally adopt direct-to-disk streaming, officially removing all arbitrary file size limitations globally.

## 14.3 Multi-Peer Mesh Networking
The current symmetric paradigm is strictly a 1:1 connection. The next major architectural leap is supporting 1:N and N:N mesh topologies. 
If Node A needs to send a file to Nodes B, C, and D, current WebRTC implementations require Node A to upload the file three times. A multi-peer mesh would allow Node B to begin seeding chunks to Nodes C and D while simultaneously downloading from Node A (similar to the BitTorrent protocol), drastically reducing the upload burden on the initiator.

## 14.4 Advanced Cryptographic Identity
While the PIN system provides excellent ephemeral security, it lacks persistence. The roadmap includes integration with WebAuthn and potentially decentralized identity protocols (e.g., DID, verifiable credentials). This would allow users to cryptographically verify the identity of a peer (e.g., "Verify this is Alice's verified device") via public-key cryptography without requiring a centralized authentication server.

## 14.5 Progressive Web App (PWA) Enhancements
Linky will deepen its integration as a PWA, utilizing the Web Share API and File Handling API. This will allow users to right-click a file in their native OS (Windows Explorer, macOS Finder) and select "Share via Linky," instantly opening the app and queuing the file, blurring the line between web application and native desktop software.