import WebSocket from 'isomorphic-ws'
import jsLogger, { ILogger } from 'js-logger'
import { waitForSocketState } from './utils'
import { WSMessage } from './models'

// Create logger
jsLogger.useDefaults()
const tobiiLogger: ILogger = jsLogger.get('tobiiprosdk')

export default class TobiiClient {
  port: number
  _activeWSConnections: { [id: string]: WebSocket} = {}

  constructor(port: number = 3000) {
    this.port = port
  }

  async getTest() {
    const response = await fetch(`http://localhost:${this.port}/api/test`);
    const data = await response.json();
    return data;
  }

  async getEyeTrackers() {
    const response = await fetch(`http://localhost:${this.port}/find`);
    const data = await response.json();
    return data;
  }

  async connectToEyeTracker(serial_number: string, callback: (data: WSMessage) => void) {
    const ws: WebSocket = await this._createWebSocketConnection(serial_number);
    ws.on("message", (data) => {
      const responseMessage: WSMessage = JSON.parse(data.toString());
      callback(responseMessage);
    });

    // Record all active WS connections
    this._activeWSConnections[serial_number] = ws;
  }

  async disconnectFromEyeTracker(serial_number: string) {
    const ws = this._activeWSConnections[serial_number];
    if (ws) {
      ws.close();
      delete this._activeWSConnections[serial_number];
    }
  }

  async clearAllActiveConnections() {
    for (const serial_number in this._activeWSConnections) {
      this.disconnectFromEyeTracker(serial_number);
    }
  }

  async _createWebSocketConnection(url_params: string = "") {
    const ws: WebSocket = new WebSocket(`ws://localhost:${this.port}/${url_params}`);
    await waitForSocketState(ws, ws.OPEN);
    return ws;
  }
}