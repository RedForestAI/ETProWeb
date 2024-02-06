// TobiiClient.test.js
import WebSocket from "ws";
const { startServer, stopServer } = require('./mocks/MockServer');
import TobiiClient from '../src/TobiiClient' // Import your client that makes HTTP requests
import { waitForSocketState } from '../src/utils';

const port = 3000;

describe('TobiiClient Tests', () => {
  let server;

  beforeAll(async () => {
    server = await startServer(port); // Start server on port 3000
  });

  afterAll(async () => {
    await stopServer(server); // Stop the server
  });

  test('TobiiClient should receive test response from mock server', async () => {
    // Assuming TobiiClient has a method getTest() that fetches '/api/test'
    const client = new TobiiClient();
    const response = await client.getTest();
    expect(response.message).toBe('This is a test response');
  });

  test("TobiiClient should receive eye trackers from mock server", async () => {
    const client = new TobiiClient();
    const response = await client.getEyeTrackers();
    expect(response.length).toBe(2);
    expect(response[0].model).toBe("Tobii Pro Spark");
  });

  test("Server echoes the message it receives from client", async () => {
    // Create test client
    const client = new WebSocket(`ws://localhost:${port}`);
    await waitForSocketState(client, client.OPEN);

    const testMessage = "This is a test message";
    let responseMessage;

    client.on("message", (data) => {
      responseMessage = data.toString();

      // Close the client after it receives the response
      client.close();
    });

    // Send client message
    client.send(testMessage);

    // Perform assertions on the response
    await waitForSocketState(client, client.CLOSED);
    expect(responseMessage).toBe(testMessage);
  });

  // test('WebSocket client should connect and send/receive messages', done => {
  //   // expect.assertions(2); // Make sure two assertions are called
  
  //   const client = new TobiiClient();
  //   const ws = client.createWebSocketConnection();
  
  //   ws.onopen = () => {
  //     ws.send('Test Message');
  //   };
  
  //   ws.onmessage = event => {
  //     // expect(event.data).toBe('Test Message'); // Expect the echo message
  //     done(); // Signal Jest that the test is complete
  //   };
  
  //   ws.onerror = err => {
  //     console.error('WebSocket encountered an error:', err);
  //     done(err);
  //   };
  // });
});