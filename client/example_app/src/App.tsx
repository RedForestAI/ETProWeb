import { useState } from 'react'
import { TobiiClient } from "tobiiprosdk-js"
import './App.css'

const client = new TobiiClient()

function App() {
  const [connected, setConnected] = useState<boolean>(false);

  async function connect() {
    console.log("Connect")
    setConnected(true);
  }

  async function disconnect() {
    console.log("Disconnect")
    setConnected(false);
  }

  return (
    <>
      <div>
        {connected
          ? <button onClick={disconnect}> Disconnect</button>
          : <button onClick={connect}> Connect to Server</button>
        }
      </div>
    </>
  )
}

export default App
