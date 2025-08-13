# backend/app/models.py
from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, nullable=False)
    npm = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    absensi = relationship("Absensi", back_populates="user")

class FaceEncoding(Base):
    __tablename__ = "face_encodings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    encoding = Column(String)  # serialized vector

class Absensi(Base):
    __tablename__ = "absensi"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tanggal = Column(Date, nullable=False)  # ✅ wajib ada
    waktu = Column(Time, nullable=False)
    status = Column(String, default="Hadir")

    user = relationship("User", back_populates="absensi")
