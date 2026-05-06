# Chapter 1: Introduction to the Linky P2P Ecosystem

## 1.1 Project Vision
Linky represents a paradigm shift in direct peer-to-peer (P2P) data transmission, engineered to bypass the inherent bottlenecks and privacy vulnerabilities of traditional cloud-mediated file sharing. The vision driving Linky is the complete decentralization of user data during transit, ensuring that large-scale files and real-time streams can be exchanged securely, instantaneously, and without intermediary custody. 

## 1.2 Background
Historically, file sharing has relied on a client-server architecture where a user uploads a file to a centralized cloud repository, and the recipient subsequently downloads it. This architecture introduces double-hop latency, bandwidth duplication, and a fundamental breach of data sovereignty. The introduction of Web Real-Time Communication (WebRTC) APIs in modern browsers provided the raw primitives for direct browser-to-browser communication, but implementing robust file transfer on top of WebRTC requires complex orchestration of signaling, state management, and cryptographic validation. Linky was conceived to abstract this complexity into a seamless, symmetric user experience.

## 1.3 The Problem Landscape
The contemporary digital landscape is fraught with technical and ethical challenges regarding data transfer:
*   **Latency and Bandwidth:** Cloud-based sharing requires `O(2n)` bandwidth (upload + download). P2P sharing reduces this to `O(n)`.
*   **Data Sovereignty and Privacy:** Intermediary servers are attack vectors. Zero-custody transfer models are imperative for sensitive corporate and personal data.
*   **Friction and Accessibility:** Existing secure transfer tools often require client installations, complex key management, or account registrations. Linky eliminates friction by utilizing pure web technologies, operating entirely within the ephemeral context of a browser tab.

Linky addresses this landscape by synthesizing WebRTC data channels with advanced cryptographic primitives, all wrapped in a zero-friction, glassmorphic user interface.