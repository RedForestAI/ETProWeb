from pydantic import BaseModel

class EyeTracker(BaseModel):
    address: str
    model: str
    name: str
    serial_number: str
