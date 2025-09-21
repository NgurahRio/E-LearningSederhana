import { useState } from "react";
import API from "../../lib/api";
import InputWithIcon from "../../components/InputWithIcon";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function TeacherRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/users/register", { ...form, role_id: 2 });

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
        window.location.href = "/teacher/login";
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
        <h1 className="text-2xl font-bold text-center mb-6">
          👨‍🏫 Teacher Register
        </h1>

        <InputWithIcon
          label="Name"
          placeholder="Enter your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          leftIcon={<User size={18} />}
        />

        <InputWithIcon
          label="Email"
          type="email"
          placeholder="Enter your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftIcon={<Mail size={18} />}
        />

        <InputWithIcon
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          leftIcon={<Lock size={18} />}
          rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <button className="w-full bg-yellow-500 text-white py-2 rounded mt-4 hover:bg-yellow-600 transition">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <a href="/teacher/login" className="text-yellow-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
