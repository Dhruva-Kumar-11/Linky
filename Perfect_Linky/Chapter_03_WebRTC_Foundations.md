# Chapter 3: WebRTC Foundations

## 3.1 The WebRTC Protocol Suite
Linky's core transport layer is powered by WebRTC (Web Real-Time Communication), a complex suite of protocols designed for ultra-low latency, peer-to-peer data exchange. The implementation relies heavily on the `RTCDataChannel` API, which leverages SCTP (Stream Control Transmission Protocol) over DTLS (Datagram Transport Layer Security) over UDP.

## 3.2 Session Description Protocol (SDP)
Connection establishment begins with the exchange of SDP payloads. An SDP offer or answer is a string-based protocol that describes the multimedia and data channel capabilities of the peer. In Linky, the SDP outlines the parameters for the SCTP association, including maximum message size and DTLS fingerprint. The generation, serialization, and secure signaling of the SDP are paramount to establishing the peer connection.

## 3.3 Interactive Connectivity Establishment (ICE)
Because peers often reside behind NATs (Network Address Translators) and firewalls, direct IP routing is rarely straightforward. Linky utilizes the ICE framework to systematically discover the optimal routing path. 
*   **Host Candidates:** Local IP addresses (ideal for LAN transfers).
*   **Server Reflexive Candidates (STUN):** Public IP addresses discovered via a Session Traversal Utilities for NAT (STUN) server. The STUN server reflects the peer's public IP and port back to it.
*   **Relay Candidates (TURN):** When symmetric NATs or strict firewalls block direct connection, Traversal Using Relays around NAT (TURN) servers are used to relay traffic. 

Linky's ICE agent aggressively gathers and evaluates these candidates, prioritizing Host -> STUN -> TURN to ensure connectivity while minimizing reliance on external relays.

## 3.4 The Signaling Infrastructure
WebRTC does not prescribe a signaling mechanism; peers must exchange SDP and ICE candidates out-of-band. Linky utilizes an ephemeral signaling channel (typically via WebSockets) to facilitate this exchange. The signaling payload is kept lightweight—only essential cryptographic handshakes and WebRTC metadata traverse the signaling server. Once the `RTCPeerConnection` transitions to a `connected` state, the signaling channel is gracefully terminated, and all subsequent data flows peer-to-peer.