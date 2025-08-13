# backend/app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database, schemas
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
def login(data: schemas.LoginSchema, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.npm == data.npm).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="NPM atau password salah")
    return {"message": "Login berhasil", "user_id": user.id}

@router.post("/register-wajah")
def register_wajah(nama: str, npm: str, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # proses deteksi wajah + dapatkan encoding dari YOLOv5/FaceNet kamu
    face_encoding = detect_and_extract_face_features(file)  # kamu sudah punya ini

    # hash password default misalnya 'absen123'
    hashed_pw = pwd_context.hash("absen123")

    # simpan ke DB
    user = models.User(nama=nama, npm=npm, password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)

    face = models.FaceEncoding(user_id=user.id, encoding=json.dumps(face_encoding.tolist()))
    db.add(face)
    db.commit()

    return {"message": "Registrasi wajah berhasil", "user_id": user.id}
