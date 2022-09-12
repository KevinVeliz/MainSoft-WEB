import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfiguration";

export async function getRol(email) {
  const snapshot = await getDoc(doc(db, "Roles/" + email));
  const rol = snapshot.data();

  return rol;
}
