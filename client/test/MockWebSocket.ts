// Mock WebSocket
class MockWebSocket {
    public readyState: number;
    public onopen: Function | null = null;
    public onclose: Function | null = null;
    public onerror: Function | null = null;
    public onmessage: Function | null = null;
  
    constructor(public url: string) {
      setTimeout(() => this.onopen && this.onopen({}), 100); // Simulate async open
    }
  
    send(data: any) {
      console.log(`MockWebSocket send: ${data}`);
    }
  
    close() {
      if (this.onclose) this.onclose();
    }
  
    // You can add methods here to simulate errors or close events
  }
  
  global.WebSocket = MockWebSocket as any;
  