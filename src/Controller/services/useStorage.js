import { async } from "@firebase/util";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase/FirebaseConfiguration";

const useStorage = (file, cedula) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const storageRef = storage.ref(file.name);
    const docRef = doc(db, "Usuarios/" + cedula);

    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransfered / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        setError(err);
      },
      async () => {
        const url = await storage.getDownloadUrl();

        await updateDoc(docRef, {
          imageUser: url,
        });

        setUrl(url);
      }
    );
  }, [file]);

  return { progress, url, error };
};

export default useStorage;
