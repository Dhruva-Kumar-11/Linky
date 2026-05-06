# UI/UX Design & Aesthetic Engineering

## 1. Design Language: Glassmorphism
Linky's visual identity is defined by **Glassmorphism**, which creates a sense of depth and hierarchy using transparency and blur.
*   **Backdrop Filter:** `backdrop-filter: blur(20px)` is applied to all `.glass` containers, allowing the background colors to bleed through while maintaining readability.
*   **Subtle Borders:** `border: 1px solid rgba(255, 255, 255, 0.08)` provides a sharp, physical edge to the floating panels.

## 2. Dynamic Mesh Backgrounds
Instead of using heavy image assets, Linky uses CSS-native radial gradients.
*   **HSLA Color Space:** Using `hsla()` allows for smooth, programmatic transitions between hues without the harshness of RGB.
*   **Layering:** Three radial gradients positioned at the top-left, top-center, and top-right blend mathematically to create a unique "aura" on every screen resolution.

## 3. Hybrid PIN Input System
To ensure Linky is as usable on a smartphone as it is on a desktop:
*   **Visual Slots:** 12 distinct slots provide immediate visual feedback of the current PIN state.
*   **The Bridge Logic:** A hidden `mobilePinBridge` input captures system-level keyboard events on mobile devices and syncs them to the custom visual slots.
*   **Tactile Feedback:** Virtual keypad buttons use scale transformations (`scale(0.92)`) to simulate physical depression.

## 4. Animation & Flow
Linky uses high-frame-rate CSS transitions for all state changes.
*   **Slide-Up Entry:** The workspace uses `translate-y-8` and `opacity-0` with a `cubic-bezier` timing function to feel organic when the connection opens.
*   **The "Sealed Tunnel" Animation:** The connection badge pulsates and shakes when a link is established, providing a "high-signal" confirmation to the user.

## 5. Theme Synchronization
*   **Dark Mode (Default):** Deep slates and indigo highlights minimize eye strain and highlight the glowing mesh.
*   **Light Mode:** High-contrast slates and vibrant purples ensure accessibility in bright environments. The mesh opacity is reduced to `0.12` to prevent "visual noise."
