# Module Deep Dive: Internal Logic & Functions

Linky is architected into 12 distinct functional modules, each encapsulated within the `index.html` structure.

## Module 1: Aesthetic & Presentation Engine
*   **Function:** Manages the visual state and "Glassmorphism" theme.
*   **Key Logic:** `hsla()` color space manipulation for mesh backgrounds and `backdrop-filter` for transparency.

## Module 2: Core Connectivity (WebRTC)
*   **Function:** Manages the PeerJS initialization and connection lifecycle.
*   **Key Logic:** `initPeer(id, pin)` and `setupConnection(conn)`. Enforces the `LINKY-` namespace prefix.

## Module 3: Orchestration & UI State
*   **Function:** Transitions the app between "Setup" and "Workspace" views.
*   **Key Logic:** CSS class toggling (`hidden`, `opacity-0`) and `UI` object caching for performance.

## Module 4: Hybrid PIN Input
*   **Function:** Handles both physical keyboard and virtual keypad inputs.
*   **Key Logic:** `syncPinUI()` and `window.press()`. Uses a `<template>` tag for dynamic slot generation.

## Module 5: Symmetric Data Streaming
*   **Function:** Orchestrates the 64KB chunked file transfer.
*   **Key Logic:** `streamFile(file)` and `processQueue()`. Uses `file.stream().getReader()` for memory efficiency.

## Module 6: Telemetry & Progress
*   **Function:** Provides real-time feedback on transfer percentage and speed.
*   **Key Logic:** `tickProgress(id, cur, tot)`. Uses `setInterval` for throttled speed calculations.

## Module 7: Session History
*   **Function:** Maintains a log of all transfers during the current session.
*   **Key Logic:** `logHistory(name, size, dir)` with `formatBytes()` utility.

## Module 8: Cryptographic Integrity (AES-GCM)
*   **Function:** Adds an extra layer of encryption to the file chunks.
*   **Key Logic:** `deriveKey(pin)`, `encryptChunk()`, and `decryptChunk()`. Uses the PIN as the salt material.

## Module 9: Media Gallery & Preview
*   **Function:** Automatically previews images and videos upon receipt.
*   **Key Logic:** `showPreview(blob, name, type)` utilizing `URL.createObjectURL()`.

## Module 10: Performance Analytics
*   **Function:** Calculates "Delta" speed (MB/s) and connection health.
*   **Key Logic:** `flowStats` tracker with 1-second sampling intervals.

## Module 11: Multi-Asset Batch Management
*   **Function:** Manages a sequential queue for multiple file drops.
*   **Key Logic:** `transferQueue` array and `isTransferring` flag.

## Module 12: Ephemeral Chat
*   **Function:** Real-time, side-channel communication.
*   **Key Logic:** `sendChatMessage()` and `appendChat()`. Messages exist only in the DOM and are purged on refresh.
