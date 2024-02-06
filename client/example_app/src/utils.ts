/**
 * Forces a process to wait until the socket's `readyState` becomes the specified value.
 * @param socket The socket whose `readyState` is being watched
 * @param state The desired `readyState` for the socket
 */
export function waitForSocketState(socket: WebSocket, state: number): Promise<boolean> {
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (socket.readyState === state) {
          resolve(true);
        } 
        else if (socket.readyState === socket.CLOSED && state === socket.OPEN){
          resolve(false)
        }
        else {
          waitForSocketState(socket, state).then(resolve);
        }
      });
    });
  }