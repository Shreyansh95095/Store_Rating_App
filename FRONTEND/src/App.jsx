import { Routes, Route, Link } from 'react-router-dom'
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let isMounted = true; 
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.user ?? null;
      })
      .then((u) => { if (isMounted) setUser(u); })
      .catch(() => { if (isMounted) setUser(null); });
    return () => { isMounted = false; };
  }, []);
  return user;
}

function App() {
  const user = useCurrentUser();
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} user={user}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store-owner"
          element={
            <ProtectedRoute allowedRoles={["owner"]} user={user}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]} user={user}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
