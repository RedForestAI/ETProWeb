# TobiiProWeb
Server and JS client for streaming real-time eye-tracking data from Tobii Pro SDK devices to the browser.

This is a monorepo, consisting of a ``server`` in Python FastAPI and a ``client`` in TS.

## Server

You can use the provided ``.exe`` for Windows to run the server, or you can install the package with the following:

```term
# Within the server folder
pip install -e .
```

Then you can use the ``tobii_pro_server`` CLI to start and configure the server:

```term
$ tobii_pro_server --help
usage: tobii_pro_server [-h] [--host HOST] [--port PORT] [--reload RELOAD] [--log_level LOG_LEVEL] [--workers WORKERS]

options:
  -h, --help            show this help message and exit
  --host HOST           Host to run the server on
  --port PORT           Port to run the server on
  --reload RELOAD       Whether to reload the server on changes
  --log_level LOG_LEVEL
                        Log level
  --workers WORKERS     Number of workers
```

## Client

The client library, located in the ``client`` folder, is called ``tobiiprosdk-js``. It can be installed with the following:

```term
npm install tobiiprosdk-js
```

There is an example Vite+React+TS application within the ``example_app`` folder. To access the eye-tracker, make sure to run the server and connect the eye-tracker first. To run, use the following command:

```term
# Within the example_app folder
npm install
npm run dev
```

For the client-side API, here are some examples: 

```ts
import { TobiiClient } from "tobiiprosdk-js"

const client = new TobiiClient()

// Check if the server is available
const response = await client.ping()
console.log(response.message == "PING")

// Get the available eye-trackers to the local computer (make sure to run within an async context)
let response = await client.getEyeTrackers()

// Connect to one of the eye-trackers, establishing a WS communication
// Use the eye-tracker's serial number to selece one
const ws = await client.connectToEyeTracker("123456789")

// Define the onmessage to listen and process incoming gaze data
// Correct way to set event listeners on WebSocket
ws.onmessage = (event: any) => {
    console.log(event)
}
```

