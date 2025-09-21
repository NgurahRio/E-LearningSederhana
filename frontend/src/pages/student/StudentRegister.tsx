import { useState } from "react";
import API from "../../lib/api";
import InputWithIcon from "../../components/InputWithIcon";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"; 
import Swal from "sweetalert2";

export default function StudentRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/users/register", { ...form, role_id: 3 });

      Swal.fire({
        icon: "success",
        title: "Berhasil Daftar!",
        text: "Mengalihkan ke halaman login...",
        width: 350,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        window.location.href = "/student/login";
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Register Gagal",
        text: err.response?.data?.error || "Terjadi kesalahan",
        width: 350,
        position: "top",
        confirmButtonText: "Coba Lagi",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-8 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">🎓 Student Register</h1>

        <InputWithIcon
          label="Nama"
          type="text"
          placeholder="Masukkan Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          leftIcon={<User size={18} />}
        />

        <InputWithIcon
          label="Email"
          type="email"
          placeholder="Masukkan Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftIcon={<Mail size={18} />}
        />

        <InputWithIcon
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          leftIcon={<Lock size={18} />}
          rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 transition">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <a href="/student/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
