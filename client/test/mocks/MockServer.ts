// MockServer.js
const express = require('express');
import jsLogger, { ILogger } from 'js-logger'
import { EyeTracker } from '../../src/models'

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

  app.ws("/", function (ws, req) {
    ws.on("message", function (message) {
      ws.send(message);
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