import { useState } from "react";
import { uploadFace } from "../utils/api";
import { Button } from "@/components/ui/button";

export default function FaceRegisterPage() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFace(formData, token);
      alert("Wajah berhasil diregistrasi!");
    } catch {
      alert("Gagal upload wajah");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Registrasi Wajah</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button className="mt-4" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}
