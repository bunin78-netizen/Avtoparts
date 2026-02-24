import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path


def setup_logging() -> None:
    Path("logs").mkdir(exist_ok=True)

    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))

    file_handler = RotatingFileHandler("logs/app.log", maxBytes=10_485_760, backupCount=10)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(log_format))

    error_handler = RotatingFileHandler("logs/error.log", maxBytes=10_485_760, backupCount=10)
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(logging.Formatter(log_format))

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    root_logger.handlers.clear()
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)
