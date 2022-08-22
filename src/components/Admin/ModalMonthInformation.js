import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/FirebaseConfiguration";
import jsPDF from "jspdf";

import '../../styles/Month.css';

const ModalMonthInformation = ({
  setModalOnUsers,
  setChoiceUsers,
  cedula,
  mes,
  name
}) => {
  const [empleados, setEmpleados] = useState([]);
  const [mesLetras, setMesLetras] = useState();

  useEffect(() => {
    consulta();

    const mesConsulta = mes.split("-");
    if (mesConsulta[1] < 10) {
      const dateMonth = mesConsulta[1].split("0");
      setMesLetras(monthNames[dateMonth[1] - 1]);
    } else {
      const dateMonth = mesConsulta[1];
      setMesLetras(monthNames[dateMonth - 1]);
    }
    console.log("Nombre del empleado",name)
  }, []);

  const handleCancelClick = () => {
    setChoiceUsers(false);
    setModalOnUsers(false);
  };
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

  let monthName;
  let month_year;

  const consulta = async () => {
    empleados.splice(0, empleados.length);
    setEmpleados([]);

    const horasTrabajoTmp = mes.split("-");
    //console.log("date", horasTrabajoTmp);
    if (horasTrabajoTmp[1] < 10) {
      const dateMonth = horasTrabajoTmp[1].split("0");
      monthName = monthNames[dateMonth[1] - 1];
    } else {
      const dateMonth = horasTrabajoTmp[1];
      monthName = monthNames[dateMonth - 1];
    }

    month_year = monthName + "_" + horasTrabajoTmp[0];

    //console.log("date", month_year);

    const docRef = query(
      collection(db, "Usuarios/" + cedula + "/" + month_year)
    );
    const docSnap = await getDocs(docRef);

    docSnap.forEach((doc) => {
      empleados.push(doc.data());
    });

    setEmpleados(empleados);
    //console.log("arreglo de empleados", empleados);
  };



  const generatePDF = () => {
    let doc = new jsPDF("p", "pt", "a4");
    let imaData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAEAAAITAAMAAAABAAEAAAAAAAAAAAABAAAAAQAAAAEAAAAB/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AACwgAowEsAQERAP/EAB8AAQABBAMBAQEAAAAAAAAAAAAKBgcICQQFCwIBA//EAFMQAAAGAgEDAgMDBgcKCgsAAAECAwQFBgAHCAkREhMUChUhIjFRFiM5QXi3FyQyYXGBkRgzNzhCdne0tbYlJzQ2dHmhs7jhUlRWWGKWscHW8PH/2gAIAQEAAD8An8YxjGMYxjGMYxn53Ae/YQHt9B7fXsP4D2/X/NloNyb21tonXGwNoX2bMSv62p9iu1gYQLZSw2hxFVmHfTb1pB1mMFaVmZp00j3CcXFNEBcyDoARSAABRROw/FnnFQeZ+gtbcjtEUnZxtcbTg0p6uvdgU57V5Js1VfvIwyMhCxh7K+VVbu2K4i6jvdQT9kCMnEzj6NdNXS94rKyC91+wVW3yGyUoe0RE3VZNvRoK30F0mxl4p1GPnMba4dT8tIR+Ru8WPFWKCscK+YviNnsas2eoJqh9wDctQgoKBqj/AGgMbAwMbFRrO4QFkuzhRjCMW0W2CUn7D422UmF0GxFXUjMWl1IyTo6z96s5WVUOai93cgrvo7T2z9rBoLZ+5lNcUeat7amahYRbi8XZzFMlHTeu1mqWWXjnzybkFCFQSj4xzOvjKqAgwZyrv0m7i4ukNxxm6db0a9fk3Z9dT9tqUFY5vVexGBIHZeu5WUjGj2Vpl4rplDrRdmq71ypDzzYgqoN5BsoUixiGII3ixjGMYxjGMYxjGMYxjGMYxjGMZ0M9OEiEUEUEDyExJHO2h4hFQE13zkpQModRUSqAzjmZDFXkpJRM6TJv27EXdLNGjmw1OoriOG3tlbre9zytpvVhuDx7ebEU2vNfmnEmCZtfU5lBR0Q2c0WrHYqlrtZdpWuxNjvX6VotwHcoLNayfUqPa/KoEoJu5aeXcJu3SDNCNZxFbQ9NzZPksUxTBnFJv01G8B7sPcS6x5pAX8q9BEDEr2SqrB0dF7HHPBTDRsVqzlYtNFJQjVL+8x7xqYntJSKT/kkjnySiSBRMdgdi58XJOK2sTmNXRjba3bxzhZUrdlNtvP8AJ2VVP9lNIi65jKw8isPYCxUmoPqqG9KMkZYSnMSsexfwD+wMoyweMtNQNbAPJuVYLNMlAQAvsoVwkMU1VDwMH8dnjs3AFEeyraIfpCAgYRDiWqlt5VUZZg1ZKyhBSO5ZvvJJjMggQU0vVdIFF3ES6CIinG2SNEr9l+bRclfxxAZFt5b7Ds2u0C22DTVfQ2jeK5HmPG6c2Hai0l1IzCaqBxgFNjpQlocwRlY9Ry7jJGUgLgymVUmSTaQbsX/zVreatWKJtsDE2WDc+7iZlki/ZLCQySoJrF+0g6bqAVZo9aqgo1fsXBE3TF6i4aOUk3CChC95jGMYxjGMYxjGMYxjGMYxjGWm3TtyN0rSfyykKxd7oq4slRqcTVddVh9b7bMTVzscdW44GULH/nyxcYpIGnLVNq9o+q1KLnLVLnTiYZ6oT+dcqr2yEGyW+UjpJWZQTOpHVt6q5gxjxMZRtFBMgCDmVhW4iIi0apx0bKuBXdzDeWOogVpddBBBqik3bIpIIIJkSRQRTIkikkQAKmkkkQCpppkKAFIQhSkKHYCgAZSFa7y8lM2lT7SDlUYSC/kiUIWIcLJrvE+33fN5gXroFA7euwbRR+5ipkHK1z+Dlu2doKtXaCLls4TOku3cJJrorpKAJTpKoqlOmqmcBEDJnKYpg+glHLdPXYUZZJNnMMnUUoZMhKvLyqKcu1IYwB2rLp2qLl0mUB+xCSQnSAnYjCUjm6RGZ7faY3dRNo1RPbMerZIKNvjh0aDYX+l3LXllZQFck5GuMm8pV7rCw05DqqSDGXlzt5Bi3UKnLpuDACC6Bhvg1tFbfeXsp+Ed+AlKf2stHuPAxv5IG9JyfxE3+SA9hH9WceaghfLIy0W4+WWFkkKTSSBEyqLhuJxVGMl2pTJfMYlVQROZAVE3DRU5ncY5ZvBFY1n67OlpN9kIR+3+TQ93enllYpVUFW9fvD1QCyLmLdCRIrusXlYCyLd4kRIiFoGUI/bMJKSdtUchcYxjGMYxjGMYxjGMYxjGMZ8KKJopnVVORNJMhlFFFDARNMhCiY5znMIFIQhQExzGEClKAmEQABHLPNfUtt3rk06IIMWLeWm4BosmoAIxJEiRDGXWRU8RI/sbqSXftfIpjs4iJYpGTaunTwFKzeQDyMcry1TUQauV1TOJGCdHOlBzKhx7qr/m01jQ0sqPcTSzJBRN0ce8uwkTAiu1tncd8a3ipuuapkb/AFOl7i2OlKN6drq02mvwV/kmMSkC1rsterTuUSkbHE1KH91LO5qASk4cDIIE94IqGKS4zO0QDVm1ja22kJ1Big3YtEa8wXfMk27dEiLdIJlUW8EmBUipFAVpUn2RBUR9IDqF5HurpICHtoyHr6ImMHrS7taZfgUPuE0XEmaMCCPbxKIWBbsJhMYn5vwW/Aqq7zsM5Y52UASiB2jV0Ffju4/TxBvBFZvFUhDuBk30k9KfyMB/IoEKn18/FxsFCLMK7HsYuTsS7evNHDRqRJyK8ocyTl8q5TIK66sfH+/l1FXCipzCzMc3qKG8T/irdGlyrZ81J6FYlxYRkqh5qilESaSSEbDTIeYm8Gr5FNrCS5hEQIsnDvlPBMkk4NV7yGiJEUzP4uOeikBipi7YtXIplMIeRSCuioJAMIB5AXsAiH1Ae2dIeiVEw90YJiyH6+QxgLRIq/gCwxarMVwL9RICwqAQRESAURHvYbkRpNtsmlxlRhbnsqm2Ra3Vqdr9hqV3lm00yXpsklcHkUdxKnlQGr2mOgnFNuUOj7ElhrNgfQyr1so6bOULp6wui1ij1IiZ7IWWIaR7twmc5hGShJVAHENONTKFKddu5SA7RyqAeaUi0cpuSoLm9Et08YxjGMYxjGMYxjGMYxjGMsVtNe/OL9pKswb+pN9cWiyXFntmOl4eae2uciYugzc9V4ynyzCaYxMCkraI1oa3qTsPOozFaBzBsCRjx+D8txa7/HZm1TPcwpnft68yESlAgs62kom48BAB7gWekJxEQA5gD0AAQTUBQgdjNT6MUKLRFBWSmXpT/LYdoYnunXpiUqjhU5/zTGNbGOT3sm7EjZv5ppFFd4s2aOMPdhcLNDbX5PaN5P7RoEFYuSGlqdsJnqXZyQyCTvWzSXcwjRxHwMUd2EBNpIp2SwCk+t8LMviOJmTdRwwxXSbVplnHTrlo7Rg7MkgzklTenHSDYqhIafEhBN2jzLHUOxkgTKZRaCdLKOSEKqpHuZVois6Tq7GUaYfm1zIXuBmlUjhVEO5wAZ2fIZNIQDt4+rHwSC/f6gAJz5e3kIj6dUvGjZ+0csXiKblo8QVbOW6oeSS7ddMySyKhf1kUTMYhg/AR7dh7DlMVp25ZLuapKrqOH8SkRaOfOD+S0zXzn9Jm+UOP1WfsTgEZMmDuYztNB+cqacq3JlYZR6X/AAldXa30M3rMQkwSEUx7BLTyib972MYe3qNopjEgU5Q8gTlFkwMAGUKNs5esSiaz55UCIJ3rXku6kqy3UUBi0stRs5hl3lIlFlCmTRiJVyElFRT04HSgJyFiZhIooMnjBeutV7RpO56JBbH15NIz9UsASZGMgiUxBK8hJmRrk7GuUzAApSEJYYeVhJNEonIjJRztJJVZMhFT3CxjGMYxjGMYxjGMYxjGMZZ7YEihGWynzS4GFvWEJyRdEDv5LlmWxIRqkj4gcwqe67AYAIYxiqFKkVQ5vAe3inr+OjI6qQqST6yoM0F5924MorFQT6RAX791KqIqgdd45duXDlnBNFiPHZDpqLLRsacJAtXQsE2hyrqiqs/k3xiKScu89Mz5+qmBgTBQyZCJING4HOVlHNU0WLEhjg3QKdRZRXgOFCqXeKTDv5NKtPnP/OEhL1xNP+wY1URHv9wh9M76RjmMszXYSLZJ2zcFAqqCxfIhvEwHTOH1AxFUlClVQWTMRZBYhFkVE1SEOWk/eyNQECS6zmWrJQ/NzqgCvJwZA79i2HwDzfRqYdgCwJEFy1TADTyJk03M4ar1HrRNmd+Zwl7IjczszopwOj7UqQrmXKon5FMl6ICqByCYpidjFEQEBynqair8mCUdEMm+sTpewuyHMYyiPzPwOwaKeXb7cdEJxsaIB3APZ9i/TtlV5TNliXT1BtIxPpkn4VUzyJMoIESc+RQI9iHanYRKxmGxRaLmEDA2XBnIlIZZgj27CLmWUtEoS6BjpNlUlFFSugBBZko3MdJ61ekER9B1HrpLtnqQj3RXQVII9i986ilJnUhfm6xDkcWR47sSpVBEVCIyZwNFoKAb7YHaQqUYzEp/ExfQ8fTRAART/lLCEZaq9K9/FCXTcVd8PmPYVjFUl4NYxR+gAk4aybEglHuKssmUxTF7HR+6GPnVo1cfqd2aQfKj+Kz+VfvFx/rWXOP1+v1+v1yr8YxjGMYxjGMYxjGMYxjGYkckoe62ZBCKoNvj6bMtbZpKTkJaQraFobL02u7DfXHZVaFqq+aGjHFqp8ESEb2JBGUd1l3JR002h5M6PtFci6i7ijsVY5gxUiHkYsYkvDOjCeRZPXJjrKOHq51FlJIZI/quk5wV3RJoRVdg6WW9cqdWZRw/W+l7f5NSU8h/DznE/HuP/wAXgfx/HxN279h7Vjge36//AD/q/X37d/u+uRbuu1vTrG6htvGqH6Susp69aktE1NNdzvKbrSA2lFLXo0/DNIOhW4bE1ctqDqiciXT01kskG9gIUJJaSayVprr1kKbySVBTOyjQcIpZKXBI2JWGiVrA2hbYC0S0nVY5spMs41Z/EIul2LOTM7bM11iAZdskksJhE453RJ6fIHivSZlRQP5RmErVnDb9X97VeTcYub+fzaJfzd8+T2l2kPgtULYmp2ATEI0iXhQ7/guxmnLc384FVEQ/ygDI83WU67FA6S+w9N61l+O2ytpq8lIKZs9vVZTzKgNKLV4WwsKhMzFVVkoKeZXq+SzFdyZapISNeYNfZwMk/sLRzOmKeQNC7Gq0hCQ0qijOxLGVio2SYNZapWSHcos5Bg3etEFWjmIT9u4QbrpouGn8tqumo3OAGSHKK27uHWlK1hfb5brQnXqzrqqTmx5yefRUz7WGjNeR690eyiqfy0VnKbFvBKOVGjMir10mmduzSUcKJkGneHPIHV/KjjPqDkFpebc2HWO0qsNkqUq9h5SAeLsfm8pGuUXURMtmkiycMZOPfR6ybhAoHUamWQMq2URWUyZxjGMYxjGMYxjGMYxjGMZZQjElovuzGHqFBGNrkdXDFE5ygSQssEm4Mv5EETEVSjzpEEwJGMkk48kVBFZwmFXtmA2eFr9jauvldkCJaKoSiKAHFM66KSj+Lk2XqkB7GKuyHI9i1ViHRWT9Zm4YyaCTxLuISeM+WWipRsEXYWSYKPI4VBVRXbicEyycS5MRIZCJWUECkcAmm4aqmBnJN2jwPRN/JqADdZsRDuJKvVgIP/o+rLXAVO34eYopeX4+BfwzsJeej4YqRXJ1FXjoTkYRjNIzuTkVSAAnTZMku6qwJgIGXXN6bRmmIrvXLZuU6xei+Ty1k/OWY3sYo31TqzFx5lXTMH0LY5NASGkPIB7Kw8eZKGDyUQeLzyXpql7uYhG0lAyEGkmi2RdRjiObgRME0mgKNzItjIkTAASBqp6SqIJFL6RkkzJAUxCCH7XJQZqBiJQ/iVZ9HtV3KZQAARdmSKDxAQAxygZB2VZEwFOcoGTEAMYAAw91nWS8ozhWC8i+EwIogQpU0kxWcuV1jlRas2iBftuXrxwok2Ztk+6jhwqmkQO5vpjjtrj5q/cEQwue7NT602Rb9fSKV81wW90mqXk2sJmAXbTLE9Id2WLkSQU8oeNR+b2GK9svIPwSOYy0fGRLdvk2gqi5RScIHBRFdMiyShBECqJLFBRM5fu+hyHKYBEO4gP1+uUPsVwievuIM4lH8o0Xsa7A6ZHAJQRWLhzZXRm6oHIoCUGk8bogchkjSDxgif8AvwAP1q6pwFE1zRqdVoCEq1erdVgoiJr1ci2ELBRDRpGtyEYxcXGN2kexZpG8/SQaNkES9xEqYCYe9eYxjGMYxjGMYxjGMYxjGfggIgIAPYRAQAfwH8f6ssbryu2egXHaCVyuSlyQ2rsiRvVFeqVuIrxKlDFqVWr7fVaq0YoopYHEElVndgi7HKenJTDKXfsFECBXCqObiU7s3bzcQBCkCFssy2IUok+w2kViWJiTxJ38CpsZtukmAmMcyaZVDiU5zEJ2k1BtZpJATqLM37JUXMXKszFTfxjsSCQV2qhyKEMVRMRSdtF01mb9sY7V63XQOJMxrgdyyExtDZFNUr89XjVSB1y3V29NVt2lp+2sps10dg711YE3jhGwS0I7RcRdwjZFWLiqlLrMGhpuwA6QSXyMgIaJZENIs3BpZ5Ippnc2B04TfPpJMO50w94kUqBGRBEx27GPTbRjYTGFq0SE5xNUeMpCrm9o7s0IJvpHTq79oXwEoewsZCzhTFHsIeJJNzLtSl8zCUrUOxUkhRSJVS66LVFZy5WSbt26Si6666hUkUUUiGUVVVVOJSJpJplMdRQ4gUhCmMYQABHKLiEFrO+QtEimqlGNTHPU4tdMyRypqpmRPZX6BwAxJCQQUOnFNlSgrFxKxjqFSkJN4g0rZRMiqZ0lCFUTUKZNQhygYhyHASnKYpgEDFMURKJRAQEBEBAQEcpekqKjWIxsv9V4ormBXHucxjL1545hFDmMf7ShlRYAr6ogX1gOCxSEIoUoUhMOffMdhWpXxFjE1+ercGKh/BI6bJuuewvimObwKD2aRTjBN9xk6+koUfFXuN0WTcrRo2alMJytm6LcDmAAE4IJERAwgHcAEwEARABHsI5ycYxjGMYxjGMYxjGMYxjGdVNRDWcj1o92KyZTimqg5bKei7YvG6hV2b9kt2EUXjJymk5bK9hAqqZQOU6RjpntJGXqJrV0k67cpePjLRKwcdINowViEeWhWGXeRbqXq8ImY8hKJPmCsIZRlGNpB4wfEdxro4laMzr1v8slLZ2UsKR4yviIilWCqF93Jpj/ACT2dygodP25w7D+TzJU7USiJZd5JFUPHtf6TiKcTMVeZQTIk2TXGrPyJIkKmSPnTN04wR8fEpSNp5nFtkCCUCJJSLkExJ5mTV5K9OiPWUeRQu62/WN6iruAWBgCygiIio8jhTWh5BQe49zyEc6U7iIlOUwibP5ApconsCyDC1tCiUPVZmTgpspAHx7maOlVYZ+qICBjnI+g0xEB9Nt9QIHMY22FeOSMFllYqUP9CRc03Vin6pvr5A1TdlTSkClEBAVoxZ63H6CVYxRAw8R0PsLrGOu5wRn4V3Drdih4mfwqwzEUQTeICJjMntjMBRP5B6X2EzAZVRPhKAF1kBR8fOoRLoQcGMH5qzzLJcQFqUB7lWgIdyn/ABoewpy0uiVr3FhHOiSNe4+/LTvpg9bC8MGpk20g8mI91BGcCUqCS1pjkkjP1hU8gMyjpGLn5l8sqJEis2LxMBTI2HtbC0a1qnIysvdTW+ux8/x3QatYe2VuxME3aG21Y9Rs6ShJdo4TKJae1fNmspOoqFK8s8kRuweGRiSSzKTynxjGMYxjGMYxjGMYxjGMYxmDHILgNovevJLjxzMnoSfPyQ4msLk10nYo+3S8ZCs292ZrMZ+PmqyDg1emDO2LyTbsXUg07NV5ADvgfNG7du3ylrl1K7QYJTiRWKj9T2sdKFSUbxMi8TVM2UjFQXUVUg7Cg5SVaOq9IrqLA8RWQjH0uCKp06qn4ok5DSUUY/pi+ZrIJL/URbORL5NXROwD+cauiouCCIGADpB3KIdwH5rkoaahI2SUICThw2KD1ACmL7WRQMZtJtBAwmEBaSCLlsb7Rg7pD2MYOxh7rOmnjwKUaueyfLflQeALllSIKNDmMcASJ6TgpyKrKKdioJEIdZVUSkRKZQSgOuTnRpblrt7UlZa8MuQ6vEaYqW2aNebRbLTUS7AVs2roE8mhd6pDVabK5eVFKRi5Er0pvdRi8u1jXFcdx8Exkzy6OwZKHsbRsRnHzUMwbN0vbsWyNXH2zNukX02yKSRZ5MPRQTAhCJgJPsFAvcPvzi/Kr/8A+2UH/wDJSn/5ZnFeHs0G3UfTd0hCtAEiSYEqC5FlXKpvFBu2RSsjpw9dODfmmzJqgo5cKmAiJDm+yNiJShbCu25q1aJC/wAjH1qKoc1Dyeqm1ZrqMYD6Xm4x7X9m26cOeVmC3GEjmdmrlEpTGSNV02tom7JaGkxJQ8a3aZWx8ezi2TePYIEbNGqQJIokExvEodxExlDiZRVVQ4mVWXVOdZdY6iyxzqqHObmYxjGMYxjGMYxjGMYxjGMYxliNr2ZvqtBCzK0O87Cq9ys9Up9sq+vqa+vkrFurVMMK6hsB5XI4irw1Tg0FyONjvWyDo8ZXWCdhTYuVYx6i951au8IcDBT7I1u0I38gd10r8DXisgUQAUiR0idCZet2/cCnhppBvYGgAKbNxJHFtEkqqpyTE0tPsmLlNeOkVE7VFGIZQAISSOoznWYoqkIog5ZT7F07ftlU012ziYKk4TTWBRMvMVs7iVUOzqDVKVOU50l5xyc6dbYnIIlUArtIBVmnSRgMUzGH9RIqpDN38nFH+2HLjqwgi7Tlpd0rPTifkKUg+IQiEf6hPFROEjSCZpEJGDuQyqIKyThPsSQkn3iUwVC5bIO2y7RymCjdyiq3XTETFA6KyZklSCJRAwAZM5i9yiAh3+ggPYQp2luFla5Ht3RgM9ifcQL8QMAmO8gXKsSsucAKTx92DQj0n2CFMi5TUTL6RyGN/WYsRGLhOKjmp5ifcI+u3ikFSpFQbiYxAfyz0xVEomMA5TB7lcii7oU1EYxnIuyC2yl3rdzEKs5B6dGyX2U9dnANjlOhERQqJh71SOaeSqkbCsW5wVnJdVReWkE/TZC5Mq8jIpOsYGEThGh0hcKPn7xc76Wk1iFI4k5JcpCru1SEESpEKRNNszakEUWDBBqxb9kW5M7vGMYxjGMYxjGMYxjGMYxjGMYEAH7wAf6frlK2GkVS1+Bp+Cj5FwiXwbv1UCkk2hQ8+3tJNH037XsKhxAEXBC/bMAlEDGAceLtxgZzdqqN3hLhfI6ZpK0+uwio+/2av1uyJ2SFLCSUdsarsV3NK2ZFJNUWy8OxuVUduoaVasZOMm2LhkgJKpJcJ+rAgyusrJ01IhSNyzcpW4WSpQEIAFblRlYFGMQr5fH7IpTTlZqQoFKm8IYpyhdJu4ty7dF7HytOnGjpIirZZFnKx6CyChQOk6QeN5WfQeEVL28QQRTSEDeZFxDsQeuk7nKwRwRlo2uiscg+k0Y20hpJ0bsUQFvFPoZg4UIYTFD00VXK4CchSpLCbyyNYz6xPOt11253pnQXDVGD46TsooQmxpSt31LYzCAR1o3sDnkOnaVVXGtE9ZyMkwJFtYdasLgD1wVq4nnNuWXgTyVYiny7VudJadGLTdHF08TgmxRkXrpTsCi0tZJv5nJSTrwAEvdoNok5UyJooJNmyabYnHi9Oa1iNjLbdaVOPPtBzR2+tnF/fKPZK1r0RrYXNsQqqszIunTk0KnZXjqbKyAxUwkV1HH8oQALm4xjGMYxjGMYxjGMYxjGMYxjGMYz5MQpymKcpTFOUSnKYAMUxTAJRKYogIGKICICBgEBD6CGUGy1jSoteSWholSBTlzpqyUfXpSYgId4uQTCZ0rCQ8gyiCu3HkYHrtJkk5fgIA9VX8S9qqjYSIhiHTioxjHlU8RV9m1RbmWMXuIHXUTIVRc4iYxjKLHUOYxzmMYTGMI9n2/+vf7x/Dt93/2+7v8AX7/rn7jGMYxjGMYxjGMYxjGMYxjuH3d/qH3h+Hf7sYxjGMYxjGMYxjHcPxxjGMYx3Dv27/X7+36+344xjGMis9ZnnR1fOlXryrb5gtkcLtz6avG119bN2rzjrsGmXqmyc3F2W01FnIt/4eZ2JtLE0FWpNhIT7BaFWLJtEFDQJEJADNcsegR1dLF1TNB7KU3M2osByP0tdkmF1gqJHu4GAl6Bb0Fn2v7hEwkrPT8i3A7hhYavNpg/dIpSUG2eiduWZbtib9cZpB68PVLn+lxxPr141a1pszv/AGzsGOpWq4O8Rz+ar6UZDEJP7FtcrCRsvAvZOPgoIrKFSIhLtAQn7XBOFvXQRVbLYG9FrqAdW7qqVW17tnL9wx1TpzWm3YDX0/Et+PWybDdLuLWNhLZcY2CeJ7yjIqqGJXJliwjrA+SsAIyr8HCkEu3ZGTdSrw7/AK/r9R/s7j2/sDsA/iP1ygtqbEhdRaz2FtSxs52Qr+tqTab5OMKxEL2CyPYiowb6fk2sBBtTEcTEwsyYLkjo1FRM7x0KaIKJgcTli/dGHr4W3qO9Qnk/pjYEa0oetLhS4668SaA5Tjzy9bitZrrMLrCzc2ybkWsNzvNfnGewJhNRdeNhTViVjIESxzQV3kr/AClbyzuEjTLWw19OQdZvTyuzDWnWKzQDq116Csy7BdODl5yssZquvLBEx8iZu6kIZrPQriSapKNEZRgdUrlOGp1eerz1fek1trV2t7Hc+FG6Ija9EkLlX7XDcc9k0hy2WhrCpX5iHk68/wB92QElG6hmLxs9bTS6Tpu98TN2yqBin3U9Kja3Uw5Waa488tOSW2uKUdqjcFOf3dxpfWHH2+xl5CCmG0w0pi/8Kszu2VhYt8LpGNn5RgTX8okaPMpDJvU3Swv2/cdUC1dXvTdXtu7eATzi/tOlVGAbTE1ojY+qbartksfDRq7i1zdQuzTa0HWbo5AEVJNCnOYOtSxGCCzWHf2KUM2j3Okro8fFAWXkjv0nHjqBx+ptbutmvIyM0rtagQ8tTKezuLgwNUKJsJpYLRZ02iVvXVRRq1tSkGLNjPglAzTUW8w0k42aQAgYAEB7gP8AV930EBAfqAgPcBAQAQEBAQAQz9yPT1feQ/Vl4D6Q2ry70ZsjiTs/S9JuMYvKazt/He+RWwaLr63WZlWK+6C5MN5uYbYDyFlpmFYT7n8mqaddB2eVaMylSOwDYZwdieoo9rlYv3N/avG+TcWvXcZJvdQaR0fcKe8olvmSRMqk3f7Psu3LUjaCw0eo9ipZiyo0O2WllfWYyirRgVSQtj1Xeq7pvpbachrVa4Z7s3dOzHr2B0douvvisZ6+zbMGxH0nJPwbP1YCmQS8hGITE0jGykg5kZOMhISLfyT4RaWN0XqXrXcg6XFbd39zP1fwnnrjHJTEdxp0rxR13tZTXzCQKDuNjNgbB3PPzknIW1q0URb2GFgg9jHvSrtyTR3JVEm1u+SHUj5e9JRWEmuoPryB5TcWbM9PXK7y14rUtXXd8q1xOxcuoWp7v0JbblM1Vi7tSrZdKEuVK2FG1xczZVA8OlJilEqbc+GfJFpy/wCLWi+TbGpuaKy3druD2C0qLyYSn3dfbThVjoxrmYQjolGQXRTSKKrhKOaJmOcSlRACgY3S80ObvHTgLpSZ3vyTvTen1CPWCMhY1qiEnb7zZ10Fl4+n0WtprIurDZJEiCihGxFWzCOZJOJackYqGZu5BDSlxV5ydWTq3pSO0eLdI090+uF6kpIxNO3juumSPIDeWyzxjozB5Ja/ohpqpa9UjmTpFZpKSUgipWo+VI5iYuyW95GySTTO+c4rdV6vxfzfX/VOqd4tke1Oq3qu7eDumWuubG+KX82zk5LUUxVL3W2K6gAU76NfTrhqmImBk8MUCmwx0r11bNpnlKjwS6t2k4DiDvZ+aPCi7up1hfTvF3a7GYdKMYCwxUzPAMzSq/YnqKzGMnZKUnoBhKovYa6PKLKsHLEkj8hyqFKchgMUwAYpiiAlMUQ7gICAiAgICAgYBEDAICAiAgOahuqpsjqMcdNNbj5QcS9j8YA15pHT7/YFi1LuHSd7stxnT1D5jLXKShtj13bFfiGpDV4G6sRXnlJOIu410VefAj9L2uivo+9YTqs9WTbu2NUx2xeHmj1dYa1Y7E+dvOL+wNgEnCvbfF1X5UDBvyNqR44Uwkhf+9Fy9E/og19oQFDOUt/MjqXrFJIKHieZ/BZ45BMwpISfBjbTBA6vYfEp3LPlxIKJJj9AMcrRYxfqIJm+gDo1529TzrtdLrY2rrLys11w82NxTsexavDTm5dHa02QeKcw55Rq6slTeqzmwSzOvL69qyMs4rgT8BIRMk5bKqwbywGjZFkhcvrO9WvnHpLnVw24o9NZ/VdhW/dmpY+8uKG6ocBfozYT7Z1rfsdcGUfPxYyleYRtYqcxZH0qxn4KOaQEqrNTboY5mC7XaJSNc9c+Sg4h3feUHToqk25jWa8tE17iju67N42RVbpndsUZhfkDTUZNNquY6AP0WDRFz6frIIFSOTNMfWH6sHVl6SVo0NWZrZvDLeCm8IG+TiTuK4ubHoBa3+REpXY1Rqqi/wCR9sNK/MfygIsmsVSPFr7U6Z0VwVIqXZnwvv8A1f8AmLxQ0VyhiOUXByko7t1/G3pGlSfC7as2rXAkXT9uWMVsDHlaxJKGSBkU4vCQzAD+sJQagCZTq42dS3dPxBPCfjzY9/U+8cKN2UallVe7Jc6p46bBgti6/qpU/wA9eyVi97MukJOVqGU7Hsrhp7x3XmhyTLyLcwTaWfxuzroucwLtzq6cHHvkJsyxoWLbEw0uVV2rKN4mIhiurtSbzYq65dmiYNpHw8aMnDsoWYK0jmLRoklIpekgmUfHLJ9b/TVG5E1Tp56H2ZGfN9f7g6ketdeW1gUxSLHiLLxw5RMjO2ipinBGRiHYtJqKceJvbykayX8Ten4jBk6a+8dhdEfrGra53Y8UgapA7EnOMHI8gnURh32urJNMm8NshBIXQkPDxD8lO2xDPRKs5cVojpBuUCySpTeqsiqRdJNZI5FU1SFUIokYDpqEOAGKomcoiU6ZyiBkzlESnIJTFEQEBz7EewCP9gfQO4j9AD6/TuI9gDv+scgefEJuf7qDQXLjmS6SSk9baa5Oac4D8XXqn22jhDXMjdbPy12XClA7losW57tLEaqZzjFYgPIPRpylAyD8QHO74PD9Hnvn9sC1/ug1FktbNbvVK2LZ4PjShozWkieO3LzS2PTeHmrXiBAVcQbjcq7trs29FIUwrooaz0fF7Nv6j5FJT2rqBYlESGXTNnnW8ltfz3Qq62rGX140l0qBpXcVS3Dqts6euHzu0ccr2UVndRUlHCjd5KHNS5G3avmJJwoCzqWiHy6x1Fu6hvVOpVvruwKdVL5UJNvNVO61uCttXmWgiZrLVyyRbSag5NscfqdB/FvmjpI/+URUByps8/H4yz/GH4Tf6HdnfvBg8ll9FX9FJwG/Zm1x/qLjM+txgBtS7OKYAEB15eAEB+oCA1WXAQEP1gIfQc873l30N3W0elDwt6iXEKnivsSG4l6ymuT2p64xOZxfIaNrvqPd0VKPb+oq5usJHpAOxIZqmUbPBMyWpggFjjJsLFti+HC67JN5RVT4Bcw7n/x2wTFtBcets2Z93V3BBRzXwZazt0s8V7r7ShGKBUqnMOj+rsWFbljHaql0j0lLVMpAe4dw+4fqGaeuvoUDdI3mYBgAQ/JDX49hDuHcN26wEB7D+AgAh/OHfNvEcAAwZgAdgBo2AAD6AAA3T7AAfcH82edr1rN8RUZ8SZx/e72kQPpPjpe+E7Q6cqsb5FC6+XkaptS3zDhBdX2pWqU9bJmUl1yE812kammsVYWaaeeic0ctnrZF2zXRdNXKZXDdy3VIsg4QXKCqLhBZMxk1UV0jlWRVTMZNVI5FEzGIYoji9zf4z1fmJxL39xrtse2kI7bOs7LW44zkhD/K7YVipJUexNhU+ym+rVyYwU6xVEQ9NywJ3MBTGzHno4wczV+l1wcrthiJOBnoPj1SImXhpli5jpOMk2RHbZ2zfMnSaThusg4IcpyKJlHxADlASGKIwTOZW8Lx15+t7rnjhFWeSLx1i90PNJ6nj4xb+JQunKW+dye4NqMUiKKM1bLfYSp2K1Fk1kwcDGpVGAUUO1h2qZvSx15Qabqui1DW+vK7G1Ki0WtwtSqFYh24NYyBrdfj0IyGiWSACbwQZMWyKIeRjnUOB1lTnVUUOassjffE8cIK1ya6ddx3jHQzQdv8QTH2xVpxNBMJFzrpd1Hxu3am4dGIYRhl68dC6GbmD6StNaCiJfduiuLNfCw9R208ruLFy4ubfsrqybV4kmrMfVJ6Ydqupmz6Jsqb1lTUHTlcplZJ3rqWh31PVfHVMclbdUluv6jgijhfdH1Xv0ZvPn9kTf37t57IYHwb3+OFyu/Zng/3t1jPRBEQAO4/iAf1mECh/wBoh/R9+Yc2CE429TLiNdKlNx6t+0BvOM2LrqUI9Yqw8gqpT7pY6BJzMMLtNVxFTNbutSdzFPsCRPWbSEXFzjEQKZMBwc6ePSTV4l70tfI3ee0YnkRuGA0xp/ivoO8HqikA6ovHvUOvoGqprvI9+7lRZ7KvT5is3t0nHykih8ijGyTCSIe02dmO6rICfxnP+FjgN/mHvz/ejWuSkehz+iX4G/s/Vn/aU3m06SjmExHvYqVYs5KMkmjlhIR0g2ResH7F4ids7ZPmbgiiDtm7bKqt3TVch0XLdVRBYh01DFHUTxH4A7t4ARu9dTcVrRqNHjvfeQ1v3dqqm3pS5hN6vhr7UKA0mtct1YmFes3FfgrhXrI6q6vul3YV+TjkZJVWSRdqH7rqlf8AP3pPf9a/pL/w/wDJ7IzfxePAgY2a071D6HDCDawIReit9qM0jfSZj2bp5qS5SHgZQ4mkoVCaocjIKlRRR+R01iBjKukwNvd+HM58hzf6d1FhrXNDJ7p4wmj9E7OB0sZWTlYqDjEz6tuzkTJgoqWzUZFtFvX7hZVd/aKpZ11DeQ/XYV1GORVn418U73ZtZoEk987Df1rQ/GmuiJTLWLkRu6Zb691U2TQOmoV00gJ2YG7TyIgXxrNVml/IoJCOR8fiFeO9a4m9BPTHHOprnfxWpdtceqq4m1wOV7arGlHX59crtKeoY5lJq83F7PW+aXMImcSs27WMPc/0774PD9Hlvn9sC1/ug1FktYR7AIj9wfUc1FQ7r+6g6uljk+4O9X9M7SKNRjVBMQGrjlvy7jG8vanLZwn6iDx3rXjdBQkEsAmB1GOtwSzQfQ9Vwm40f/F+8My3jQ+kecFVjiLTmj7CbUO0HCJBOqtrXY773tKk3yngYpWdW2Gk5iESicndTYggPkBChmdPwuPMv+6Y6b8LqGwyQvdh8QbEfT8oVZT1HjjW8om5smopVYPUP6bVvCqTNGZl8Sd06IIiAmEw5JMzz8fjLP8AGH4Tf6HdnfvBg8ll9FX9FJwG/Zm1x/qLjM+9xf4Jtm/6Pbv/ALrS+YIdGUAHpVcBAH/3XdVj/QIQZew//wB+n4/TIg/xFnRGmOMFymOopwsrz2G1DIWJvad00OkEcRzrQ95cSibtvtOkJxIpOIjXMzOnQcyLeOFD+DO1rIO44zeqyjRKt7sPh8OuMw570WP4uclbEyY8yNdQJhi5x8duxT5FUyDbB69pjUwFJH+E2vMkgV2FXmqZBl2pD3qEbixPYmVfz76+f6I7mX/mfQP316wzbxH/APIWf/RW3/cJ5EP+JT6JW2uZstWeafEiu/lpualUpvRtsajYqkRsWyKbX3T+QrNpoibhVJrL3eroSUjESdYOonIWquliE697mahE4iYji8F/iCOo500iM+P+wY/+GHWGulQrR9Icho2xQt71w1jQKkpWatdDpNb3Tk41JNJkxrlsj7VXoBumDaLgI5H83kzjp1fEZ8EOfE5X9Yy0hLcaN92FZCPiNabcfxhq7bZpwJSpxOvNpMfbVqxP1lTptY+Fn2tNtEw7UK2iICQV+g7geVVokaPxg5GXWFOoSXp2h9wWiKUIJvVJJV/XVllWJiiA+fqEdNEjFHv5AYA+4c84X4UiuM7D1Z4iXegCjumce912mOVOYRULIvmdYp66oGEfIyh4+2yIGN3Ewgocw/rEPT3xmMnNWvsLZw65XVaUTIrHWTjZvSDfEUABKLWT1damiwj3+4SlVE5TB2EhylOUQMUBDz1/hIbhLV/qg2qtNHCwRV44sbOjZVoUwggoeDs2t7PGulSB96jVxHLJIiI9ig8U7B5GKITwOq9+jN58/sib+/dvPZAy+Fv5CSnHfk5yQscXxz5IcjlJvQcNCq13jbTafcrHApk2XX3xZqfZ3HYGvmjWFVOgEeiuzfv3Rn6ySZmZEPUcEkddTLr774406MuLvWvTR5wamss9FPa3W93cndbQNI1Tr+bl0DMWdlcLUez7KZz0pGLLgtBwEpP1drJShGorvVWqazRzsE+H4XWddHrhE7cqquHTuiXt26cLqHWXcu3W5tkOHTlwsqY6qy7hdRRddVQxjqqqHOcwmMI5uSxkBP4zn/CxwG/zD35/vRrXJSPQ5/RL8Df2fqz/ALSm82t4zUt1Sv8An70nv+tf0l/4f+T2Zgc0eLNK5rcUd18X78REsDt6gSdbbyaqBXB61ZiJpSVMuDRIxTeT6oW5jC2NqAB9tSOFEwCmqco+cN0L+Ut36VfVkeaF3uKtLqmyLlLcTeQcNJKGbxtZurC0rRVGua53DdFL21Y2Eig1GaVFBqjSbbPvkjiguUwzqJwf7r7qs16tEN7/AEv0wKOlfLKiIlVipzmpyRq76JoUa4QVMqykXekOPKths5FkP41CWLcMOssRBygyUzA74skADpTCAfQA5L6UAA/AAZXztllPg8P0eW+f2wLX+6DUWSf967hp/HzTG1d57Bd+ypGode2/ZFqXKYgLfI6bBPp5+g1KoPZZ68SZeyYtygZRy9ct26ZDKKFKOgDgp0td9bE0DE8k9gdQbnZxv3FzJn53l3ufV2hbvqurUCAvO81ULLHxiEXaNQ2yxJSde16Wj1STJJzrn2ziBFkyaxbFshHN73706I9s3pp/YmpL31UOpFfqxe6vJQj2pbE2JpWdpEu9EhXsCSzxLXQ7J6+h2liZxL96gwfx8gdFoYGMiwdCk7Rh6/DjckrNwN6szrjTtY61ait7Sdn4r7JhnqpU28JuOrWB6GvF3KaotjnkW+wYeRoTYxygdFG8OzCl3Hxz08AHuAD9Q7h37D9BD+YQ/UIfrD9Q55+Xxln+MPwm/wBDuzv3gweSy+ir+ik4Dfsza4/1Fxmfe4v8E2zf9Ht3/wB1pfMEejJ+iq4Cfsu6r/2GXNkU5Bw1mhpau2OJjJ6AnoyQhZyDmmDWUh5mHlWizCUiZWNepLM5CNkmLhwyfsXaKrZ20XWbrpnSUOUfNC633SN2p0k+RNc5n8NnlurnG6Z2BH2bX9pqbx+WxcY9qEfGlIumP5ZIx3adXcOk1FNZWZ6or67Qi9JsKriTZNXll2x2TrO07qjdCnmhT7+tDVTmHqXWWtVNs0lmBGTG9wSO8NURqW4qCwD6BXpR4u1b22DQ8jUeyvUWRw+RzFcdOpsUf9GLP/orX/tQSDLP6P39rbkTB3id1tIPZKP17t3aWj7USSjFoxwxv+nra+plzj/bODHOq0Ql2B1Y58HilJRy7R+iQqTggZaHlb09+GHNyEcQ3J7jtrbablVkZgztsnCEi9iQiAkMUha9sivnir1BlSEwHIjHT6DUxiEBZusmApj55PXa6ETrpdr1jkFoW42K98Wr9cE6mRvaDoqX/UF3dtn8zCV2el4xsxZ2etzjKJklKvbkmMZItH0YrCT7QX3yubnJpHRa3bbufXR40xJbtlX9gt1l17tHQF+s8koMhJWdpU5i0asa2OTXWBJWRlpOopxLiceuVlXElLkfvXTk7hyqYIVnQFfS3CnrqVTRW201K1Yl5rfPFO0pvEhbFb3NOMlmsCyErg6BjEm7nS4RjHHJ6gPDyrE7YqhXCZh9Qoo+RQMH3CACH9Yd8/c179V/dEVx/wCm5zX2hLOk2YRXHTZlfhllVio+dt2BX3WvKW2TMbv5LO7VaohBFMA8lDnAoCXuJghkfB4cfJqzctOSPJZ1HuQquqdJNtVMpE6YlZrXTa1qhZcqDRU5BBw4j6rr2VVeEROBmqMuyFcoFeoiMzzqvfozefP7Im/v3bz2Qvvg4CEPzA5XFOQpyjxngwEDFAwCH8LlXHsICAh94AP9IAP3gGeglfNfUvZtItmuL5WYi1Ua9QErVbdWJdmk5iZ6vTzJaMl4yQanL4Lt3TJysmYBDyKbxUTMRUhDlwb6TvHy6cVOAehuPF/iHsJZNTn2xVjMpJRkq9Vgkt37Je0+VXPHrLtDDPU95BThPSVESpyJCqkSWBRImxbGQE/jOf8ACxwG/wAw9+f70a1yUj0Of0S/A39n6s/7Sm82t4yP71uOV+mtBbc6R1c2LcoWvP1epHq3a8uR+/bIngNYVai7I1pZLxMpGVBaNrkVPbcrwOJZ0kRkKLaV9NUx2K/pb+myqDhsiqgqm4bqopnSWSMVRFdE6YGTVSUKIkVSVIJTpqEMYhyGKYoiAgOeeh8W1wEPq7kNrbnpr2GFrVOQibTXm2TxjX0k4/ddKiAGszq527dFJJzsGgR6TdLwMosvNUGUeuFBdSJRPMC6RvGe88aeFGukd0TEvaeSe713fIrk3crGud3Z7Huja7ONkpRCwOlUUTrSFMqzOqa8+yX0E0qmBWwFRMUM1W/Fs2avxXS/gK9IzEe0nbXyb1UnXIddykSTmfkUHfJSaVj2RjA5ct4piKa79wkmZFoDhqVc5Dum5VLK/B1WSBccFeRdQRlmKloh+VUpPScCDhL5qyhZ3VOtmcPKrsfL3BI6Rdwsq2avBTBus4j3aJFBUQUKXOXre8ntIyEzw+6bF12VUq0rzQ5N6cZb5bzE+zi0q/xfo92jLlb29gfGcJlr38LFngq5riANLqNGMw0d2jzMu0YuUVpALAWgsmhmHt/YmbomZ+19H2oNRTL7crb2/wCY9AiPgRH0u6fpFIBBEvbOUIAICA/cICA/Xt9P6f1f055cHxJWta3xt6v9s2ZpK3RKE5seE1pyMeEqcq0cP9d7dB88jJgXoMzrKRc3JWKjNNiAR0KTv1bIZ16RUlEVD+iZ08eYVN528PNG8lqjKRTx3faPDHv0PGuWqqtN2jGs0o/YtOkWqCyi0e6hbU3kitUHibdZ3DLRcqikLKQaqHhY/GRzcS75QcOa81kGribhtH3mSlYxJYijyPYzmxWycQ5doFMKiCUgaHkvamUKUFitFTk8ih3yWd0QpeLmuk5wMdxD9rItm/HinQ66zRZNdNGUgVJGHmWChkzGAjqNlGbpi8RMIKIOUFElClMUQzMLmHtam6Q4r8htsX+aYQFTomnNiTstIybpFm37o1SVRj49FVwdMi0jMyizKHiGKYmcyMq/ZsWqSrhwkmbAjoH7epe3uk5w2dVCaYyjigatY6kuDBs4SVfVy5a5fPq/KQ0y1TMZWOeqtW7CaaIOipKuYaXjJBMpm7xI5txOW721qbXO9da3XT+3KfC37WuxK9IVa5VCwtQdxU3CySfpuG6xAEqzdwkcEncdIs1W8jEyTZpKRjprIM2zhLyv+rf0l9qdKPlNFsYF1ZLFxb3FY/T0xs4FFiqO4hWVYvJXUexXDEjdoW6VxuCHuE1U0427wSDS0RzZNUszEwXq6Rn1jWHf/wBTZf8AcI5DI6WPVX1zxW6k3Ur4aclJ5LXepdydQLkPcNKbas6oxWvIHcTq7vYy56+tFofinEQIXOIZ1aXg3jt20jWM2yXbSqzc1ojVwmfoO2zpBF02WI5bOUkV27huYF0F0FyFURWRWS80lklUzkOmomcxDkMBimEogOQ5Pia+X0FyQiNSdJfiexX39yh2VuWqWm+07XPoWVakMqm2mCV6oz7lkooyibNNzUqnPzKDt0gFLqVbdzVtNER8kyVWkT9L/hqXgNwU49cW3b5lL2XXtQcO79LR/maPktjXSak7pfFY1VQCncRDWyTz6LhnKqSKrqIjmLhZFJZVQoR4viDOi9uO87XhOqF0/oiRX5CUB5VrVtrXNLaE/LSzzWuF2Dyn7p1qyRTE81f643iY1laKs3KpJWmNh4mUgWz2faybKa3N9JPq36V6lumYooysVQ+VVGi0IjfegZh0SKtcHa4pMGc7aKnBSB0ZSa1/MSCKzxi8Zou3FXVc/kxaPZSzMhnm3J/IsYtk7kpN42j45g1Xevn75dNmyZM2qRl3Lp47cmSbtWzdEh1V13CqaSSZDKKHKQpjBBz60nMnZnWd3VTOlN0vIxxuyi1W5R1v5EblrxzE1M7sMIuuyhkH99RTVi2+pNcLOX03N2kyrlnd7oSIjqKznnEDEqz0o3phdPbW/TR4l0fjfRV0J+ebquLbtfYQMQYPNkbRnUGpLFZlmomOdnGNUGbCu1WMUUUVi6tDRLZ0q5kRfvHPWdX2xwdW6X3PWUsEmziWC3FfckKi5erpN01paxU6RgYOORMqYgKvZWYkWUcwbEEyzp25SQRIdQ5SjDL+DnlY1nzV5PQrt+0ay0rxhaLxke4cJIu5BKJ2vUFZIzNBQxVHIsknSCrkqJTmSSOChwAgGMHopY//AH+378Yzz/PjLp+Efb24O1dnKMXNhgNYbimZqHRcpKSEXF2O30ttBPXzUhhWbN5VaBmCsVFSFK4COdGSExUjCEpHoQT8LYukjwZcwcoxlUI7SzGvv1GLlFyVlNwFhsEZMxboUTn9u+jnyCjd02V8FkjAXzIAHL325YzVDLdDfpP2B6eSsPCzWtiklCpkUk7DM7CnZJRNIoESTUkJa5PHiiSRA8EkzrCRIv2UylD6ZmHxp4bcaeHkTY4HjXqyM1VCWxWGWnYmImrVKRzg1ebvWkMVozsk9NIRKDFvIvEk20QRg3OVbuskoZNISXC3NonT/IeotaHu3Xtb2XT2Voq11aV+0MxesG9qpUw3nqvNJEKokcjuJlGyayfZT0nCJ3DF4m4YO3bVa7HYO3bt9O/f+vv5d/7fr/5ZrAv3Re6X207dYL7sjh9ry73G0zMrPz1gssvfJZ++lZuRcysm4A7u3KJtU3Mg8cufZsk2zJEyokbt0kylIX4oPRZ6XGrbrVNja64b6zpt4pFhh7VVLNAP7swlIafgJFtKxMg2WStQFUM1fs264t3BFmjj0/SdN1kDnTN0050OOk3ZpuZsk/wg1JLz1hmJSfmpV8tcV3clMTT9xKSj9yoa0faWeP3ThwoAAVMplBKmQiYFIXN3jbxZ4/8AEDXq+qONesoPUuunNkk7crU685l3EYFimWsczk5JIJmSlHDc7tvEx5FEEF0mhRbgom3IqqsdSv8AamrNf7u11cdS7UrLO5a62BBPazcatILPW7GegZEpSPY10tHOmT4iDkpSlUFs6QVEodgUABHvrPHoOdIQe3fghpsewdu4muAj/WI2kRH+sR/D7suvqXpIdOPRD65SWnuKWv8AXr7YOurdqW5ua4/uLNSf13e2iTG2Vl55WZQpW0u0RTRO7blRkmoFEzB61OY5jWvddCfpHvl1HT/g5qeRdrCBlnki9vL96uYCgUDLvHltWcrmApSlAyqpxApQKAgAAGXl0J0rOn3xd2JBbY4/cZKVqy/1oJcISfrMrc0/ZDPQ7qAlz/K3lmdwrhV7DvXLFRV3HLqkTUA6R01U01Cd9yN6anBvlxcQvvJHj3WNu2gIuKhivLRNXQzIkfCe9+VJkgo6zMIAi7MJF6Cb4kWV8Yrg5VHJygUC0XprpIdObjxfa7s/SPFmk6yvNUlW83BztUm71HmbybRF03aunceFrPEywt0XroiKMuwfN0/XOYqQG7CGxoAAAAA+4A7B/QGMx+5PccNIcrNOWbTnIPXcLs3XEwpGSzqvTCskxO3mK8+SlYSZh5uCfRVhr81GPUQO0l4GWjZJJFV0zB0LN68br39STIkkmkmXxTTIQhCgIiBSplKUgdxERHsUoB9RER7fXvmO0xxF4uT+vrjqexcfNQWPWuxLzbdkXmk2Og1ywV217Cvci5mbbeJuOmGD1F9bJqSdKunFgWA0okYEE2rpBFq1TR1Hbl6S/BSgWOt0rX+t9n6/o9kOcstQ6Dyt5b0mhqJOlyJuGzOk1fekTVYlmqRQ5TMomIYtA8zCVEBERzZRxJ6fXC7hRGqjxf46681PJz8ekhPWqMZPp2+zjUSorCymdh25/YL1KR4rlByMe+sLhkLnu5FAVzGUHNbAgAh2H6hmuzlN0x+BnJuUf7V3Fxqo0vteKSWkmW2Ki6s+p9qlkGRDKM3rnZWpJ+j3h86aiXxbrvp5yoimJ0kzFSOchtaunemhxG3/AG+To+84Dd24qRCLCpH0vZ3MLmJeagX2TgRbJO6vZd8yUFJNkhIUQaSTB21MJS+aJuwdt62juPOiuNNNR1zx+1FrzTdHaHTXLW9d1SHq0e5dgkCZpGTLFNW6sxKqkAAXlpVV7JOB7iu6UMIiN58wX5J9NDgrzBuzLY3JjjjS9w3OOgWNYYTNqfWkwtIONcyDtkxQYR1gYRafoOJR+p7krL3igODEVcHTImQmPzToT9JCPcJPI/g5qeOetzebd7HPLwwetz9hL5t3bS2ouUD+JhKJklSGEoiAj2EQzZprjXVL1HQ6jrHXUEhWaLRK/G1apV5s5fPG8NAQ7crSNjkXUm6fSC6bVuQqRFXjty4OBQFVY5vrla4yn7bVYC9VWzUi2RycxVrjX5qq2WIVWct0pWAsMa5iJmOVXZrNniCb6OeOWx1mrhBymVUToLJKlIcurVz0Jekc9XUdPuDmppB2sJRWeSD28v3q5ikKmUy7x5bVnK5ipkIQDKqnMBClKA9gAMvNoTpWdPvi5sKE2rx94y0zVV8rp5NWInKtL3RAjZWZhXtdkllYh1Z3UG9Xcwsi8YCs/jXKqSS3kgdJVNJRPYJ92M//2Q=="
    doc.html(document.querySelector("#contentpdf"), {
      callback: function (pdf) {
        doc.addImage(imaData, 'JPEG', 470, 20, 50, 25);
        pdf.save(mesLetras+ ".pdf");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 items-center justify-center bg-neutral-700 bg-opacity-60">
      <div className="top-0 left-0 items-center justify-center w-full h-screen ">
        <div className="flex items-center justify-center min-h-screen modal-space-container" id="modal-month">
          <div className="flex flex-col items-center justify-center w-6/12 overflow-y-scroll text-current bg-white border-none rounded-md shadow-lg outline-none pointer-events-auto card-content-month bg-clip-padding md:w-10/12 sm:w-9/12 lg:w-9/12 xl:w-7/12">
           <div id="contentpdf" className="ml-10">  
          
            <div className="flex items-center justify-between flex-shrink-0 p-4 modal-header rounded-t-md" >
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalScrollableLabel"
              >

                {name} - {mesLetras}

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

            <div className="" id="table-content">
              <table className="w-full mt-5 ml-2 mr-2 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="">
                  <tr>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Día
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Entrada
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Break-Inicio
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Break-Fin
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Salida
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      
                      Total Horas
                    </th>
                    
                  </tr>
                </thead>

                <tbody className="">
                  {empleados.sort(function (a, b) {
                    return a.id - b.id;
                  }).map((item) => (
                    <tr className="border-2" key={item.id}>
                      <td className="p-3 text-sm text-gray-700">{Number(item.id)}</td>
                      <td className="p-3 text-sm text-gray-700">
                        {item.startWork}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {item.startBreak}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {item.startBack}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {item.finishTime}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {item.totalDay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            </div>

            <button
                onClick={() => generatePDF()}
                //disabled={validatePDF()}
                className="py-3 mt-5 text-white border-solid rounded-lg button-admin hover:bg-white hover:text-black xl:w-80 sm:w-52">
                GENERAR PDF
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMonthInformation;
