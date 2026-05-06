# Chapter 5: Architectural Deep Dive (Modules 1-6)

Linky's codebase is heavily modularized. This chapter dissects the first six core modules that form the foundation of the application.

## Module 1: Aesthetics (The Visual Engine)
The Aesthetics module manages the DOM rendering pipeline, focusing on GPU-accelerated CSS and the Glassmorphism design language. It handles dynamic theme generation, utilizing CSS custom properties for runtime theme switching without forcing component remounts. 

## Module 2: Connectivity (The WebRTC Wrapper)
This is the heart of Linky. The Connectivity module abstracts the `RTCPeerConnection` API. It manages:
*   Signaling state transitions (have-local-offer, have-remote-offer).
*   ICE connection state (checking, connected, disconnected, failed).
*   Data Channel lifecycle events.
It implements robust retry logic and exponential backoff for signaling failures.

## Module 3: State (The Immutable Store)
Managing asynchronous P2P state requires strict immutability. The State module utilizes a Flux-like architecture (e.g., React Context + reducers) to manage the global application state. It ensures that UI components only re-render when necessary, optimizing the virtual DOM diffing algorithm.

## Module 4: Input (Drag-and-Drop Orchestration)
The Input module extends the HTML5 File API. It provides a global drag-and-drop overlay, handling `dragenter`, `dragover`, and `drop` events. Crucially, it parses directories, flattens file trees, and extracts metadata (MIME type, size) before passing the `File` objects to the Streaming module.

## Module 5: Streaming (The Data Pump)
The Streaming module is responsible for taking a `File` object and chunking it into WebRTC-compatible `ArrayBuffer` segments. It manages the read stream using the `FileReader` or modern `ReadableStream` API, feeding chunks to the `RTCDataChannel.send()` method while strictly monitoring the `bufferedAmount` to manage backpressure.

## Module 6: Telemetry (Real-time Metrics)
The Telemetry module aggregates data from the Connectivity and Streaming modules. It calculates real-time bandwidth (Tx/Rx), packet loss estimates, and network latency. This data is fed into the Analytics module (Module 10) for UI rendering, providing users with transparent performance metrics.