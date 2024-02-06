import { useState, useEffect } from 'react'
import { TobiiClient } from "tobiiprosdk-js"
import './App.css'

const client = new TobiiClient()

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    async function pingServer() {
      let response: {message: string} = await client.ping()
      console.log(response)
      if (response.message == "PING") {
        setConnected(true)
      }
    }
    pingServer();
  }, [])

  async function connect() {
    console.log("Connect")
    // setConnected(true);
  }

  async function disconnect() {
    console.log("Disconnect")
    // setConnected(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className={`${connected ? "text-green-500" : "text-red-500"}`}>{`Status: ${connected ? "SUCCESS" : "FAILURE"}`}</p>
        {running
          ? <button onClick={disconnect}> Stop</button>
          : <button onClick={connect}> Start Eye-Tracker</button>
        }
      </div>
    </>
  )
}

export default App
