# Speaker Script: Presenting Linky v2.0

## Intro (Slide 1)
"Good morning everyone. Today, I want to talk to you about **Linky**, a project that completely changes how we think about sharing files on the internet. It’s a tool that is secure, serverless, and completely private."

## The Problem (Slide 2)
"Think about the last time you shared a file. You probably used Google Drive, WhatsApp, or Email. But have you ever noticed how slow it is? You have to wait for the upload to finish before your friend can even start downloading. And more importantly—your files are sitting on a server owned by a big company. Do you really know who's looking at them?"

## The Solution (Slide 3)
"Linky solves this by using a **Symmetric P2P Paradigm**. Instead of sending files *to* a server, Linky sends files *directly* to your friend. It’s like a digital private tunnel. No accounts, no servers, and zero data custody. The file stays on your device until it reaches its destination."

## How it Works (Slide 4)
"Technically, we use **WebRTC**, the same technology behind high-quality video calls. When you enter a PIN, Linky performs a 'secret handshake' to find your friend on the internet. We then slice the file into 64KB chunks and beam them across the connection. It's efficient and very stable."

## Security (Slide 5)
"Security was my top priority. We use **SHA-256** to hide your room PIN, so hackers can't just guess their way in. On top of that, every file is encrypted with **AES-GCM 256**, the same standard used by governments. It’s a double-locked door."

## Symmetry (Slide 6)
"One of the coolest things about Linky is that it’s **Symmetric**. Unlike other apps where one person is the 'sender' and the other is the 'receiver,' in Linky, both people are equal. You can both drag and drop files at the exact same time."

## Demo/Visuals (Slide 7)
"As you can see from the interface, I used a **Glassmorphic** design. It uses blur and transparency to look like frosted glass. It’s modern, clean, and runs entirely in your browser as a single file."

## Conclusion (Slide 9)
"In conclusion, Linky is a small app with a big mission: to give privacy back to the user. It’s free, it’s fast, and it’s ready to use. Thank you for your time, and I’m happy to answer any questions!"
