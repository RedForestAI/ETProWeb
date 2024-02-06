import WebSocket from 'isomorphic-ws'
import jsLogger, { ILogger } from 'js-logger'
import { waitForSocketState } from './utils'
import { WSMessage } from './models'

// Create logger
jsLogger.useDefaults()
const tobiiLogger: ILogger = jsLogger.get('tobiiprosdk')

export default class TobiiClient {
  port: number
  host: string = 'http://localhost'
  wsHost: string = 'ws://localhost'
  _activeWSConnections: { [id: string]: WebSocket} = {}

  constructor(port: number = 3000, host: string = 'http://localhost', wsHost: string = 'ws://localhost') {
    this.port = port
    this.host = host
    this.wsHost = wsHost
  }
  
  async ping() {
    const response = await fetch(`${this.host}:${this.port}/api/ping`)
    const data = await response.json()
    return data
  }

  async getEyeTrackers() {
    const response = await fetch(`${this.host}:${this.port}/api/find`);
    const data = await response.json();
    return data;
  }

  async connectToEyeTracker(serial_number: string) {
    const ws: WebSocket = await this._createWebSocketConnection(serial_number);

    // Record all active WS connections
    this._activeWSConnections[serial_number] = ws;

    return ws;
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

  async _createWebSocketConnection(url_params: string) {
    const ws: WebSocket = new WebSocket(`${this.wsHost}:${this.port}/${url_params}`);
    await waitForSocketState(ws, ws.OPEN);
    return ws;
  }
}