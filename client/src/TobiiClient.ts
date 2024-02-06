// TobiiClient.ts
class TobiiClient {
    private static instance: TobiiClient = new TobiiClient();
    private websocket: WebSocket | null = null;
    private readonly wsUrl: string = 'ws://yourserver.com/path';
  
    private constructor() {
      // Call connect with retry directly or let the user of this instance call it when they are ready
      // this.connectWithRetry();
    }
  
    // Method to establish the WebSocket connection with retry logic
    public connectWithRetry(retryInterval: number = 5000, maxRetries: number = 5): Promise<void> {
      console.log(`Attempting to connect to WebSocket at ${this.wsUrl}`);
      return new Promise((resolve, reject) => {
        const tryConnect = (retries: number = maxRetries) => {
          this.websocket = new WebSocket(this.wsUrl);
  
          this.websocket.onopen = () => {
            console.log("WebSocket connection established.");
            resolve();
          };
  
          this.websocket.onerror = (error) => {
            console.log("WebSocket connection error:", error);
          };
  
          this.websocket.onclose = () => {
            if (retries > 0) {
              console.log(`Connection failed, retrying in ${retryInterval / 1000} seconds...`);
              setTimeout(() => tryConnect(retries - 1), retryInterval);
            } else {
              reject(new Error("Failed to connect to WebSocket after maximum retries."));
            }
          };
          
          this.websocket.onmessage = (event) => {
            console.log(event.data);
          };
        };
  
        tryConnect();
      });
    }
  
    // Example method for sending data
    public sendData(data: any): void {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(data));
      } else {
        console.log("WebSocket is not connected.");
      }
    }
  
    // Static method to access the instance
    public static getInstance(): TobiiClient {
      return this.instance;
    }
  }
  
  // Export the singleton instance directly
  const TobiiClientInstance = TobiiClient.getInstance();
  export default TobiiClientInstance;
  