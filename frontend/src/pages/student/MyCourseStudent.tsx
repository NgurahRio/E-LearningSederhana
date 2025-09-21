import { useEffect, useState } from "react";
import API from "../../lib/api";
import { UserCircle } from "lucide-react";

type Course = {
  id_course: number;
  title: string;
  description: string;
  teacher?: { name: string };
};

export default function MyCourse() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/students/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCourses(res.data || []))
      .catch(() => alert("Gagal load my courses"));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {courses.length === 0 ? (
        <p className="text-gray-400">Kamu belum enroll course apapun.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id_course}
              className="bg-gray-800 p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-sm mb-4 text-gray-300">{c.description}</p>
              </div>

              {c.teacher && (
                <div className="flex items-center gap-2 mt-2 text-gray-200">
                  <UserCircle className="w-6 h-6 text-white" />
                  <p className="text-sm">{c.teacher.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
