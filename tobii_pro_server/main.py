from typing import Union

from fastapi import FastAPI
import tobii_research

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/find")
def find():
    return tobii_research.find_all_eyetrackers()
