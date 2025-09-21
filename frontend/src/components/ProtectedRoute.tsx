import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


type Props = {
  children: React.ReactNode;
  allowedRoles: number[]; 
};

interface TokenPayload {
  uid: number;
  rid: number; 
  exp: number;
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/student/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (!decoded.rid || !allowedRoles.includes(decoded.rid)) {
      return (
        <h1 className="text-center text-red-600 mt-20 text-xl font-bold">
          🚫 Forbidden
        </h1>
      );
    }

    return <>{children}</>;
  } catch (err) {
    return <Navigate to="/student/login" replace />;
  }
}
