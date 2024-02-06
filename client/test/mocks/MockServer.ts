// mockServer.js
const express = require('express');

export function startServer(port = 3000) {
  const app = express();
  
  app.get('/api/test', (req, res) => {
    res.json({ message: 'This is a test response' });
  });

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      console.log(`Mock server listening on port ${port}`);
      resolve(server);
    });
  });
}

export function stopServer(server) {
  return new Promise<void>(resolve => {
    server.close(() => {
      console.log('Mock server stopped');
      resolve();
    });
  });
}