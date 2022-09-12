import { useEffect, useState } from "react";
import React from "react";
import ViewHours from "../Employee/ViewHours";

export function HourEmployee() {
  const [timeHours, setTimeHours] = useState();
  const [timeMinutes, setTimeMinutes] = useState();
  const [timeSeconds, setTimeSeconds] = useState();
  const [time, setTime] = useState();
  let h = new Date();

  setInterval(() => {
    const date = new Date();
    setTimeHours(date.getHours());
    setTimeMinutes(date.getMinutes());
    setTimeSeconds(date.getSeconds());
    setTime(date.toLocaleTimeString("it-IT"));
  }, 1000);

  let hora = timeHours < 10 ? "0" + timeHours : timeHours;
  let minutos = timeMinutes < 10 ? "0" + timeMinutes : timeMinutes;
  let segundos = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;

  return (
    <>
      <div className="mt-16 text-8xl text-center content-between font-light hours-color">
        <div className=""> {hora} </div>
        <div className="text-6xl"> : </div>
        <div className=""> {minutos} </div>
        <div className="text-6xl"> : </div>
        <div className=""> {segundos}</div>
        {/* <div> {time} </div> */}
      </div>
      <div className="lg:flex mt-16 flex flex-col gap-y-4  text-center items-center">
        <ViewHours />
      </div>
    </>
  );
}
