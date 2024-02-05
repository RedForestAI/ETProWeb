from pydantic import BaseModel
from typing import Dict, Union

class EyeTracker(BaseModel):
    address: str
    model: str
    name: str
    serial_number: str

class WSMessage(BaseModel):
    type: str
    status: str
    value: Dict[str, Union[str, int, float, bool, None, Dict, list]]