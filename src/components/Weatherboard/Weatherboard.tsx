import { useState, useEffect, useContext } from 'react';
import './Weatherboard.scss';
import { store } from '../../App';
import sampleWeatherData from '../../utils/keys/sampleWeatherData';
import WeatherTopLeft from '../WeatherTopLeft/WeatherTopLeft';
import WeatherTopRight from '../WeatherTopRight/WeatherTopRight';
import WeatherBottom from '../WeatherBottom/WeatherBottom';
import weather from '../../types/weather';
import backgroundImage from '../../assets/44.jpg';



const weatherApiKey = import.meta.env.VITE_API_KEY;


const Weatherboard = () => {
  const [weatherData, setWeatherData] = useState<weather>(sampleWeatherData);
  const [state, _dispatch] = useContext(store);

  const fetchWeatherData = async (city: string) => {
    try {
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&exclude=current,minutely,hourly,alerts&appid=${weatherApiKey}&units=metric`);
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${weatherApiKey}`);
      // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?q=${city}&lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${weatherApiKey}&units=metric}`);
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}}&units=metric`);

      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);

      if (!response.ok) {
        // setErrorSearch(true);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setWeatherData(data);
      // setErrorSearch(false);

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchWeatherData(state.city);
    // fetchWeatherData('Delhi');
    // console.log(weatherData);
    // fetchWeatherData('New York');
  }, [state.city])
  useEffect(() => {
    const weatherApp = document.getElementById("weather-app");
    if (state.weatherWindow.weatherStretch && weatherApp) {
      weatherApp.style.height = "calc(100vw - 29px - 2.5em)";
    } else {
      if (weatherApp)
        weatherApp.style.height = "calc(40vw - 2.5em)";

    }
  }, [state.weatherWindow.weatherStretch]);

  useEffect(() => {
    const element = document.getElementById('weather-app') as HTMLDivElement;
    element.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(${backgroundImage})`;
  }, []);


  return (
    <div className='weather-app' id="weather-app">
      <div className='top'>
        <div
          className="left"
        >
          <WeatherTopLeft
            weatherData={weatherData}
          />
        </div>
        <div className='right'>
          <WeatherTopRight
            weatherData={weatherData}
          />
        </div>
      </div>
      <div className='bottom'>
        {/* {console.log(updatedCity)} */}
        {/* {console.log(weatherData)} */}
        <WeatherBottom />
      </div>
    </div>
  )

}
export default Weatherboard