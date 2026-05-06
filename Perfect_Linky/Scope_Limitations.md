# Scope, Limitations & Advantages

## 1. Project Scope
Linky is designed as a lightweight, "instant-on" utility for personal data transfer. It is ideal for:
*   Transferring photos/videos from phone to laptop.
*   Sharing large documents between coworkers without using Slack/Email.
*   Private communication in a "sealed tunnel" environment.

## 2. Advantages over Traditional Cloud
| Feature | Linky (P2P) | Cloud (Client-Server) |
| :--- | :--- | :--- |
| **Privacy** | End-to-end; no server storage. | Files stored on 3rd party disks. |
| **Speed** | Direct; no upload wait time. | Slower (Upload + Download). |
| **Accounts** | None required. | Registration/Login mandatory. |
| **Limits** | Limited only by Browser RAM. | Restricted by subscription tiers. |
| **Footprint** | 0MB on internet servers. | Permanent footprint in the cloud. |

## 3. Technical Limitations
*   **Symmetric NATs:** In highly restrictive corporate networks, WebRTC may fail without a TURN server (relay).
*   **Receiver RAM:** The receiver currently buffers the entire file into a Blob. Files larger than 2GB may crash browsers on low-end devices.
*   **Persistence:** Once the tab is closed, all session history and the connection are permanently deleted.

## 4. Future Roadmap
1.  **Direct-to-Disk Writing:** Utilizing the File System Access API to stream 50GB+ files without RAM constraints.
2.  **Multi-Peer Mesh:** Creating rooms for 3+ users to share assets simultaneously.
3.  **Visual Hash Verification:** QR-code based peer verification to prevent Man-in-the-Middle attacks.
