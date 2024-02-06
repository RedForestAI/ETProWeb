import WebSocket from 'isomorphic-ws'
import { waitForSocketState } from './utils'
import { Message } from './Message'
import jsLogger, { ILogger } from 'js-logger'

// Create logger
jsLogger.useDefaults()
const cjsLogger: ILogger = jsLogger.get('chimerajs')

export default class TobiiClient {

  constructor() {

  }

  async getTest() {
    const response = await fetch('http://localhost:3000/api/test');
    const data = await response.json();
    return data;
  }
}