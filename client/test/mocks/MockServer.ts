// mockServer.js
const express = require('express');
import jsLogger, { ILogger } from 'js-logger'

// Create logger
jsLogger.useDefaults()
const cjsLogger: ILogger = jsLogger.get('tobiiprosdk')

export function startServer(port = 3000) {
  const app = express();
  
  app.get('/api/test', (req, res) => {
    res.json({ message: 'This is a test response' });
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