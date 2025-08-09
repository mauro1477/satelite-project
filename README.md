Satellite Telemetry Demo
Real-time telemetry demo:

Backend: C++17 with uWebSockets/uSockets (libuv, OpenSSL, zlib). Publishes JSON on a topic via WebSocket.

Frontend: React (Vite) that subscribes and charts values.

.
├─ backend-server/
│  ├─ CMakeLists.txt
│  ├─ src/
│  │  └─ main.cpp
│  └─ external/
│     └─ uWebSockets/      # vendor checkout (includes uSockets)
└─ telemetry-ui-front-end/
   ├─ src/App.jsx
   ├─ src/useTelemetry.js
   └─ .env.local            # set VITE_WS_URL here


### Back-End Setup

1. **Clone uWebSockets inside `backend-server/external/`**
    ```bash
    cd backend-server/external/
    git clone --recursive https://github.com/uNetworking/uWebSockets.git

    cd ../../backend-server
    mkdir build && cd build
    cmake ..
    make

    ./MyUWSApp
    



