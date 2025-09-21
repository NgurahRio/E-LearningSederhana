import { useEffect, useState } from "react";
import MyCourse from "./MyCourseStudent";
import EnrollCourse from "./EnrollCourse";
import { LogOut } from "lucide-react";
import API from "../../lib/api";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"my" | "enroll">("my");
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; 
      return;
    }

    API.get("/students/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("✅ Cek token dan fetch berhasil", res.data);
      })
      .catch((err) => {
        console.error("❌ Gagal fetch my-courses:", err);
        localStorage.removeItem("token");
        window.location.href = "/";
      })
      .finally(() => {
        setLoadingCheck(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">🎓 U Learn</h1>
          <ul>
            <li
              className={`cursor-pointer mb-4 ${
                activeTab === "my" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("my")}
            >
              My Course
            </li>
            <li
              className={`cursor-pointer mb-4 ${
                activeTab === "enroll" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("enroll")}
            >
              Enroll Course
            </li>
          </ul>
        </div>

    
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-8">
        {loadingCheck ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            {activeTab === "my" && <MyCourse />}
            {activeTab === "enroll" && <EnrollCourse />}
          </>
        )}
      </main>
    </div>
  );
}
