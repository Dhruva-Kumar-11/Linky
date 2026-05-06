# Chapter 11: Security Hardening

## 11.1 Threat Modeling and the Zero-Custody Profile
Linky's fundamental security advantage is its zero-custody architecture; there is no central database to breach. However, client-side vulnerabilities represent the primary attack surface. Threat modeling focuses on malicious actors attempting to execute arbitrary code, steal cryptographic keys from memory, or spoof peer identities.

## 11.2 Content Security Policy (CSP)
A highly restrictive Content Security Policy is the first line of defense. The CSP headers configured for Linky completely disable inline scripts (`'unsafe-inline'`), prohibit the execution of `eval()`, and strictly whitelist the domains from which scripts, styles, and WebRTC STUN/TURN traffic can originate. 
Example directive:
`default-src 'self'; connect-src 'self' stun.l.google.com:19302 wss://signaling.linky.app; script-src 'self'; object-src 'none';`
This mitigates the vast majority of Cross-Site Scripting (XSS) and data exfiltration vectors.

## 11.3 XSS Defense and DOM Sanitization
Because Linky includes a Chat module and handles arbitrary filenames, it is vital to sanitize all data parsed from the `RTCDataChannel` before rendering it into the React DOM. While React inherently escapes string variables, Linky implements additional sanitization layers (e.g., DOMPurify) when rendering complex payloads to ensure that malicious SVGs or maliciously named files (`<script>alert(1)</script>.jpg`) cannot inject execution contexts.

## 11.4 Mitigating Man-in-the-Middle (MitM)
The signaling phase is theoretically vulnerable to MitM attacks where a compromised server could swap SDPs and inject itself as a proxy. Linky mitigates this by tying the PBKDF2 derived key to the out-of-band PIN. If the signaling server intercepts the connection, it cannot decrypt the WebRTC data channel payload because it lacks the out-of-band PIN used to generate the AES-GCM symmetric keys. The WebRTC DTLS fingerprints provide further verification of peer identity.