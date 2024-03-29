import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { accessToken } = useAuth().userAuthData;
    const location = useLocation();
  
    if (!accessToken) {
      return <Navigate to="/login" replace  state={{ from: location }}/>;
    }
  
    return <>{children}</>;
  };
  export default ProtectedRoute