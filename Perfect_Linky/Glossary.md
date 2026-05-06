# Technical Glossary

*   **AES-GCM (Advanced Encryption Standard - Galois/Counter Mode):** A symmetric-key cryptographic block cipher used in Linky for highly secure, authenticated encryption. It ensures both data confidentiality and integrity.
*   **Backpressure:** The resistance or force opposing the desired flow of data. In Linky, managed by monitoring the `bufferedAmount` to prevent overwhelming network/memory buffers.
*   **Blob (Binary Large Object):** A data type that stores a large amount of raw binary data. Linky accumulates chunks into Blobs before finalizing file downloads.
*   **CSP (Content Security Policy):** An added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.
*   **DTLS (Datagram Transport Layer Security):** A communications protocol that provides security for datagram-based applications, preventing eavesdropping, tampering, or message forgery.
*   **Glassmorphism:** A UI design trend characterized by semi-transparent, blurred backgrounds that mimic frosted glass, creating depth and visual hierarchy.
*   **ICE (Interactive Connectivity Establishment):** A framework used by WebRTC to find the best path to connect peers, utilizing STUN and TURN protocols to bypass NATs and firewalls.
*   **NAT (Network Address Translation):** A method of mapping an IP address space into another by modifying network address information in the IP header of packets while they are in transit across a traffic routing device.
*   **PBKDF2 (Password-Based Key Derivation Function 2):** A cryptographic function that derives a secure encryption key from a password or PIN (along with a salt) by applying a pseudorandom function repeatedly to increase the computational effort required for brute-force attacks.
*   **SCTP (Stream Control Transmission Protocol):** A transport-layer protocol used over DTLS in WebRTC's data channels to ensure reliable, sequenced delivery of data chunks.
*   **SDP (Session Description Protocol):** A standard format for describing multimedia communication sessions for the purposes of session announcement, session invitation, and parameter negotiation.
*   **STUN (Session Traversal Utilities for NAT):** A standardized set of methods, including a network protocol, for traversal of NAT gateways in applications of real-time voice, video, messaging, and other interactive communications.
*   **TTC (Time-To-Completion):** An estimated metric indicating how long an active file transfer will take to complete, based on smoothed real-time bandwidth algorithms.
*   **TURN (Traversal Using Relays around NAT):** An extension to STUN used when direct peer-to-peer communication is impossible (e.g., behind strict Symmetric NATs), relaying traffic through a centralized server.
*   **WebRTC (Web Real-Time Communication):** A free, open-source project providing web browsers and mobile applications with real-time communication via simple application programming interfaces (APIs).
*   **Zero-Custody:** A privacy model where an application or service facilitates data transfer without ever storing the data at rest on an intermediary server. Data exists solely on the participant nodes.