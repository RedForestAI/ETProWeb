import time
import tobii_research as tr
import logging
from fastapi.testclient import TestClient

from tobii_pro_server import app

logger = logging.getLogger("tobii_pro_server")

def gaze_data_callback(gaze_data):
    # Print gaze points of left and right eye
    logger.debug("Left eye: ({gaze_left_eye}) \t Right eye: ({gaze_right_eye})".format(
        gaze_left_eye=gaze_data['left_gaze_point_on_display_area'],
        gaze_right_eye=gaze_data['right_gaze_point_on_display_area']))

def test_get_eye_trackers():
    eye_trackers = tr.find_all_eyetrackers()
    logger.debug(eye_trackers)

    if len(eye_trackers) == 0:
        logger.debug("Eyetracker not found")

def test_get_gaze_data():
    eye_trackers = tr.find_all_eyetrackers()
    logger.debug(eye_trackers)

    if len(eye_trackers) == 0:
        logger.error("Eyetracker not found")
        return

    eye_tracker = eye_trackers[0]
    eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)
    logger.debug("Subscribed")

    time.sleep(5)

    eye_tracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)
    logger.debug("Unsubscribed")
    
def test_ws_connection():
    client = TestClient(app)
    with client.websocket_connect("/ws") as websocket:
        data = websocket.receive_json()
        # assert data == {"msg": "Hello WebSocket"}
