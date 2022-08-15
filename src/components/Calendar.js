import React from "react";

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");

export const CalendarDay = (colors) => {
  const [day, setDay] = React.useState();
  const calcularDia = () => {
    const dias = [
      "domingo", // 0
      "lunes", // 1
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    // Mostrar el día de la semana
    const numeroDia = new Date().getDay();
    const nombreDia = dias[numeroDia];
    setDay(numeroDia);

    // Mostrar el día actual
    let days;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    //console.log("Nombre de día de la semana: ", nombreDia, dd);
  };

  // VALIDATION //
  React.useEffect(() => {
    calcularDia();
  }, []);

  let ValidateDay = () => {
    var showdate = new Date();
    var displaydate = showdate.getDate();
    //console.log(displaydate);

    if (day === 0) {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            DOM
          </p>
        </>
      );
    } else if (day === 1) {
      return (
        <>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            LUN
          </p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    } else if (day === 2) {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            MAR
          </p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    } else if (day === 3) {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            MIR
          </p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    } else if (day === 4) {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            JUE
          </p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    } else if (day === 5) {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={[{ color: colors.colors, textDecoration: "underline" }]}>
            VIE
          </p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    } else if (day === 6) {
      return (
        <>
          <div className="text-lg px-10 py-10 flex space-x-10 gird grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="font-bold text-black ">LUN</p>
              <p className="font-bold text-black text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-black">MAR</p>
              <p className="font-bold text-black text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-black">MIR</p>
              <p className="font-bold text-blackte text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-black">JUV</p>
              <p className="font-bold text-blackte text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-black">VIE</p>
              <p className="font-bold text-blackte text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-red-600">SAB</p>
              <p className="font-bold text-blackte text-center">{dd}</p>
            </div>

            <div className="col-span-2">
              <p className="font-bold text-black">DOM</p>
              <p className="font-bold text-blackte text-center">{dd}</p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p style={{ color: "red" }}>LUN</p>
          <p style={{ color: "red" }}>MAR</p>
          <p style={{ color: "red" }}>MIR</p>
          <p style={{ color: "red" }}>JUE</p>
          <p style={{ color: "red" }}>VIE</p>
          <p style={{ color: "red" }}>SAB</p>
          <p style={{ color: "red" }}>DOM</p>
        </>
      );
    }
  };
  return (
    <>
      {" "}
      <ValidateDay />{" "}
    </>
  );
};
