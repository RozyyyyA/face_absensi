# backend/app/routers/history.py
from fastapi import APIRouter
from app.database import get_db
from app import models
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()

@router.get("/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):
    absen = db.query(models.Absensi).filter(models.Absensi.user_id == user_id).all()
    return absen
