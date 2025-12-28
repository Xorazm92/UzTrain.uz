
import { useState, useEffect, useContext } from 'react';

import { 
  BsArrowLeftCircle as ArrowLeft,
  BsArrowRightCircle as ArrowRight,
} from 'react-icons/bs';

import {
  BiSun as Sun,
  BiCloudLightning as Lightning
} from 'react-icons/bi';
import {
  BsCloud as Cloud,
  BsCloudSun as CloudDay,
  BsCloudMoon as CloudNight,
  BsMoon as Moon,
  BsCloudDrizzle as Rainy,
  BsCloudSnow as Snow,
} from 'react-icons/bs';
import { RiMoonFoggyLine as Mist } from "react-icons/ri";
import { store } from '../../App';


import './WeatherBottom.scss';
import sampleHourly from '../../utils/keys/sampleHourly';

const weatherApiKey = import.meta.env.VITE_API_KEY;

const WeatherBottom = () => {
  const [weatherData, setWeatherData] = useState(sampleHourly);
  const [counter, setCounter] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, _dispatch] = useContext(store);

  const fetchWeatherData = async (city: string) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&exclude=current,minutely,hourly,alerts&appid=${weatherApiKey}&units=metric`);
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${weatherApiKey}`);
      // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?q=${city}&lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${weatherApiKey}&units=metric}`);
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}}&units=metric`);
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setWeatherData(data);
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
  const icons = {
    '01d': <Sun size={30} />,
    '01n': <Moon size={30} />,
    '02d': <CloudDay size={30} />,
    '02n': <CloudNight size={30} />,
    '03d': <Cloud size={30} />,
    '03n': <Cloud size={30} />,
    '04d': <Cloud size={30} />,
    '04n': <Cloud size={30} />,
    '09d': <Rainy size={30} />,
    '09n': <Rainy size={30} />,
    '10d': <Rainy size={30} />,
    '10n': <Rainy size={30} />,
    '11d': <Lightning size={30} />,
    '11n': <Lightning size={30} />,
    '13d': <Snow size={30} />,
    '13n': <Snow size={30} />,
    '50d': <Mist size={30} />,
    '50n': <Mist size={30} />,
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  const currrentTime = (t: any) => {
    // const time = t;
    const dateString = t;
    const time = dateString.slice(11, 16);
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour;
    const time12 = `${hour12}:${minute} ${period}`;
    // console.log(time12); // Output: "9:00 PM"
    return time12;
  }

  const plusOne = () => {

    if (counter === 3) return;

    setCounter((prev) => (prev + 1));
    console.log(counter);

  }
  const minusOne = () => {

    if (counter === 1) return;

    setCounter((prev) => (prev - 1));
    console.log(counter);

  }
  const fore= [
    { start: 0, end: 5 },
    { start: 6, end: 11 },
    { start: 12, end: 17 },
  ];

  return (
    <div className='forecast'>
      <div className='change-forecast'>
        {/* <div className='daily-btn forecast-selected'>Daily</div> */}
        <div className='hourly-btn forecast-selected'>Hourly</div>
        <div className='change-hours'>
          <div className='change-hours__left' onClick={minusOne} >
            <ArrowLeft size={20} />
          </div>
          {/* {console.log(weatherData)} */}
          <div className={`dot dot1 ${counter === 1 && 'dot-selected'}`} data-dot="1"></div>
          <div className={`dot dot2 ${counter === 2 && 'dot-selected'}`} data-dot="2"></div>
          <div className={`dot dot3 ${counter === 3 && 'dot-selected'}`} data-dot="3"></div>

          <div className='change-hours__right' onClick={plusOne} >
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* <div className='forecast-daily-container'>
        {day.map((item, index) => (
          <div className='forecast-daily' key={index} id={`current-day-plus-${index + 1}`}>
            <div className='forecast-daily__day'>{item.day}</div>
            <div className='forecast-daily__temperature'>
              <div className='forecast-daily__temperature-high'>{item.tempHigh}°</div>
              <div className='forecast-daily__temperature-low'>{item.tempLow}°</div>
            </div>
            <div className='forecast-daily__icon'>
            {icons[item.icon]}
            </div>
          </div>
          
        ))}
    </div> */}
     
          <div className='forecast-hourly-container' key={counter}>
            {weatherData.list.length > 5 && weatherData.list.slice(fore[counter - 1].start, fore[counter - 1].end).map((item, index) => (
              <div className='forecast-hourly' key={index} id={`current-hour-plus-${index + 1}`}>
                <div className='forecast-hourly__time'>{currrentTime(item.dt_txt)}</div>
                <div className='forecast-hourly__temperature'>
                  <div className='forecast-hourly__temperature-high'>{item.main.temp_max}°C</div>
                </div>
                <div className='forecast-hourly__icon'>
                  {icons[item.weather[0].icon as keyof typeof icons]}
                </div>
              </div>
            ))}
          </div>
    </div >
  )
}

export default WeatherBottom