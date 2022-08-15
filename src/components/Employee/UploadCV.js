import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { storage } from "../../firebase/FirebaseConfiguration";

const UploadCV = ({}) => {
  const [file, setFile] = React.useState(null);
  const [progress, setProgress] = React.useState(null);
  const [data, setData] = React.useState();

  React.useEffect =
    (() => {
      const uploadFile = () => {
        const name = file.name;
        const storageRef = ref(storage, "Documents/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            switch (snapshot.state) {
              case "paused":
                console.log("La carga está pausada");
                break;
              case "running":
                console.log("La carga esta en proceso");
                break;
              default:
                break;
            }
            console.log("carga compleatada");
          },
          (error) => {
            console.log("error: " + error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("URL: " + downloadURL);
              setData(downloadURL);
            });
          }
        );
      };
      file && uploadFile();
    },
    [file]);
  //console.log("data del cv", data);

  return (
    <div>
      <button> Hoja de vida </button>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
  );
};

export default UploadCV;
