# Chapter 10: User Interface Logic

## 10.1 PIN Synchronization Dynamics
The entry point to a Linky session is the PIN synchronization mechanism. The UI logic must handle state transitions seamlessly: generating a code for the initiator, validating input for the joiner, and providing real-time visual feedback.
The input component is typically an array of controlled text fields, aggressively managing cursor focus, backspace logic, and clipboard pasting to ensure a frictionless 6-digit entry experience.

## 10.2 Mobile Bridges and Responsiveness
Linky is built with a mobile-first philosophy. The UI logic gracefully degrades from a multi-column desktop layout to a stacked, touch-friendly mobile interface.
Crucially, Linky implements "Mobile Bridges." Recognizing that typing a 6-digit PIN across devices can be cumbersome, the UI dynamically generates QR codes containing the signaling room ID and cryptographic seed. A user can simply point their mobile camera at the desktop screen to establish a secure, authenticated WebRTC link instantly.

## 10.3 Tactile Feedback Engineering
In a browser environment, replacing native desktop tactile feedback requires precise animation and micro-interactions.
Linky utilizes spring-physics-based animations (often via libraries like Framer Motion or React Spring) to give UI elements mass and inertia.
*   Drag-and-drop zones scale up with elastic bounce on `dragenter`.
*   Buttons provide a 3D "press" effect by utilizing `transform: scale(0.95)` and adjusting box-shadows.
*   Progress bars do not jump linearly; they interpolate between states using ease-out-cubic timing functions, creating a perception of speed and smoothness even if the network delivery is bursty. 
These micro-interactions are computationally inexpensive but critical for user satisfaction.