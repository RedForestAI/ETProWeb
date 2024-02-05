from typing import List
import logging

from fastapi import FastAPI
import tobii_research as tr

from .models import EyeTracker

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

@app.get()
def subscribe():
    ...
