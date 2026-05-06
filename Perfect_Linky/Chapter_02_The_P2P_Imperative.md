# Chapter 2: The P2P Imperative

## 2.1 The Architectural Dichotomy: Client-Server vs. P2P
The traditional client-server model inherently centralizes network traffic. When Node A wishes to send a 5GB payload to Node B, the data must traverse the network to a central server (Server S), requiring 5GB of ingress bandwidth, storage IOPS on S, and a subsequent 5GB of egress bandwidth to Node B. 

The P2P imperative, realized by Linky, eliminates Server S from the data path. Network topology is flattened, allowing Node A to stream data directly to Node B. This topology not only halves the required bandwidth across the global network but also significantly reduces the Time-to-First-Byte (TTFB) and overall latency, as the route is determined by the shortest path through the Internet backbone rather than routing via a potentially geographically distant datacenter.

## 2.2 Latency and Throughput Analysis
In a direct P2P connection, the maximum throughput is theoretically bounded only by the minimum bandwidth of the bottleneck link between the two peers (typically the uplink of the sender or the downlink of the receiver). By bypassing the cloud, Linky avoids server-side throttling, concurrent connection limits, and storage disk I/O bottlenecks. 

Furthermore, latency is minimized to the physical propagation delay between the peers, plus minimal routing overhead. For peers within the same Metropolitan Area Network (MAN) or Local Area Network (LAN), WebRTC can establish local host candidates, allowing gigabit speeds that are entirely impossible in a cloud-mediated system.

## 2.3 The Privacy Imperative: Zero-Custody Transfer
Perhaps the most critical argument for the P2P imperative is privacy. In client-server models, data at rest on intermediary servers is vulnerable to breaches, insider threats, and subpoena. Linky enforces a zero-custody model. Data exists only in the volatile memory (RAM) of the sender and receiver, and encrypted in transit. Once the browser tabs are closed, the data path and all associated cryptographic keys are cryptographically erased, leaving zero digital footprint.