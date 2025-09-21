import { useState } from "react";
import API from "../../lib/api";
import type { LoginResponse } from "../../types/auth";
import InputWithIcon from "../../components/InputWithIcon";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post<LoginResponse>("/users/login", form);
      localStorage.setItem("token", res.data.token);

      if (res.data.user.role_id !== 1) {
        alert("Akun ini bukan Admin!");
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      alert(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 text-gray-800 p-8 rounded-lg shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          🔧 Admin Login
        </h1>

        {/* Email */}
        <InputWithIcon
          label="Email"
          type="email"
          placeholder="Enter your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftIcon={<Mail size={18} />}
        />

        {/* Password */}
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

        {/* Button Login */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-700 transition"
        >
          <LogIn className="w-5 h-5" />
          Login
        </button>
      </form>
    </div>
  );
}
