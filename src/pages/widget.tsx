import { useEffect, useState } from "react";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { TempUnit, Weather } from "@/interfaces/weather-interface";
import styles from "@/styles/Widget.module.css";
import app from "../../firestore";

const celsiusToFahrenheit = (c: number) => {
  return Math.floor((c * 9) / 5 + 32);
};

const raindrops = (p: number) => {
  const rain: JSX.Element[] = [];
  let amount = Math.floor((p / 100) * 10);
  amount += amount % 2;
  for (let i = 0; i < amount; i++) {
    rain.push(<div key={i} id={`rain-${i + 1}`}></div>);
  }
  return <>{...rain}</>;
};

export default function Widget() {
  const db = getFirestore(app);
  const docId = "lXhwQ46vS1HXZlGTLjlB";

  const [unit, setUnit] = useState<TempUnit>("celsius");
  const [weather, setWeather] = useState<Weather>({
    temperature: {
      celsius: 0,
      fahrenheit: 0,
    },
    precipitation: 0,
    humidity: 0,
    wind: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "weather", docId), (doc) => {
      const data = doc.data();
      setWeather({
        temperature: {
          celsius: data?.temperature,
          fahrenheit: celsiusToFahrenheit(data?.temperature),
        },
        precipitation: data?.precipitation,
        humidity: data?.humidity,
        wind: data?.wind,
      });
    });
    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sky}>
          <div className={styles.cluster}>
            <div className={styles.sun}></div>
            <div className={styles.cloud}>
              <div className={styles.raindrops}>
                {raindrops(weather.precipitation)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.temperature}>
          <div className={styles.tempNumber}>
            {unit === "celsius" ? (
              <span>{weather.temperature.celsius}</span>
            ) : (
              <span>{weather.temperature.fahrenheit}</span>
            )}
            <div className={styles.switch}>
              <button
                className={`${styles.button} ${
                  unit === "celsius" ? styles.active : ""
                }`}
                onClick={() => {
                  setUnit("celsius");
                }}
              >
                °C
              </button>
              <button
                className={`${styles.button} ${
                  unit === "fahrenheit" ? styles.active : ""
                }`}
                onClick={() => {
                  setUnit("fahrenheit");
                }}
              >
                °F
              </button>
            </div>
          </div>
        </div>
        <div className={styles.status}>
          <table>
            <tbody>
              <tr>
                <td>Precipitation</td>
                <td>{weather.precipitation}%</td>
              </tr>
              <tr>
                <td>Humidity</td>
                <td>{weather.humidity}%</td>
              </tr>
              <tr>
                <td>Wind</td>
                <td>{weather.wind} Km/h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
