import WebSocket from 'isomorphic-ws'
import { waitForSocketState } from './utils'
import jsLogger, { ILogger } from 'js-logger'

// Create logger
jsLogger.useDefaults()
const cjsLogger: ILogger = jsLogger.get('tobiiprosdk')

export default class TobiiClient {

  constructor() {

  }

  async getTest() {
    const response = await fetch('http://localhost:3000/api/test');
    const data = await response.json();
    return data;
  }

  async getEyeTrackers() {
    const response = await fetch('http://localhost:3000/find');
    const data = await response.json();
    return data;
  }
}