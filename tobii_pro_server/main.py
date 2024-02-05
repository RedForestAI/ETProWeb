from typing import List, Optional
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import tobii_research as tr

from .models import EyeTracker, WSMessage

logger = logging.getLogger("tobii_pro_server")

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/find")
def find():
    eye_trackers: List[tr.EyeTracker] = tr.find_all_eyetrackers()

    res = []
    for eye_tracker in eye_trackers:
        res.append(EyeTracker(
            address=eye_tracker.address,
            model=eye_tracker.model,
            name=eye_tracker.device_name,
            serial_number=eye_tracker.serial_number
        ))

    return res

def gaze_data_callback(ws, gaze_data):
    # print(gaze_data)
    # Print gaze points of left and right eye
    logger.debug("Left eye: ({gaze_left_eye}) \t Right eye: ({gaze_right_eye})".format(
        gaze_left_eye=gaze_data['left_gaze_point_on_display_area'],
        gaze_right_eye=gaze_data['right_gaze_point_on_display_area']))

# @app.websocket("/ws/{serial_number}")
# async def websocket(websocket: WebSocket, serial_number: str):
    
#     logger.debug(f'CLIENT requests - {serial_number}')

#     await websocket.accept()
#     await websocket.send_json({"msg": "Hello WebSocket"})
#     await websocket.close()

@app.websocket("/ws/{serial_number}")
async def websocket_endpoint(websocket: WebSocket, serial_number: str):
    await websocket.accept()
    
    # Look up the resource based on the input parameter
    eye_trackers: List[tr.EyeTracker] = tr.find_all_eyetrackers()
    eye_tracker: Optional[tr.EyeTracker] = None
    
    # Clean the input argument
    serial_number = serial_number.strip().replace("{", "").replace("}", "").replace("{", "")
    
    for et in eye_trackers:
        if et.serial_number == serial_number:
            eye_tracker = et
            break
    
    if eye_tracker is None:
        await websocket.send_json(WSMessage(
            type="INFO",
            status="FAILED",
            value={"message": f"Eye-tracker with serial number {serial_number} not found"}
        ).model_dump_json())
        await websocket.close()
        return
    
    # Subscribe to gaze data
    # eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, lambda x: gaze_data_callback(websocket, x), as_dictionary=True)

    # Send an initial message to the WebSocket client
    await websocket.send_json(WSMessage(
        type="INFO",
        status='SUCCESS', 
        value={"message": f"Connected to {eye_tracker.device_name} ({eye_tracker.serial_number})"}
    ).model_dump_json())

    try:
        while True:
            msg = await websocket.receive_text()
            if msg.lower() == "close":
                await websocket.close()
                break
            else:
                logger.debug(f'CLIENT says - {msg}')
                await websocket.send_text(f"Your message was: {msg}")
                
    except WebSocketDisconnect:
        # Handle WebSocket disconnection here
        # eye_tracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, lambda x: gaze_data_callback(websocket, x))
        pass