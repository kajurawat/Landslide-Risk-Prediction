from fastapi import FastAPI
from app.api.routes.hello import router as hello_router

app = FastAPI(title="Landslide Prediction API")

app.include_router(hello_router)
