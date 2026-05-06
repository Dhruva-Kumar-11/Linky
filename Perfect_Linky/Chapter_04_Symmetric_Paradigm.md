# Chapter 4: The Symmetric Paradigm

## 4.1 Dissolution of Host and Guest Roles
In legacy networking paradigms, the distinction between a 'Host' (server) and a 'Guest' (client) is rigid. Even in early P2P implementations, one node often assumes a super-node or authoritative role. Linky introduces the "Symmetric Paradigm," a conceptual and architectural breakthrough that completely dissolves the asymmetry between peers.

Once a Linky connection is established via the initial handshake, both Node A and Node B exist in identical state machines. There is no master and no slave. 

## 4.2 Bi-Directional State Mutability
The Symmetric Paradigm means that both users possess equal authority over the connection state. 
*   Either peer can initiate a file transfer.
*   Either peer can stream a message or media.
*   Either peer can terminate the connection.

This is achieved by implementing an event-driven architecture where the `RTCDataChannel` acts as a bidirectional multiplexer. Control frames (JSON-serialized commands) and Data frames (binary file chunks) are interleaved. Both peers parse incoming control frames and update their local React state synchronously. 

## 4.3 UI/UX Implications of Symmetry
The user interface reflects this underlying technical symmetry. The application layout does not favor the "room creator" over the "joiner." The shared canvas allows both users to drag and drop files simultaneously, resulting in concurrent, bidirectional streaming. This symmetric approach profoundly impacts the psychological feel of the application, transforming it from a transactional tool (like FTP) into a collaborative, real-time shared space.

By enforcing strict symmetry at the protocol and state management layers, Linky achieves a robust, resilient architecture where the failure or disconnection of one peer symmetrically and gracefully tears down the session for the other, preventing dangling states and memory leaks.