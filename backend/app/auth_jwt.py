from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

SECRET_KEY = "secret"  # Ganti dengan yang lebih aman
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ✅ Inisialisasi oauth2_scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        npm: str = payload.get("sub")
        if npm is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        user = db.query(models.User).filter(models.User.npm == npm).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Pengguna tidak ditemukan")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau kadaluarsa")