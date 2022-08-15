import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfiguration";

const getPersonalInformation = async () => {
  let usuarios = [];
  const docRefCargos = query(collection(db, "Usuarios/"));
  const docSnap = await getDocs(docRefCargos);

  docSnap.forEach((doc) => {
    if (doc.data().rol === "Empleado") {
      usuarios.push(doc.data());
    }
  });

  return usuarios;
};

export default getPersonalInformation;
