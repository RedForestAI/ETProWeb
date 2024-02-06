// TobiiClient.test.js
const { startServer, stopServer } = require('./mocks/MockServer');
import TobiiClient from '../src/TobiiClient' // Import your client that makes HTTP requests

describe('TobiiClient Tests', () => {
  let server;

  beforeAll(async () => {
    server = await startServer(3000); // Start server on port 3000
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
});