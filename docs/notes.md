REST: $3.5 per million requests
lambda: $0.0000000021 per ms
lambda: $0.2 per million

total: $3.7 per million + $0.0000000021 per ms

for 1 million requests at 100ms each (rough average to get transactions): $3.91

assuming polling rate of 1 per 5 seconds

$46.92 per million minutes

Websockets: $0.285 per million minutes + $1.14 per million requests
Lambda: $0.0000000021 per ms + $0.2 per million requests

total: $12.6 per million minutes + $0.268 (assuming one websocket averages 5 minutes) = $12.868


poll every 18.6 seconds for roughly equivalent cost