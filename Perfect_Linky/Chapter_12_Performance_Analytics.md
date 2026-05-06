# Chapter 12: Performance Analytics

## 12.1 Telemetry Aggregation
To provide users with actionable insights during a transfer, Linky continuously aggregates performance metrics. The underlying `RTCPeerConnection` API provides a `getStats()` method, which yields a wealth of low-level transport data (bytes sent, round-trip time, packet loss). However, querying this at 60fps causes main-thread blockages. Linky samples this API at an optimized interval (e.g., 1000ms).

## 12.2 Delta Speed Calculations
Calculating accurate real-time speed requires computing the delta (difference) of bytes transferred over a specific time window.
The formula: `Speed (B/s) = (Bytes_Current - Bytes_Previous) / (Time_Current - Time_Previous)`
Because network throughput is volatile, displaying raw delta speed results in a chaotic, flickering UI. Linky implements an Exponential Moving Average (EMA) algorithm. The EMA applies a weighting factor, smoothing the curve so the displayed MB/s value is stable and representative of the recent trend, rather than millisecond-level spikes.

## 12.3 Time-to-Completion (TTC) Logic
Accurately predicting the remaining time (TTC) is notoriously difficult (often colloquially referred to as the "Windows copy dialog problem").
Linky improves TTC accuracy by:
1.  Using the smoothed EMA speed rather than instantaneous speed.
2.  Maintaining a rolling buffer of historical speeds over the last 10 seconds.
3.  Calculating: `TTC = Remaining_Bytes / Smoothed_Speed`.
If the speed drops to zero (due to temporary network partition), the TTC algorithm gracefully shifts to a "calculating..." state rather than displaying an infinite time.

## 12.4 Network Health Indicators
By analyzing packet loss and Round Trip Time (RTT) from the `getStats()` dictionary, Linky provides a visual "Network Health" indicator. High packet loss triggers UI feedback, suggesting that the peers may be routing via a suboptimal TURN relay rather than a direct Host or STUN connection.