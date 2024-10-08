import time
import tobii_research as tr
import logging
from fastapi.testclient import TestClient

from et_pro_server import app
from et_pro_server.models import EyeTracker

logger = logging.getLogger("tobii_pro_server")

def test_faulty_ws_connection():
    client = TestClient(app)
    
    with client.websocket_connect("/ws/{" + "null" + "}") as websocket:
        data = websocket.receive_json()
        logger.debug(data)
        time.sleep(1)
        # assert data == {"msg": "Hello WebSocket"}
    
def test_ws_connection():
    client = TestClient(app)
        
    # Get the available eye-trackers first
    response = client.get("/api/find")
    assert response.status_code != 404
    ets = response.json()
    logger.debug(ets)
    
    if len(ets) == 0:
        logger.error("No eye-trackers found")
        return
    
    # Select the first eye-tracker
    et = EyeTracker(**ets[0])
    
    with client.websocket_connect("/ws/{" + et.serial_number + "}") as websocket:
        for i in range(50):
            data = websocket.receive_json()
            logger.debug(data)
            # time.sleep(1)
            # assert data == {"msg": "Hello WebSocket"}
