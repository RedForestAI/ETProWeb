// MockServer.js
const express = require('express');
import jsLogger, { ILogger } from 'js-logger'
import { EyeTracker } from '../../src/models'

// Create logger
jsLogger.useDefaults()
const cjsLogger: ILogger = jsLogger.get('tobiiprosdk')

export function startServer(port = 3000) {
  const app = express();
  
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

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      cjsLogger.log(`Mock server listening on port ${port}`);
      resolve(server);
    });
  });
}

export function stopServer(server) {
  return new Promise<void>(resolve => {
    server.close(() => {
      cjsLogger.log('Mock server stopped');
      resolve();
    });
  });
}