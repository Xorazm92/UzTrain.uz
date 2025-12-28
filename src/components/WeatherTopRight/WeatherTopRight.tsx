import './WeatherTopRight.scss'
// import { ReactComponent as Cloud } from '../../assets/SVG/cloud.svg';
// import { ReactComponent as Humidity } from '../../assets/SVG/humidity.svg';
// import { ReactComponent as Rainy } from '../../assets/SVG/rainy.svg';
// import { ReactComponent as Thermo } from '../../assets/SVG/thermo.svg';
// import { ReactComponent as Wind } from '../../assets/SVG/wind.svg';
import { BsCloudDrizzle as Rainy } from "react-icons/bs"
import { BsThermometerSun as Thermo } from "react-icons/bs"
import { FiWind as Wind } from "react-icons/fi";
import { WiHumidity as Humidity } from "react-icons/wi";
import { IconContext } from "react-icons";
// import weather from '../../types/weather';


const WeatherTopRight = ({ weatherData } :any) => {
    const { main, wind } = weatherData;
    const { feels_like, humidity } = main;
    return (
        <div>
            <div className='weather-details-container'>
                <div className='weather-details'>
                    <IconContext.Provider value={{ className: 'weather-details__icon' }}>
                        <Thermo size={35} />
                    </IconContext.Provider>

                    <div className='weather-details__info'>
                        <div className='weather-details__label'>Feels Like</div>
                        <div className='weather-details__data' id='thermo'>{feels_like}°C</div>
                    </div>
                </div>
                <div className='weather-details'>
                    <IconContext.Provider value={{ className: 'weather-details__icon' }}>
                        <Humidity size={40} />
                    </IconContext.Provider>

                    <div className='weather-details__info'>
                        <div className='weather-details__label'>Humidity</div>
                        <div className='weather-details__data' id='humidity'>{humidity}%</div>
                    </div>
                </div>

                <div className='weather-details'>
                    <IconContext.Provider value={{ className: 'weather-details__icon' }}>
                        <Rainy size={35} />
                    </IconContext.Provider>

                    <div className='weather-details__info'>
                        <div className='weather-details__label'>Chance of Rain</div>
                        <div className='weather-details__data' id='rain'></div>
                    </div>
                </div>

                <div className='weather-details'>
                    <IconContext.Provider value={{ className: 'weather-details__icon' }}>
                        <Wind size={35} />
                    </IconContext.Provider>

                    <div className='weather-details__info'>
                        <div className='weather-details__label'>Wind Speed</div>
                        <div className='weather-details__data' id='wind'>{wind.speed} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherTopRight