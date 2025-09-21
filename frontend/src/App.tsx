import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherLogin from "./pages/teacher/LoginTeacher";
import TeacherRegister from "./pages/teacher/TeacherRegister";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect root ke login student */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />

        {/* Fallback 404 */}
        <Route path="*" element={<h1 className="text-center mt-10">404 | Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
