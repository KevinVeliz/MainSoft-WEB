
const expresionesR = {
    nombre: /^[a-zA-ZÀ-ÿ]{1,25}$/, // Letras pueden llevar acentos.
    numero: /^\d{10}$/, // 10 numeros.
    password:/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040-\u002E])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

export default expresionesR;



