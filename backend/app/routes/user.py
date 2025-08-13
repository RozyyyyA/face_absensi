from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models, schemas
from app.database import get_db
from app.auth_jwt import create_access_token  # Token generator kamu

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- REGISTER ---
@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Cek apakah NPM sudah digunakan
    existing_user = db.query(models.User).filter(models.User.npm == user.npm).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="NPM sudah terdaftar")

    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(nama=user.nama, npm=user.npm, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "Registrasi berhasil"}

# --- LOGIN ---
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.npm == user.npm).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="NPM atau Password salah")

    access_token = create_access_token(data={"sub": db_user.npm})
    return {
        "message": "Login berhasil",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": db_user.id,
        "nama": db_user.nama
    }
