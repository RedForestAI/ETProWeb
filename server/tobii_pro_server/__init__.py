# from .__logger import setup
from . import __logger
from . import __loop

__logger.setup()
# __loop.setup()

from .main import app

__all__ = [
    "app"
]
