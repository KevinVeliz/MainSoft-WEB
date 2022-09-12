import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { db, storage } from "../../../Controller/firebase/FirebaseConfiguration";
import ModalInformation from "../../ModalInformation";
import swal from "sweetalert";

const ModalEvidence = ({ setModalEvidence, setChoiceEvidence }) => {
  const [file, setFile] = React.useState(null);
  const [data, setData] = React.useState();
  const [progress, setProgress] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [activePerson, setActivePerson] = React.useState("BREAK");

  const dateobj = new Date();

  const monthNames = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const dateMonth = new Date().getMonth();
  const nombreMes = monthNames[dateMonth];
  const month_year = nombreMes + "_" + dateobj.getFullYear();

  const dayNames = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];
  const dateDays = new Date().getDay();
  const nombreDias = dayNames[dateDays];
  const dayNumber = dateobj.getDate();
  let dayNumberFinal;
  if (dayNumber < 10) {
    dayNumberFinal = "0" + dayNumber;
  } else {
    dayNumberFinal = dayNumber;
  }

  const day_day = nombreDias + "_" + dayNumberFinal;

  const handleCancelClick = () => {
    setChoiceEvidence(false);
    setModalEvidence(false);
  };

  const mes = dateobj.getMonth() + 1;

  React.useEffect(() => {
    //console.log("Info de modal evidencia", window.cedulaEmpleado);
    //console.log("Info de modal nombre", window.nombreCompleto);
    const uploadFile = () => {
      const storageRef = ref(
        storage,
        "Register/" +
          mes +
          "/" +
          window.nombreCompleto +
          "/" +
          dateobj.getDate() +
          "/" +
          "Break_Evidence"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

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
             // console.log("La carga esta en proceso");
              break;
            default:
              break;
          }
          //console.log("carga compleatada");
        },
        (error) => {
          //console.log("error: " + error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //console.log("URL: " + downloadURL);
            setData(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // CLICK ON MODAL INFORMATION
  const [modalOnInformation, setModalOnInformation] = React.useState(false);
  const [choiseInformation, setChoiceInformation] = React.useState(false);
  const [text, setText] = React.useState("");
  const clicked = () => {
    saveEvidence();
    swal({
      text: "Evidencia enviada correctamente.",
      icon: "success",
      button: "Aceptar",
    });
  };

  const action = () => {
    setModalOnInformation(false);
    setChoiceInformation(false);
  };

  const saveEvidence = async () => {
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        DescriptionBeforeBreak: description,
        ImageBreak: data,
      }
    );
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        startBreak: window.horaBreak,
      }
    );

    await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
      workingState: "BREAK",
      startBreak: window.horaBreak,
    });

    setModalEvidence(false);
    setChoiceEvidence(false);
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: `${progress === null ? "white" : "green"} `,
    borderRadius: 40,
    textAlign: "right",
  };
  function validateButton() {
    if (progress === null && progress < 100 && description === "") {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="overflow-auto bg-neutral-700 bg-opacity-60 fixed inset-0 z-50 justify-center items-center">
      <div className=" justify-center items-center h-screen w-full left-0 top-0  ">
        <div className="justify-center modal-space-container flex items-center  min-h-screen ">
          <div className="justify-center items-center w-8/12 modal-content border-none shadow-lg  flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalScrollableLabel"
              >
                Subir evidencia de trabajo
              </h5>
              <button onClick={handleCancelClick} className="relative left-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
            <form>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                />
              </div>
              <div>
                <div style={Childdiv}>
                  <p className="p-1 text-black font-size-sm">{}</p>
                </div>
              </div>
            </form>

            <form className="w-full max-w-lg ml-5">
              <div className="flex flex-wrap -mx-3 mb-6 ">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    DESCRIPTION
                  </label>

                  <textarea
                    className="w-96 bg-gray-200 h-44"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              {modalOnInformation && (
                <ModalInformation
                  setModalOnInformation={setModalOnInformation}
                  setChoiceInformation={setChoiceInformation}
                  text={text}
                  action={action}
                />
              )}
              <button
                onClick={clicked}
                className={
                  validateButton() == true
                    ? "inline-block px-6 py-2.5 bg-blue-600/70 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                    : "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                }
                disabled={description === ""}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEvidence;
