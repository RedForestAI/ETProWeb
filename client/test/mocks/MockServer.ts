// MockServer.js
const express = require('express');
import jsLogger, { ILogger } from 'js-logger'
import { EyeTracker, WSMessage } from '../../src/models'

// Create logger
jsLogger.useDefaults()
const tobiiLogger: ILogger = jsLogger.get('tobiiprosdk')

export function startServer(port = 3000) {
  const app = express();
  const expressWs = require("express-ws")(app);
  
  app.get("/api/test", (req, res) => {
    res.json({ message: "This is a test response" });
  });

  app.get('/find', (req, res) => {
    let eyetrackers: EyeTracker[] = [
      {
        address: "tobiipro://123456789",
        model: "Tobii Pro Spark",
        name: "Tobii Pro Spark",
        serial_number: "123456789"
      },
      {
        address: "tobiipro://987654321",
        model: "Tobii Pro Spectrum",
        name: "Tobii Pro Spectrum",
        serial_number: "987654321"
      }
    ]
    res.json(eyetrackers);
  });

  app.ws("/:serial_number", function (ws, req) {
    // Keep sending data until the connection is closed, not dependent on client
    console.log(`WS connection opened - ${req.params.serial_number}`)
    
    const interval = setInterval(() => {
      console.log("Sending gaze data")
      const wsMessage: WSMessage = {
        type: "GAZE_DATA",
        status: "UPDATE",
        value: {x: 0, y: 0}
      };
      ws.send(JSON.stringify(wsMessage));
    }, 10);

    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      tobiiLogger.log(`Mock server listening on port ${port}`);
      resolve(server);
    });
  });
}

export function stopServer(server) {
  return new Promise<void>(resolve => {
    server.close(() => {
      tobiiLogger.log('Mock server stopped');
      resolve();
    });
  });
}