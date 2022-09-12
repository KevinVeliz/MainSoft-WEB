import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfiguration";

async function actualizarRol(email,rol) {
  const docRef2 = doc(db, "Roles/" + email);
  const docSnap2 = await getDoc(docRef2);
  rol.push(docSnap2.data().rol);
}

export {actualizarRol};