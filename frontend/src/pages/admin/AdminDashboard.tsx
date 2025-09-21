import { useEffect, useState } from "react";
import API from "../../lib/api";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Search, Edit2, Trash2, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(25);

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const token = localStorage.getItem("token");
    API.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      })
      .catch(() => alert("Gagal load users"));
  };

  const filterUsers = (val: string) => {
    setSearch(val);
    if (!val.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = val.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower) ||
            u.role.toLowerCase().includes(lower)
        )
      );
    }
    setCurrentPage(1);
  };

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus user ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch {
      alert("Gagal hapus user");
    }
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, password: "" });
    setError("");
  };

  const handleSave = async () => {
    if (formData.password.trim() !== "" && formData.password.length < 6) {
      setError("Password minimal 6 karakter atau kosongkan jika tidak diubah");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload: any = { name: formData.name };
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      await API.put(`/users/${editingUser.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingUser(null);
      loadUsers();
    } catch {
      alert("Gagal update user");
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div className="p-8 min-h-screen bg-[#0f172a] text-gray-200">
        {/* Header + Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Search + Page size */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => filterUsers(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && filterUsers(search)}
              placeholder="Cari nama, email, atau role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#1e293b] text-gray-200"
            />
          </div>

          <select
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 border rounded-lg bg-[#1e293b] border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-400"
          >
            <option value={10}>10 user</option>
            <option value={25}>25 user</option>
            <option value={50}>50 user</option>
            <option value={100}>100 user</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse bg-[#0f172a]">
            <thead className="bg-[#1e293b] text-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`bg-[#1e293b] ${
                    idx % 2 === 0 ? "bg-opacity-100" : "bg-opacity-90"
                  } hover:bg-[#334155] transition`}
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        u.role === "admin"
                          ? "bg-red-900 text-red-300"
                          : u.role === "teacher"
                          ? "bg-green-900 text-green-300"
                          : "bg-blue-900 text-blue-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Tidak ada user yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 text-gray-200">
            <span>
              Menampilkan {startIndex + 1} - {endIndex} dari {filteredUsers.length} user
            </span>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#1e293b] text-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#1e293b] text-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1e293b] p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-gray-200">Edit User</h2>

              {/* Name */}
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full mb-3 p-2 border rounded bg-[#0f172a] text-gray-200"
              />

              {/* Password */}
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New Password (kosongkan kalau tidak diubah)"
                className="w-full mb-1 p-2 border rounded bg-[#0f172a] text-gray-200"
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
