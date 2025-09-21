import { useState } from "react";
import API from "../../lib/api";
import InputWithIcon from "../../components/InputWithIcon";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function TeacherLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);

      if (res.data.user.role_id !== 2) {
        alert("Akun ini bukan Teacher!");
        return;
      }

      window.location.href = "/teacher/dashboard";
    } catch (err: any) {
      alert(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-8 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          👨‍🏫 Teacher Login
        </h1>

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
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a
            href="/teacher/register"
            className="text-yellow-600 hover:underline"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
