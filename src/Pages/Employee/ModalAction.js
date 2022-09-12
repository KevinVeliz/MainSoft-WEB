import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useEffect } from "react";
import {
  AiFillCamera,
  AiOutlineUser,
  GrCircleInformation,
} from "react-icons/gr";

const ModalAction = ({
  setModalOnEmployee,
  setChoiceEmployee,
  text,
  action1,
  action2,
}) => {
  const handleCancelClick = () => {
    setModalOnEmployee(false);
    setChoiceEmployee(false);
  };

  return (
    <div className="bg-neutral-700 bg-opacity-70  flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full justify-center items-center">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto flex justify-center items-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-6 text-center">
            <div className="flex justify-center items-center">
              <GrCircleInformation className="w-24 h-10" />
            </div>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {" "}
              {text}{" "}
            </h3>
            <button
              onClick={action1}
              type="button"
              className="text-white bg-cyan-600 hover:bg-cyan-700  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Aceptar
            </button>
            <button
              onClick={action2}
              type="button"
              className="text-white bg-red-600 hover:bg-red-700  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAction;
