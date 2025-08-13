# backend/app/main.py

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware

import torch
import joblib
from ultralytics import YOLO
from . import yolov5_svm
from joblib import load

from app.database import Base, engine
from app.routes import user, face_register, absensi, history

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Tambahkan ini untuk izinkan akses dari frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # alamat frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_models():
    print("📦 Memuat model YOLO dan SVM...")

    # Load YOLO model
    yolov5_svm.yolo = YOLO("../yolov5su.pt")

    # Load SVM model
    yolov5_svm.svm_model = joblib.load("../svm_face_recognition.pkl") 

# Include semua router
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(face_register.router, prefix="/face", tags=["Face Registration"])
app.include_router(absensi.router, prefix="/absen", tags=["Absensi"])
app.include_router(history.router, prefix="/history", tags=["Riwayat Absen"])

# Tambahkan header Authorization agar muncul di Swagger
api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

# Custom schema untuk JWT agar muncul input token di Swagger
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Absensi API",
        version="1.0.0",
        description="API Absensi dengan JWT Authentication",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
