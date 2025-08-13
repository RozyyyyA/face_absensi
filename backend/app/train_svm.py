# backend/app/train_svm.py
import os
import pickle
import numpy as np
from sklearn.svm import SVC

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "dataset")
print("Cek DATA_DIR:", DATA_DIR)
print("Folder ditemukan:", os.path.exists(DATA_DIR))

# Inisialisasi array untuk menyimpan fitur dan label
features = []
labels = []

# Load semua data fitur dari registered_faces
for filename in os.listdir(DATA_DIR):
    if filename.endswith(".npz"):
        data = np.load(os.path.join(DATA_DIR, filename))
        features.append(data["embedding"])
        labels.append(data["name"])

# Ubah ke numpy array
X = np.array(features)
y = np.array(labels)

# Training model SVM
clf = SVC(kernel="linear", probability=True)
clf.fit(X, y)

# Simpan model
with open("svm_face_recognition.pkl", "wb") as f:
    pickle.dump(clf, f)

print("✅ Model SVM berhasil dilatih dan disimpan.")
