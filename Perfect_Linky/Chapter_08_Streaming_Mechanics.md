# Chapter 8: Streaming Mechanics

## 8.1 The 64KB Chunking Strategy
WebRTC Data Channels are not designed to transmit gigabyte-sized files in a single operation. Attempting to do so will exceed the browser's internal buffers and crash the tab. Linky implements a precise chunking strategy. Files are sliced into deterministic sizes—optimally 64KB (65,536 bytes) or 16KB depending on the negotiated SCTP limits and network MTU. 
This chunking enables:
*   Stream interleaving (sending control messages between file chunks).
*   Fine-grained progress reporting.
*   Low memory overhead during encryption and transmission.

## 8.2 Backpressure Management (`bufferedAmount`)
The most complex aspect of P2P streaming is managing backpressure. If the CPU reads the file from disk faster than the network can transmit it, the underlying SCTP buffer will bloat, leading to connection termination.
Linky rigorously monitors the `RTCDataChannel.bufferedAmount` property. 
The algorithm:
1.  Read a chunk and call `send()`.
2.  Check `bufferedAmount`.
3.  If `bufferedAmount` exceeds a high-water mark (e.g., 1MB), the streaming loop pauses.
4.  Linky listens for the `onbufferedamountlow` event to resume the stream.
This ensures a perfectly balanced data pump, preventing Out-Of-Memory (OOM) errors regardless of network speed or file size.

## 8.3 Binary Blob Reconstruction
On the receiving peer, incoming 64KB `ArrayBuffer` chunks are captured via the `onmessage` event. 
1.  The chunks are decrypted by the Crypto module.
2.  The raw binary data is pushed into an array.
3.  Because retaining gigabytes of `ArrayBuffers` in RAM is inefficient, Linky periodically flushes these arrays into larger `Blob` objects.
4.  Upon completion, the final collection of Blobs is concatenated into a single master `Blob` representing the entire file.
5.  An ephemeral `URL.createObjectURL(blob)` is generated, dynamically creating a hidden anchor (`<a>`) tag to trigger the browser's native download mechanism, writing the data securely to the user's local disk.