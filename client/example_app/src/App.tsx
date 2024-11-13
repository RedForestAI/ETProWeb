import React, { useState, useEffect } from 'react'
import { TobiiClient } from "etsdk-js"
import './App.css'

export type EyeTracker = {
  address: string;
  model: string;
  name: string;
  serial_number: string;
}

const client = new TobiiClient(9999, 'https://localhost', 'wss://localhost')

function GazeDot(props: {x: number, y: number}){
  
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    left: '-5px',
    top: '-5px',
    background: 'red',
    borderRadius: '50%',
    opacity: 0.7,
    width: 20,
    height: 20,
    transform: `translate(${props.x.toFixed(2)}px, ${props.y.toFixed(2)}px)`,
  };

  useEffect(() => {
    console.log("GazeDot", props.x, props.y)
  }, [props.x, props.y])

  return <div id="GazeDot" style={style}></div>;
};

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [ets, setETS] = useState<EyeTracker[]>([]);
  const [etWs, setETWs] = useState<WebSocket | null>(null);
  const [gaze, setGaze] = useState<{x: number, y: number}>({x: 0, y: 0})

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

    // Correct way to set event listeners on WebSocket
    ws.onmessage = (event: any) => {
      let event_data = JSON.parse(event.data)
      let gaze = JSON.parse(event_data).value.gaze_data.left
      // console.log(gaze)

      // Convert the relative gaze position to absolute position
      let x = window.innerWidth * gaze[0]
      let y = window.innerHeight * gaze[1]

      setGaze({x: x, y: y})
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
      {running &&
        <GazeDot {...gaze}/>
      }
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
