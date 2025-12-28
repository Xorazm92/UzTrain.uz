import './WeatherTopLeft.scss';

// import { ReactComponent as Cloud } from '../../assets/SVG/cloud.svg';
// import { ReactComponent as CloudDay } from '../../assets/SVG/cloudy-day.svg';
// import { ReactComponent as CloudNight } from '../../assets/SVG/cloudy-night.svg';
// import { ReactComponent as Lightning } from '../../assets/SVG/lightning.svg';
// import { ReactComponent as Mist } from '../../assets/SVG/mist.svg';
// import { ReactComponent as Moon } from '../../assets/SVG/moon.svg';
// import { ReactComponent as Rainy } from '../../assets/SVG/rainy.svg';
// import { ReactComponent as Snow } from '../../assets/SVG/snow.svg';
// import { ReactComponent as Sun } from '../../assets/SVG/sun.svg';
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


const WeatherTopLeft = ({ weatherData } :any) => {
  const { name, main, weather } = weatherData;
  const { temp } = main;

  const icons = {
    '01d': <Sun size={50} />,
    '01n': <Moon size={50} />,
    '02d': <CloudDay size={50} />,
    '02n': <CloudNight size={50} />,
    '03d': <Cloud size={50}  />,
    '03n': <Cloud size={50} />,
    '04d': <Cloud size={50} />,
    '04n': <Cloud size={50} />,
    '09d': <Rainy size={50} />,
    '09n': <Rainy size={50} />,
    '10d': <Rainy size={50} />,
    '10n': <Rainy size={50} />,
    '11d': <Lightning size={50} />,
    '11n': <Lightning size={50} />,
    '13d': <Snow size={50} />,
    '13n': <Snow size={50} />,
    '50d': <Mist size={50} />,
    '50n': <Mist size={50} />,
  };

  // const icons = {
  //   '01d': <Sun size={50} />,
  //   '01n': <Moon />,
  //   '02d': <CloudDay />,
  //   '02n': <CloudNight />,
  //   '03d': <Cloud />,
  //   '03n': <Cloud />,
  //   '04d': <Cloud />,
  //   '04n': <Cloud />,
  //   '09d': <Rainy />,
  //   '09n': <Rainy />,
  //   '10d': <Rainy />,
  //   '10n': <Rainy />,
  //   '11d': <Lightning />,
  //   '11n': <Lightning />,
  //   '13d': <Snow />,
  //   '13n': <Snow />,
  //   '50d': <Mist />,
  //   '50n': <Mist />,
  // };
  // const icons = {
  //   '01d': "Sun",
  //   '01n': "Moon",
  //   '02d': "CloudDay",
  //   '02n': "CloudNight",
  //   '03d': "Cloud",
  //   '03n': "Cloud",
  //   '04d': "Cloud",
  //   '04n': "Cloud",
  //   '09d': "Rainy",
  //   '09n': "Rainy",
  //   '10d': "Rainy",
  //   '10n': "Rainy",
  //   '11d': "Lightning",
  //   '11n': "Lightning",
  //   '13d': "Snow",
  //   '13n': "Snow",
  //   '50d': "Mist",
  //   '50n': "Mist",
  // };
  const str = weather[0].description;
  const updateStr = str
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className='weather-info'>
      {/* {console.log(weatherData)} */}
      <div className='weather-info__description'>{updateStr}</div>
      <div className='weather-info__city'>{name}</div>
      <div className='weather-info__date'>Saturday</div>
      <div className='weather-info__time'>5:41</div>
      <div className='weather-info__temperature'>{temp}</div>
      <div className='weather-info__units-f'>Display °C</div>
      <div className='weather-info__units-c'>Display C</div>

      {/* <IconContext.Provider value={{ size: '5rem', className: 'weather-info__icon' }}> */}
      {/* </IconContext.Provider> */}

      <div className='weather-info__icon'>
        {icons[weather[0].icon as keyof typeof icons]} 
      </div>
      {/* <form className='search-box' onSubmit={changeCity}>
          <input 
            placeholder='Search for a city ...'
            className='search-box__input'
            type="text" 
            value={newCity}
            onChange={changeCity1}
          />
          <div className='search'></div>
        </form> */}
      {/* {errorSearch && <div className="error-msg">
          Location Not Found <br />Search must be in the form of City
        </div>}   */}
    </div>
  )
}

export default WeatherTopLeft