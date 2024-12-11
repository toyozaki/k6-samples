# k6-samples

This repository contains sample scripts for k6 to test gRPC and WebSocket.

## Prerequisites
```shell
$ brew install k6
```

## gRPC

### Launch gRPC server
```shell
$ git clone https://github.com/toyozaki/grpc_sample
$ cd grpc_sample
$ go run server/main.go
```

### Run gRPC client (k6)
```shell
$ k6 run grpc/src/unary-request.js
$ k6 run grpc/src/client-streaming.js
$ k6 run grpc/src/server-streaming.js
$ k6 run grpc/src/bidirectional-streaming.js
```

## WebSocket
\* This is still experimental.

### Launch WebSocket server

```shell
$ git clone https://github.com/toyozaki/websocket_sample
$ cd websocket_sample
$ go run main.go
```

### Run WebSocket client (k6)
```shell
$ k6 run websocket/src/sample.js
```

## References
- https://grafana.com/docs/k6/latest/using-k6/protocols/grpc/
- https://grafana.com/docs/k6/latest/using-k6/protocols/websockets/