# Abstract: Linky Symmetric P2P Share

## Overview
Linky is a high-performance, browser-native Peer-to-Peer (P2P) file sharing application designed with a "Symmetric Paradigm." It eliminates the traditional client-server bottleneck by establishing a direct, encrypted tunnel between two devices using WebRTC technology. 

## The Core Philosophy
The project is built on the principle of **Zero-Data Custody**. Unlike traditional cloud services (Google Drive, WeTransfer, Dropbox) that require files to be uploaded to a central server, Linky facilitates data transfer directly from the sender's RAM to the receiver's RAM/Disk. This ensures maximum privacy, reduced latency, and a serverless footprint.

## Primary Objectives
1. **Privacy:** End-to-end encryption using DTLS/SRTP and a secondary layer of AES-GCM 256.
2. **Speed:** Direct transfers that utilize the full available bandwidth of the peer-to-peer connection.
3. **Simplicity:** A single-file HTML delivery mechanism requiring zero installation or account creation.
4. **Symmetry:** Bidirectional sharing where "Host" and "Guest" roles dissolve into equal peers once connected.

## Scope
The current implementation supports all modern browsers with WebRTC capabilities. It handles alphanumeric PIN-based room discovery and offers a glassmorphic UI for a premium, native-app feel.
