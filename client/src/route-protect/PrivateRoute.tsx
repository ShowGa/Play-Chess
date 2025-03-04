import useUserStore from "../zustand/useAuthStore";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useUserStore();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
