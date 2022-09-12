import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../Controller/firebase/FirebaseConfiguration";
import swal from "sweetalert";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";

const UploadDocument = () => {
  //const [file, setFile] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [progress, setProgress] = React.useState(null);
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();

  const [isLoading, setIsLoading] = React.useState(false);
  const [mensaje, setMensaje] = React.useState("");
  const [estado, setEstado] = React.useState(false);
  const [curriculum, setCurriculum] = React.useState();
  const [cedula, setCedula] = React.useState();
  const [papeleta, setPapeleta] = React.useState();
  const [state, setState] = React.useState(false);

  

  
  const navigate = useNavigate();

  const handleEmployee = () => {
    navigate("/empleado");
  };

  React.useEffect(() => {
    informationFunction(window.cedulaEmpleado);
    existsDocuments(window.cedulaEmpleado);  
  }, []);


  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFirsName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
    } else {
      //console.log("No se pudo leer el documento");
    }
  };

  const completeName = firstName + "-" + lastName;


  const SaveDocuments =() => {
    setState(true)
    //setData([]);
    if(curriculum!==null && cedula!==null && papeleta!==null){
      uploadFile(curriculum)
      uploadFile(cedula)
      uploadFile(papeleta)
  
   }   
   swal({
    text: "Recuerde que debe dar clic en 'Guardar' para conservar los cambios.",
    icon: "info",
    button: "Aceptar",
  });
    

      
  };

  const uploadChanges =async()=>{
    await setDoc(
      doc(db, "Usuarios/" + window.cedulaEmpleado + "/DOCUMENTS/DATA"),
      {
        urlDocumentHojaVida: data[0],
        urlDocumentCedula: data[1],
        urlDocumentPapeleta: data[2],
        nameDocumentCedula:cedula.name,
        nameDocumentHojaVida:curriculum.name,
        nameDocumentPapeleta:papeleta.name

      }
    );

    swal({
      text: "Documentos cargados exitosamente.",
      icon: "success",
      button: "Aceptar",
    });
    navigate("/empleado"); 

  }

  const uploadFile = (file) => {

    const storageRef = ref(
      storage,
      "Documents/" + completeName + "/" + file.name
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    //setIsLoading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case "paused":
            //console.log("La carga está pausada");
            break;
          case "running":
            //console.log("La carga esta en proceso");
            break;
          default:
            break;
        }
        //console.log("carga compleatada");
      },
      (error) => {
        swal({
          text: error.code,
          icon: "success",
          button: "Aceptar",
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
         // console.log("URL: " + downloadURL);
          data.push(downloadURL);
          setIsLoading(false);
        });
      }
    );

   
  };

  

  const existsDocuments = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula + "/DOCUMENTS/DATA");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (data.length == 0) {
        swal({
          text: "Los documentos ya han sido registrados, pero puede actualizarlos en cualquier momento. Tome en cuenta que si desea actualizar debe registrar nuevamente todos los archivos.",
          icon: "info",
          button: "Aceptar",
        });
      }

      setEstado(true);
      setMensaje("Documento ya registrado.");
    } else {
      
      swal({
        text: "Los documentos son un requisito para poder empezar a registrar sus horas de trabajo.",
        icon: "info",
        button: "Aceptar",
      });
      
    }
  };


  const DisbleButton = () => {
    return(
      curriculum != null && cedula!= null && papeleta != null && state === true? false : true
    )
  }

  const uploadDoc = (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-lg text-neutral-900 font-bold">Subir archivo</h1>

      <label className="pt-10 font-semibold italic"> CV </label>
      <input
        className="
        file:rounded-full
        file:px-6 file:py-3 file:m-5
        file:shadow-lg
        file:bg-gradient-to-r from-cyan-600 to-sky-600/80
        file:border-none
        "
        type="file"
        accept=".pdf"
        onChange={(e) => {setCurriculum(e.target.files[0])}}
      />
      
      
      <p
        className="text-sm text-black dark:text-gray-500/50"
        id="file_input_help"
      >
        PDF.
      </p>
      <p>{estado === true ? mensaje : "Documento no cargado."}</p>

      <label className="pt-10 font-semibold italic"> Cédula </label>
      <input
        className="
        file:rounded-full
        file:px-6 file:py-3 file:m-5
        file:shadow-lg
        file:bg-gradient-to-r from-cyan-600 to-sky-600/80
        file:border-none
        "
        type="file"
        accept=".pdf"
        onChange={(e) => setCedula(e.target.files[0])}
      />

      
      <p
        className="text-sm text-black dark:text-gray-500/50"
        id="file_input_help"
      >
        PDF.
      </p>
      <p>{estado === true ? mensaje : "Documento no cargado."}</p>

      

        <label className="pt-10 font-semibold italic">

        <span> Papeleta de Votación </span>
        </label>
   
   

  <label class="block">
      <input
        className="
        file:rounded-full
        file:px-6 file:py-3 file:m-5
        file:shadow-lg
        file:bg-gradient-to-r from-cyan-600 to-sky-600/80
        file:border-none
        "
        type="file"
        accept=".pdf"
        onChange={(e) => {setPapeleta(e.target.files[0])}}
      />

       
    </label>
      <p
        className="text-sm text-black dark:text-gray-500/50"
        id="file_input_help"
        >
        PDF.
      </p>
      <p>{estado === true ? mensaje : "Documento no cargado."}</p>
      <button
          type="button"
          className=" buton-modal px-10 py-2 bg-gradient-to-r from-cyan-600 to-sky-600/80
        rounded-lg"
          onClick={SaveDocuments}
        >
          
          Confirmar archivos correctos
        </button>

      <div className="px-12 mt-10 py-6 flex space-x-5">
      
        <button
          type="button"
          className=" buton-modal px-10 py-2 bg-gradient-to-r from-cyan-600 to-sky-600/80
        rounded-lg"
          onClick={handleEmployee}
        >
          
          Regresar
        </button>
        <button
          onClick={uploadChanges}
          disabled={DisbleButton()}
          type="button"
          className={DisbleButton() ? "px-10 py-2 bg-gray-400 rounded-lg text-white font-bold" :
            " from-cyan-600 to-sky-600/80 px-10 py-2 bg-gradient-to-r  rounded-lg"}
        >
          
          Guardar
        </button>
      </div>
    </div>
  );

  return <>{isLoading ? <LoadingSpinner /> : uploadDoc}</>;
};
export default UploadDocument;