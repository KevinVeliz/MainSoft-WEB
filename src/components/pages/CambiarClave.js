import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Controller/context/UserProvider";
import swal from "sweetalert";

export const CambiarClave = () => {
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPassword2, setNewPassword2] = useState();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const auth = getAuth();

  const resetUserPassword = async (password, newPassword) => {
    const user = auth.currentUser;
    const cred = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, cred);
      if (newPassword === newPassword2) {
        await updatePassword(auth.currentUser, newPassword);
        swal({
          text: "Contraseña actualizada correctamente.",
          icon: "warning",
          button: "Aceptar",
        });
        navigate("/manager");
      } else {
        swal({
          text: "La nueva contraseña no coincide.",
          icon: "warning",
          button: "Aceptar",
        });
      }
    } catch (e) {
      if (e.code == "auth/wrong-password") {
        swal({
          text: "Contraseña actual inválida.",
          icon: "warning",
          button: "Aceptar",
        });
      }
    //  console.log(e.code, e.message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <label>Contraseña actual</label>
      <input
        type="password"
        placeholder="***********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br>
      <label>Nueva Contraseña</label>
      <input
        type="password"
        placeholder="***********"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br></br>
      <label>Confirmar nueva Contraseña</label>
      <input
        type="password"
        placeholder="***********"
        value={newPassword2}
        onChange={(e) => setNewPassword2(e.target.value)}
      />

      <button onClick={() => resetUserPassword(password, newPassword)}>
        {" "}
        Enviar
      </button>
    </div>
  );
};
