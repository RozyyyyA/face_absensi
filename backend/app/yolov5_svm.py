import torch
import cv2
import numpy as np
from skimage.feature import hog
import joblib
import os
import pickle
import csv
from ultralytics import YOLO

# ==============================
# Path ke root project
# ==============================
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YOLO_PATH = os.path.join(ROOT_DIR, 'yolov5su.pt')
SVM_PATH = os.path.join(ROOT_DIR, 'svm_face_recognition.pkl')
DATASET_PATH = os.path.join(ROOT_DIR, 'face_dataset.pkl')
FACE_FEATURES_CSV = os.path.join(ROOT_DIR, 'face_features.csv')

# Load Models
yolo = YOLO(YOLO_PATH)
svm_model = joblib.load(SVM_PATH)

# ==============================
# Load Model
# ==============================
def detect_and_extract_face_features(image_bytes):
    try:
        import numpy as np
        import cv2
        from skimage.feature import hog
        from skimage.color import rgb2gray

        global yolo
        if yolo is None:
            print("❌ Model YOLO belum dimuat.")
            return None

        # Decode gambar dari byte
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            print("❌ Gagal decode gambar.")
            return None

        # Deteksi wajah menggunakan YOLO
        results = yolo(img)

        # Kompatibel untuk YOLOv5 dan YOLOv8
        if hasattr(results, 'xyxy'):
            boxes = results.xyxy[0].cpu().numpy()
        elif isinstance(results, list) and hasattr(results[0], 'boxes'):
            boxes = results[0].boxes.xyxy.cpu().numpy()
        else:
            print("❌ Format hasil YOLO tidak dikenali.")
            return None

        print("📸 Jumlah wajah terdeteksi:", len(boxes))
        if len(boxes) == 0:
            print("⚠️ Tidak ada wajah terdeteksi.")
            return None

        # Ambil wajah pertama
        x1, y1, x2, y2 = map(int, boxes[0][:4])
        face_img = img[y1:y2, x1:x2]

        if face_img.size == 0:
            print("❌ Gambar wajah hasil crop kosong.")
            return None

        # Resize ke 64x64 agar cocok dengan pelatihan SVM
        face_img = cv2.resize(face_img, (64, 64))

        # Konversi ke grayscale
        gray_face = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)

        # Ekstrak fitur HOG
        features = hog(
            gray_face,
            pixels_per_cell=(8, 8),
            cells_per_block=(2, 2),
            visualize=False,
            feature_vector=True
        )

        return features

    except ImportError as e:
        print(f"❌ Modul tidak tersedia: {e}")
        return None
    except Exception as e:
        print(f"❌ Gagal ekstrak fitur wajah: {e}")
        return None

# ==============================
# Fungsi Pengenalan Wajah
# ==============================
def recognize_face(image_bytes):
    if svm_model is None:
        print("❌ Model SVM belum dimuat.")
        return None

    features = detect_and_extract_face_features(image_bytes)

    if features is None:
        print("❌ Tidak ada fitur wajah yang bisa diekstrak.")
        return None

    try:
        pred = svm_model.predict([features])
        print(f"✅ Prediksi: {pred}")
        return pred[0]
    except Exception as e:
        print(f"❌ Gagal prediksi wajah: {e}")
        return None

# ==============================
# Fungsi Registrasi Wajah
# ==============================
def register_face(username, image_bytes):
    features = detect_and_extract_face_features(image_bytes)
    if features is None:
        return False

    # Tambahkan ke file dataset.pkl
    try:
        if os.path.exists(DATASET_PATH):
            with open(DATASET_PATH, 'rb') as f:
                data = pickle.load(f)
                X, y = data['X'], data['y']
        else:
            X, y = [], []

        X.append(features)
        y.append(username)

        with open(DATASET_PATH, 'wb') as f:
            pickle.dump({'X': X, 'y': y}, f)

        # Simpan juga ke CSV untuk pencatatan
        append_face_feature_to_csv(username, features)

        return True
    except Exception as e:
        print(f"❌ Gagal simpan data registrasi wajah: {e}")
        return False

# ==============================
# Simpan ke CSV (Opsional)
# ==============================
def append_face_feature_to_csv(username, features):
    try:
        with open(FACE_FEATURES_CSV, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([username] + list(features))
    except Exception as e:
        print(f"❌ Gagal simpan ke CSV: {e}")

def retrain_svm_from_dataset():
    try:
        if not os.path.exists(DATASET_PATH):
            print("❌ Tidak ada dataset.pkl")
            return False

        with open(DATASET_PATH, 'rb') as f:
            data = pickle.load(f)
            X, y = data['X'], data['y']

        if not X or not y:
            print("❌ Dataset kosong")
            return False

        print("🔄 Retraining SVM...")
        from sklearn.svm import SVC
        svm = SVC(kernel='linear', probability=True)
        svm.fit(X, y)

        joblib.dump(svm, SVM_PATH)
        print("✅ SVM retrained dan disimpan.")
        return True

    except Exception as e:
        print(f"❌ Gagal retrain SVM: {e}")
        return False
