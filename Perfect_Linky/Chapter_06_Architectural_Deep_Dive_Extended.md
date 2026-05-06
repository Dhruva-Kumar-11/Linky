# Chapter 6: Architectural Deep Dive Extended (Modules 7-12)

Continuing the architectural analysis, this chapter explores the advanced features and utility modules.

## Module 7: History (The Ephemeral Ledger)
The History module tracks all transfers and chats within the active session. Because Linky is zero-custody, this ledger is strictly ephemeral, stored only in RAM. It manages the serialization of events to provide a timeline view, allowing users to track what was sent, received, and failed.

## Module 8: Crypto (The Security Subsystem)
This crucial module interfaces with the Web Crypto API. It is responsible for:
*   Deriving the shared session key via PBKDF2 using the room PIN as entropy.
*   Encrypting outgoing chunks and decrypting incoming chunks using AES-GCM.
*   Generating deterministic IVs (Initialization Vectors) or nonces to prevent replay attacks.

## Module 9: Media (Stream Processing)
For audio/video capabilities, the Media module interacts with `navigator.mediaDevices.getUserMedia`. It handles track negotiation, adding `MediaStreamTrack` objects to the existing `RTCPeerConnection`. It also manages localized processing, such as audio suppression or video scaling, prior to encoding.

## Module 10: Analytics (The UI Metrics Bridge)
Working in tandem with Telemetry (Module 6), the Analytics module applies smoothing algorithms (e.g., Exponential Moving Average) to the raw telemetry data. This prevents the UI from flickering wildly and provides a human-readable representation of speed, Time-To-Completion (TTC), and network health.

## Module 11: Batch (Multi-file Orchestration)
When a user drops multiple files or a directory, the Batch module queues the operations. It manages parallel versus sequential transfer strategies over the data channel, assembling metadata headers for batch transfers so the receiving peer can reconstruct the directory structure accurately.

## Module 12: Chat (Out-of-band Communication)
The Chat module uses the same `RTCDataChannel` but multiplexes text messages by defining a custom JSON protocol envelope (e.g., `{ type: 'chat', payload: 'Hello' }`). It handles text encoding/decoding, typing indicators, and read receipts, completely independent of the binary file streaming logic.