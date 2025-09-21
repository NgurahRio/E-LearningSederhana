import { useEffect, useState } from "react";
import API from "../../lib/api";
import { UserCircle } from "lucide-react";

type Course = {
  id_course: number;
  title: string;
  description: string;
  teacher?: {
    name?: string;
  };
};


export default function ManageCoursesTeacher() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/teachers/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      alert("❌ Gagal memuat courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/teachers/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCourses();
      setConfirmId(null);
    } catch (err) {
      alert("❌ Gagal menghapus course.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/teachers/course/${editingCourse.id_course}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCourses();
      setEditingCourse(null);
      setTitle("");
      setDescription("");
    } catch {
      alert("❌ Gagal menyimpan perubahan.");
    }
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

 return (
  <div>
    <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>

    {loading ? (
      <p className="text-gray-400">Loading courses...</p>
    ) : !Array.isArray(courses) ? (
      <p className="text-red-400">Terjadi kesalahan saat memuat data.</p>
    ) : courses.length === 0 ? (
      <p className="text-gray-400">Belum ada course yang kamu buat.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id_course}
            className="bg-gray-800 p-4 rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-gray-300">{c.description}</p>
            </div>

            {c.teacher?.name && (
              <div className="flex items-center gap-2 mt-3 text-gray-300">
                <UserCircle className="w-5 h-5 text-white" />
                <span className="italic">{c.teacher.name}</span>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 bg-blue-500 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmId(c.id_course)}
                className="flex-1 bg-red-500 py-2 rounded hover:bg-red-600 transition"
              >
                Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Course</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Judul course"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Deskripsi course"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {confirmId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-4">Apakah kamu yakin ingin menghapus course ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
