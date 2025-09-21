import { useState } from "react";
import API from "../../lib/api";

export default function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/teachers/course",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      alert("Berhasil menambah course!");
    } catch {
      alert("Gagal menambah course");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tambah Course</h2>
      <div className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Judul course"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <textarea
          placeholder="Deskripsi course"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={addCourse}
          className="w-full bg-yellow-500 py-2 rounded hover:bg-yellow-600 transition"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
