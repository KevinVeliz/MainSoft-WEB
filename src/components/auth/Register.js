import * as React from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.correoField.value;
    const password = e.target.elements.passwordField.value;
    const name = e.target.elements.nombreField.value;
    const lastname = e.target.elements.apellidoField.value;
    const id = e.target.elements.cedulaField.value;

    //console.log("Usuario registrado exitosamente");
  }

  return (
    <div className="flex">
      <div className="w-full flex items-center justify-center lg:w-1/2 h-full">
        <div className="px-10 py-20 rounded-3xl border-2 border-gray-100">
          <h1 className=" text-5xl font-semibold items-center text-center">
            Registrar Administrador
          </h1>

          <form onSubmit={submitHandler}>
            <div className="mt-8">
              {/* <div>
                <label className='text-lg font-medium'>Nombre de la empresa</label>
                <input
                    type='nombre_de_empresa' 
                    id='nombre_de_empresaField'
                    className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                    placeholder='Ingresa nombre de la empresa'
                />
            </div> */}
              <div>
                <label className="text-lg font-medium">Nombre</label>
                <input
                  type="nombre"
                  id="nombreField"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Apellido</label>
                <input
                  type="apellido"
                  id="apellidoField"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Ingresa tu apellido"
                />
              </div>
              <div>
                <label className="text-lg font-medium">
                  Correo electrónico
                </label>
                <input
                  type="correo"
                  id="correoField"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="example@example.com"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Cédula</label>
                <input
                  type="cedula"
                  id="cedulaField"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Contraseña</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="****************"
                  type="password"
                  id="passwordField"
                />
              </div>
              <div>
                <label className="text-lg font-medium">
                  Verificar contraseña
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="****************"
                  type="password"
                  id="password_confirmed_Field"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Rol</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  value="Administrador"
                  type="text"
                  onChange={() => {}}
                />
              </div>

              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  type="submit"
                  className="py-2 bg-black text-white text-lg rounded"
                >
                  {" "}
                  CREAR CUENTA{" "}
                </button>
              </div>

              <div className="mt-8 flow-root">
                <div>
                  <button onClick={handleClick} className="float-right">
                    {" "}
                    Inicio de sesión{" "}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex h-auto w-1/2 items-center justify-center bg-gray-200">
        <div className="w-full h-full flex bg-#38A49D">
          <img
            src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
            alt="logo"
            className="object-scale-down h-50 w-90 items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
