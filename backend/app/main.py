import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.hello import router as hello_router
from app.api.routes.data import router as data_router
from app.api.routes.predict import router as predict_router
from app.api.routes.retrain import router as retrain_router
from Iot.api.routes import router as iot_router

load_dotenv()

app = FastAPI(title="Landslide Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("CORS_ALLOW_ORIGINS", "*") == "*" else os.getenv("CORS_ALLOW_ORIGINS", "").split(","),
    allow_methods=["*"] if os.getenv("CORS_ALLOW_METHODS", "*") == "*" else os.getenv("CORS_ALLOW_METHODS", "").split(","),
    allow_headers=["*"] if os.getenv("CORS_ALLOW_HEADERS", "*") == "*" else os.getenv("CORS_ALLOW_HEADERS", "").split(","),
    allow_credentials=os.getenv("CORS_ALLOW_CREDENTIALS", "false").lower() == "true",
)

app.include_router(hello_router)
app.include_router(data_router)
app.include_router(predict_router)
app.include_router(retrain_router)
app.include_router(iot_router)
