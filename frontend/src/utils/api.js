import axios from "axios";

const API_URL = "http://localhost:8000"; // Ganti sesuai backend

export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);
export const registerUser = (data) => axios.post(`${API_URL}/users/register`, data);
export const uploadFace = (formData, token) =>
  axios.post(`${API_URL}/register-face`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const doAbsensi = (formData, token) =>
  axios.post(`${API_URL}/absen/`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getHistory = (token) =>
  axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
