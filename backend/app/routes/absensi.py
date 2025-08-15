from unittest import result
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, time
from app.database import get_db
from app import models
from app.yolov5_svm import recognize_face
from app.auth_jwt import get_current_user
from app.models import User

router = APIRouter()

@router.post("/")
async def absensi(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Baca gambar yang diupload
        image_bytes = await file.read()

        # Prediksi wajah menggunakan model
        recognized_npm = recognize_face(image_bytes)

        if not recognized_npm:
            raise HTTPException(status_code=404, detail="❌ Wajah tidak dikenali")

        print("recognized_npm:", recognized_npm)
        print("current_user.nama:", current_user.nama)
        print("current_user.npm:", current_user.npm)

        # Validasi wajah cocok dengan user yang login
        recognized_user = db.query(models.User).filter(models.User.nama == recognized_npm).first()

        if current_user.nama != recognized_npm:
            raise HTTPException(
                status_code=401,
                detail="❌ Wajah tidak cocok dengan akun yang login"
            )

        # Cek apakah sudah absen hari ini
        today = datetime.now().date()
        existing_absen = db.query(models.Absensi).filter(
            models.Absensi.user_id == current_user.id,
            models.Absensi.tanggal == today
        ).first()

        if existing_absen:
            raise HTTPException(status_code=400, detail="📅 Anda sudah absen hari ini")

        # Tentukan status hadir atau terlambat
        now_time = datetime.now().time()
        batas_hadir = time(8, 0, 0)  # jam 08:00

        if now_time <= batas_hadir:
            status_absen = "Hadir"
        else:
            status_absen = "Terlambat"

        # Simpan data absen
        absen = models.Absensi(
            user_id=current_user.id,
            tanggal=today,
            waktu=now_time,
            status=status_absen
        )
        db.add(absen)
        db.commit()
        db.refresh(absen)

        return {
            "message": f"✅ {current_user.nama} berhasil absen ({status_absen})",
            "npm": current_user.npm,
            "tanggal": str(absen.tanggal),
            "waktu": str(absen.waktu),
            "status": absen.status
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Gagal absen: {e}")
