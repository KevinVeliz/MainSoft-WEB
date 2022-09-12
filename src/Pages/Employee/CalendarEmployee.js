import "../../styles/CalendarEmployee.css";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const weekName = ["DOM", "LUN", "MAR", "MIR", "JUE", "VIR", "SAB"];

export function CalendarEmployee() {
  const date = new Date();

  const dayWeek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthName = monthNames[month];
  const week = weekName[dayWeek];

  const firtsDay = date.getDate() - date.getDay();

  function getWeeks() {
    const arrayWeeks = [];

    for (let i = 0; i < 7; i++) {
      let next = new Date(date.getTime());
      next.setDate(firtsDay + i);

      const nameWeek = weekName[next.getDay()];
      arrayWeeks.push(nameWeek);
    }
    return arrayWeeks;
  }

  function getNumber() {
    const numbersWeek = [];

    for (let i = 0; i < 7; i++) {
      let next = new Date(date.getTime());
      next.setDate(firtsDay + i);

      const numberWeek = next.getDate();
      numbersWeek.push(numberWeek);
    }
    return numbersWeek;
  }

  const weekDays = getWeeks();
  const numbersDays = getNumber();

  return (
    <>
      <h1 className="mt-5 text-2xl text-center title">
        <div className="name-month">
          {monthName} {year}
        </div>
      </h1>
      <ul className="list-employee">
        {weekDays.map((date) => (
          <li key={date} className="list_item_employee">
            <span> {date} </span>
          </li>
        ))}
      </ul>
      <ul className="list-employee">
        {numbersDays.map((number) => (
          <li
            key={number}
            className={`list_item_employee ${day === number ? "active" : ""}`}
          >
            <span> {number} </span>
          </li>
        ))}
      </ul>
    </>
  );
}
