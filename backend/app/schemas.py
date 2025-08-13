# backend/app/schemas.py
from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    nama: str
    npm: str
    password: str

class UserLogin(BaseModel):
    npm: str
    password: str

class FaceEncodingCreate(BaseModel):
    user_id: int
    encoding: str

class AbsensiIn(BaseModel):
    user_id: int

class AbsensiOut(BaseModel):
    waktu_absen: datetime
    status: str
    kecepatan_absen: str
