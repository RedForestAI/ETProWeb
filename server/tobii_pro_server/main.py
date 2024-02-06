from typing import List, Optional
import logging
import asyncio
import os
import threading
import zmq

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import tobii_research as tr

from .models import EyeTracker, WSMessage

logger = logging.getLogger("tobii_pro_server")

app = FastAPI()
context = zmq.Context()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/api/ping")
def ping():
    return {"message": "PING"}

@app.get("/api/find")
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
    
    def gaze_data_callback(websocket, gaze_data):
        essential_data = {
            "left": gaze_data["left_gaze_point_on_display_area"],
            "right": gaze_data["right_gaze_point_on_display_area"]
        }
        asyncio.run(websocket.send_json(WSMessage(
            type="GAZE",
            status='UPDATE', 
            value={"gaze_data": essential_data}
        ).model_dump_json()))
    
    # Subscribe to gaze data
    logger.debug(f"Subscribing to gaze data from {eye_tracker.device_name} ({eye_tracker.serial_number})")
    eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, lambda x: gaze_data_callback(websocket, x), as_dictionary=True)

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
                
    except WebSocketDisconnect:
        # Handle WebSocket disconnection here
        logger.debug(f"Client disconnected")
        try:
            eye_tracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, lambda x: gaze_data_callback(websocket, x))
        except TypeError:
            pass