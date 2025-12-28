import React, { useContext } from 'react';
import './SettingsDropdown.scss';
import { store } from '../../App';
import { MdWifiTethering, MdAnimation } from "react-icons/md";
import updateSysColor from '../../utils/helpers/updateSysColor';
import { AiOutlineCheckCircle } from "react-icons/ai";

const SettingsDropdown = () => {
  const [state, dispatch] = useContext(store);

  const openWallpaper = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'wallpaper/OPEN' });

  };

  const changeColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    dispatch({type :"color/CHANGE", payload: target.id});
    updateSysColor(target.id);
  }

  return (
    <div
      className="settings-dropdown set"
    >
      <section className='functions set'>
        <div className='func set'>
          <button
            className='airdrop-btn set'
            type='button'
          >
            <MdWifiTethering
              fill="white"
              style={{ transition: "0.25 all" }}
            />
          </button>
          Airdrop
        </div>

        <div className='func set'>
          <button
            className='set'
            type='button'
          >
            <MdAnimation
              fill="white"
              style={{ transition: "0.25 all" }}
            />
          </button>
          Animations
        </div>
      </section>

      <section className='sys-colors set'>
        System Color
        <div className='colors set'>
          <button
            className='color orangey set'
            id='orangey'
            onClick={changeColor}
          >
            {state.currentColor === 'orangey' ? <AiOutlineCheckCircle color={"#333333"} /> : null  }
          </button>
          <button
            className='color greeny set'
            id='greeny'
            onClick={changeColor}
          >
            {state.currentColor === 'greeny' ? <AiOutlineCheckCircle  color={"#333333"}/> : null   }
          </button>
          <button
            className='color bluey set'
            id='bluey'
            onClick={changeColor}
          >
            { state.currentColor === 'bluey' ? <AiOutlineCheckCircle color={"#333333"} /> : null }
          </button>
          <button
            className='color pinky set'
            id='pinky'
            onClick={changeColor}
          >
            { state.currentColor === 'pinky' ? <AiOutlineCheckCircle color={"#333333"} /> : null }
          </button>
          <button
            className='color whitey set'
            id='whitey'
            onClick={changeColor}
          >
            { state.currentColor === 'whitey' ? <AiOutlineCheckCircle color={"#333333"} /> : null }
          </button>
          <button
            className='color greyy set'
            id='greyy'
            onClick={changeColor}
          >
            { state.currentColor === 'greyy' ? <AiOutlineCheckCircle /> : null }
          </button>
          <button
            className='color yellowy set'
            id='yellowy'
            onClick={changeColor}
          >
            { state.currentColor === 'yellowy' ? <AiOutlineCheckCircle color={"#333333"} /> : null }
          </button>
        </div>
      </section>

      <section
        className='wallpaper-container'
        id='opener'
        onClick={openWallpaper}
      >
        <img className='preview' src={`${state.settings.wallpaper.name}`} alt="wallpaper" />
        <div className='desc-container'>
          <h2 className='title'>
            Wallpaper
          </h2>
          <h3 className='type'>Dynamic Wallpaper</h3>
        </div>
      </section>
    </div>
  )
}

export default SettingsDropdown