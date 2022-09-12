import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminView from "./components/Views/AdminView";
import EmployeeView from "./components/Views/EmployeeView";
import { PagePrincipaly } from "./components/pages/PagePrincipaly";
import { RegisterEmployes } from "./components/pages/RegisterEmployes";
import ManagerView from "./components/Views/ManagerView";
import HorasView from "./components/Admin/Horas";
import UserProvider, { UserContext } from "./Controller/context/UserProvider";

import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import UploadDocument from "./components/Employee/UploadDocument";
import ViewHoursEmployee from "./components/Employee/ViewHoursEmployee";
import { RegisterEmployeeManager } from "./components/Manager/RegisterEmployeeManager";
import ViewHoursEmployeeManager from "./components/Manager/ViewHoursEmployeeManager";
import { Cargos } from "./components/Admin/Cargos";
import { RecuperarClave } from "./components/pages/RecuperarClave";
import { CambiarClave } from "./components/pages/CambiarClave";
import { CambiarClaveAdmin } from "./components/Admin/CambiarClaveAdmin";
import { CambiarClaveManager } from "./components/Manager/CambiarClaveManager";
import { CambiarClaveEmployee } from "./components/Employee/CambiarClaveEmployee";
import RequireAuth from "./Controller/RequireAuth";

export default function App() {
  const { user, value } = useContext(UserContext);
  const auth = getAuth();
  const [id, setId] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();


  onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = user.email;
      window.email = email;
    }
  });

  if (user === false) {
    return <p>Loading... </p>;
  }

  return (
    <Routes>
      <Route path="/*" element={<PagePrincipaly />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Login/>
          </RequireAuth>
        }
      ></Route>

      {!user && <Route path="/login" element={<Login />}></Route>}

      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminView />
          </RequireAuth>
        }
      ></Route>

      <Route
        path="/empleado"
        element={
          <RequireAuth>
            <EmployeeView />
          </RequireAuth>
        }
      ></Route>

      <Route
        path="/manager"
        element={
          <RequireAuth>
            <ManagerView />
          </RequireAuth>
        }
      />

      <Route
        path="/horas"
        element={
          <RequireAuth>
            <HorasView />
          </RequireAuth>
        }
      />

      <Route path="/register_employee" element={<RegisterEmployes />} />
      <Route
        path="/register_employee_manager"
        element={<RegisterEmployeeManager />}
      />
      <Route path="/hours_employee" element={<ViewHoursEmployee />} />
      <Route
        path="/hours_employee_manager"
        element={
          <RequireAuth>
            <ViewHoursEmployeeManager />
          </RequireAuth>
        }
      />
      <Route path="/uploadDocument" element={
        <RequireAuth><UploadDocument /></RequireAuth>} />
      <Route path="/cargos" element={<RequireAuth> <Cargos /></RequireAuth> } />
      <Route path="/recuperar" element={ <RecuperarClave />} />
      <Route path="/cambiar" element={<RequireAuth><CambiarClave /> </RequireAuth>} />
      <Route path="/cambiarclavemanager" element={<RequireAuth> <CambiarClaveManager /> </RequireAuth>} />
      <Route path="/cambiarclaveemployee" element={<RequireAuth><CambiarClaveEmployee /></RequireAuth>} />

      <Route path="/cambiarclave" element={<RequireAuth><CambiarClaveAdmin /> </RequireAuth>} />
    </Routes>
  );
}
