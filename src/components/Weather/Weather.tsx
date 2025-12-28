import {useContext, useEffect, useRef} from 'react';
import './Weather.scss';
import { store } from '../../App';
import Queryboard from '../Queryboard/Queryboard';
import Weatherboard from '../Weatherboard/Weatherboard';
import Draggable from 'react-draggable';

const Weather = () => {
  const [ state ] = useContext(store);
  const nodeRef = useRef(null);

  useEffect(() => {
    const weatherWindow = document.getElementById("weather-window");
    if (state.float.weatherBoard && weatherWindow) {
      weatherWindow.style.zIndex = "8";
      
    }else{
      if(weatherWindow)
      weatherWindow.style.zIndex = "3";

    }
  }, [state.float.weatherBoard]);

  return (
    <Draggable
      handle='#handle'
      nodeRef={nodeRef}
      enableUserSelectHack={false}
      onStart={(e: any) => {
        if (e.target.id !== "handle") {
          return false;
        }
      }}
    >

      <div ref={nodeRef} className={`window weather-window
          ${state.weatherWindow.weatherOpen ? 'openWeather' : ''}
          ${state.weatherWindow.weatherClose ? 'closedWeather' : ''}
          ${state.weatherWindow.weatherMinimize ? 'minimizedWeather' : ''}
          ${state.weatherWindow.weatherStretch ? 'stretchedWeather' : ''}
        `}
        id='weather-window'
        >
        <Queryboard  />
        <Weatherboard />
      </div>
     </Draggable>
  )
}

export default Weather