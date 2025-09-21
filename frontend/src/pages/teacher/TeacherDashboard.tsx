import { useEffect, useState } from "react";
import MyCourseTeacher from "./MyCourseTeacher";
import AddCourseTeacher from "./TeacherAddCourse";
import ManageCoursesTeacher from "./ManageCourseTeacher";
import { LogOut } from "lucide-react";
import API from "../../lib/api";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<"my" | "add" | "manage">("my");
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("/teachers/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const courses = res.data;
        if (Array.isArray(courses)) {
          setActiveTab(courses.length === 0 ? "add" : "my");
        } else {
          setActiveTab("add");
        }
      })
      .catch(() => {
        setActiveTab("add");
      })
      .finally(() => {
        setLoadingCheck(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/teacher/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">👨‍🏫 Teacher Panel</h1>
          <ul>
            <li
              className={`cursor-pointer mb-4 ${
                activeTab === "my" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("my")}
            >
              My Courses
            </li>
            <li
              className={`cursor-pointer mb-4 ${
                activeTab === "add" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Course
            </li>
            <li
              className={`cursor-pointer mb-4 ${
                activeTab === "manage" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Courses
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {loadingCheck ? (
          <p className="text-gray-400">Loading...</p>
        ) : activeTab === "my" ? (
          <MyCourseTeacher />
        ) : activeTab === "add" ? (
          <AddCourseTeacher />
        ) : (
          <ManageCoursesTeacher />
        )}
      </main>
    </div>
  );
}
