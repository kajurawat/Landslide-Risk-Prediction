from fastapi import FastAPI
from app.api.routes.hello import router as hello_router
from app.api.routes.data import router as data_router

app = FastAPI(title="Landslide Prediction API")

app.include_router(hello_router)
app.include_router(data_router)
