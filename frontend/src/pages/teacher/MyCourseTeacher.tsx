import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import API from "../../lib/api";

type Course = {
  id_course: number;
  title: string;
  description: string;
  teacher?: { name: string };
};

export default function MyCourseTeacher() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    API.get("/teachers/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.warn("⚠️ Response bukan array:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("❌ Gagal fetch my-courses:", err);
        alert("Gagal load courses");
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading courses...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {courses.length === 0 ? (
        <p className="text-gray-400">Kamu belum membuat course apapun.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id_course}
              className="bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm mb-2 text-gray-300">{c.description}</p>
              {c.teacher && (
                <p className="flex items-center text-sm italic text-gray-400">
                  <UserCircle className="w-4 h-4 mr-1" /> {c.teacher.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
