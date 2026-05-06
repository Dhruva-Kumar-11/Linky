# Chapter 13: Technical Constraints and Limitations

## 13.1 Memory Heap Limits (The Blob Accumulation Problem)
The most significant technical constraint in web-based P2P file transfer is RAM. Unlike native desktop applications which can stream incoming bytes directly to disk via file descriptors, standard web browsers must accumulate incoming data in memory before constructing a downloadable `Blob`.
On mobile devices, V8 engine heap limits can be as low as 512MB to 1.5GB. Attempting to receive a 4GB ISO file will result in an Out-Of-Memory crash. While chunking (Chapter 8) solves the *sending* memory issue, the *receiving* peer remains constrained.

## 13.2 Overcoming Constraints: The File System Access API
The ultimate solution to the memory limit is the modern File System Access API (`showSaveFilePicker`). Where supported (primarily Chromium-based browsers), Linky leverages this API to request write access to a specific file on the user's disk. 
Once granted, Linky pipes the incoming, decrypted 64KB chunks directly to a `FileSystemWritableFileStream`. This bypasses the memory heap entirely, enabling infinite-size file transfers, limited only by the user's hard drive space.

## 13.3 Symmetric NAT and Relays
While ICE attempts to establish direct connections, networks utilizing Symmetric NATs (common in large enterprise environments and some cellular networks) randomize external port mapping. This makes direct STUN-based hole punching mathematically impossible.
In these scenarios, Linky is forced to fall back to a TURN server. This negates the bandwidth benefits of P2P, as all traffic is relayed through the centralized TURN infrastructure, introducing latency and increasing server costs.

## 13.4 Cross-Browser Quirks
WebRTC implementation varies significantly across rendering engines. Safari (WebKit) often exhibits aggressive power-saving behaviors, terminating WebRTC connections when the app is backgrounded on iOS. Firefox (Gecko) handles SCTP window sizes slightly differently than Chrome (Blink), requiring Linky to dynamically adjust its chunking sizes and backpressure thresholds based on user-agent detection to ensure cross-platform compatibility.