import TobiiClient from '../src/TobiiClient'; // Adjust the import path accordingly

describe('TobiiClient WebSocket connection', () => {
    it('should be able to get instance of TobiiClient', () => {
        // const client = TobiiClient.getInstance();
        // expect(client).toBeInstanceOf(TobiiClient);
    });
});

// describe('TobiiClient WebSocket connection', () => {
//   it('should connect to the WebSocket server successfully', async () => {
//     const client = TobiiClient.getInstance();

//     await expect(client.connectWithRetry(1000, 5)).resolves.toBeUndefined();

//     // Additional assertions can be made here, such as checking if `onopen` was called
//   });
// });
