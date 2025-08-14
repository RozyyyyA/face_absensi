import { useState } from "react";
import { uploadFace } from "../utils/api";
import { Button } from "@/components/ui/button";

export default function FaceRegisterPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFace(formData, token);
      alert("Wajah berhasil diregistrasi!");
      setFile(null);
      setPreview(null);
    } catch {
      alert("Gagal upload wajah");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrasi Wajah</h2>

      {preview ? (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>
      ) : (
        <div className="mb-4 text-center text-gray-400">
          Belum ada gambar dipilih
        </div>
      )}

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Pilih gambar wajah</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
      </label>

      <Button className="w-full mt-2" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}
