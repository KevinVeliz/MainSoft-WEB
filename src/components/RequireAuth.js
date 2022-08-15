import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const RequireAuth = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  //devuelve el resto de los componentes o lo que se rendereiza después
  //si existe un usuario sigue la lógica
  return children;
};

export default RequireAuth;
