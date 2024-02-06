import { useState, useEffect } from 'react'
import { TobiiClient } from "tobiiprosdk-js"
import { waitForSocketState } from './utils'
import './App.css'

export type EyeTracker = {
  address: string;
  model: string;
  name: string;
  serial_number: string;
}

const client = new TobiiClient()

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [ets, setETS] = useState<EyeTracker[]>([]);
  const [etWs, setETWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    async function pingServer() {
      let response: {message: string} = await client.ping()
      console.log(response)
      if (response.message == "PING") {
        setConnected(true)

        let response: EyeTracker[] = await client.getEyeTrackers()
        setETS(response)
      }
    }
    pingServer();
  }, [])

  async function connect() {
    console.log("Connect")
    if (ets.length == 0) {
      console.error("No eye-trackers available")
      return
    }

    const ws = await client.connectToEyeTracker(ets[0].serial_number);
    setETWs(ws)
    // const ws: WebSocket = new WebSocket("ws://localhost:9999/ws")
    // await waitForSocketState(ws, ws.OPEN)
    ws.send("Hello, world!")

    // Correct way to set event listeners on WebSocket
    ws.onmessage = (event: any) => {
      console.log(event.data);
    };

    ws.onerror = (event: any) => {
        console.error("WebSocket error:", event);
    };

    ws.onopen = () => {
        console.log("WebSocket connection established");
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };

    setRunning(true)
  }

  async function disconnect() {
    console.log("Disconnect")

    if (etWs) {
      etWs.close()
    }

    setRunning(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className={`${connected ? "text-green-500" : "text-red-500"}`}>{`Status: ${connected ? "SUCCESS" : "FAILURE"}`}</p>

        {/* Iterate over the available eye-trackers */}
        {ets.map((tracker, index) => (
          <div key={index} className="flex flex-col gap-2 bg-zinc-900">
            <p>{`Name: ${tracker.name}`}</p>
            <p>{`Model: ${tracker.model}`}</p>
            <p>{`Serial Number: ${tracker.serial_number}`}</p>
            <p>{`Address: ${tracker.address}`}</p>
          </div>
        ))}

        {running
          ? <button onClick={disconnect}> Stop</button>
          : <button onClick={connect} disabled={ets.length == 0}> Start Eye-Tracker</button>
        }
      </div>
    </>
  )
}

export default App
