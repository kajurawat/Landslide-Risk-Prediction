from fastapi import FastAPI
from app.api.routes.hello import router as hello_router
from app.api.routes.data import router as data_router
from app.api.routes.predict import router as predict_router
from app.api.routes.retrain import router as retrain_router
from Iot.api.routes import router as iot_router

app = FastAPI(title="Landslide Prediction API")

app.include_router(hello_router)
app.include_router(data_router)
app.include_router(predict_router)
app.include_router(retrain_router)
app.include_router(iot_router)
