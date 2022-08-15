import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfiguration";

export default async function getId(email) {
  const snapshot = await getDoc(doc(db, "Roles/" + email));
  const rol = snapshot.data();

  return rol;
}
