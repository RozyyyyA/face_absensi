# face_register.py
import os
import cv2
import numpy as np
import face_recognition
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, yolov5_svm
import base64
import os, uuid

router = APIRouter()

router = APIRouter()

def save_face_encoding(user_id: int, image_array: np.ndarray, db: Session):
    # Encode wajah
    face_locations = face_recognition.face_locations(image_array)
    if not face_locations:
        raise HTTPException(status_code=400, detail="Wajah tidak terdeteksi.")

    face_encodings = face_recognition.face_encodings(image_array, face_locations)
    encoding_vector = face_encodings[0]

    # Simpan ke database sebagai string
    encoding_str = ",".join(map(str, encoding_vector.tolist()))

    # Simpan ke DB
    db_encoding = models.FaceEncoding(user_id=user_id, encoding=encoding_str)
    db.add(db_encoding)
    db.commit()
    db.refresh(db_encoding)

    return True

@router.post("/register/upload")
async def register_face_upload(user_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        image = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        save_face_encoding(user_id, rgb_image, db)
        return {"message": "Wajah berhasil diregistrasi ke database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register/base64")
async def register_face_base64(user_id: int = Form(...), image_base64: str = Form(...), db: Session = Depends(get_db)):
    try:
        header, encoded = image_base64.split(",", 1) if "," in image_base64 else (None, image_base64)
        image_bytes = base64.b64decode(encoded)
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        save_face_encoding(user_id, rgb_image, db)
        return {"message": "Wajah berhasil diregistrasi dari base64 ke database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register-face")
async def register_face(name: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # Register wajah ke dataset
        success = yolov5_svm.register_face(name, contents)

        if not success:
            raise HTTPException(status_code=500, detail="❌ Gagal registrasi wajah.")

        # Retrain SVM setelah register wajah baru
        retrain_success = yolov5_svm.retrain_svm_from_dataset()

        if not retrain_success:
            raise HTTPException(status_code=500, detail="❌ Gagal retrain model SVM.")

        return {"message": f"✅ Wajah untuk {name} berhasil diregistrasi dan model SVM diupdate."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))