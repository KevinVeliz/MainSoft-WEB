import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/FirebaseConfiguration";

//nombre por default
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  //la configuracion logica si existe un usuario
  const [user, setUser] = useState(false);
  //const auth =getAuth()
  //const user = auth.currentUser;

  React.useEffect(() => {
    //se ejecuta pero luego se destruye, esto es un observable
    const unsusbribe = onAuthStateChanged(auth, (user) => {
      //console.log("User", user);

      if (user) {
        const { email, photoURL, displayName, uid, emailVerified } = user;
        setUser({ email, photoURL, displayName, uid, emailVerified });
        window.emailVerified = emailVerified;
      } else {
        setUser(null);
      }
    });

    return () => unsusbribe();
  }, []);

  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOutUser = () => {
    signOut(auth);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, registerUser, loginUser, signOutUser }}
    >
      {/*para que se visualicen los demas componentes*/}
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
