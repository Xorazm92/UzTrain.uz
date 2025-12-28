import React, { useContext, useState, useEffect} from 'react';
import { store } from '../../App';
import "./Page.scss";
import openContextMenu from '../../utils/helpers/openContextMenu';
import checkDropdown from '../../utils/helpers/checkDropdown';
import checkSettings from '../../utils/helpers/checkSettings';
// import BootingLoader from '../Booting/Loader/BootingLoader';
// import img from '../../assets/44.jpg';


const Page = ({children} : any) => {

  const [ state , dispatch ] = useContext(store);

  const handleLeftClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("button clicked!! Page");

    const contextMenu =  document.getElementById('context-menu');
    contextMenu!.style.opacity = '0';

    const isSettings = checkSettings(e);
    if(!isSettings){
      dispatch({
        type: "settings/CLOSE",
      });
    }

    const isDropdown = checkDropdown(e);

    if(!isDropdown){
      dispatch({
        type: "section/RESET",
      });
    }

  };
  
  const [backgroundImage, setBackgroundImage] = useState(state.settings.wallpaper.name);

  useEffect(() => {
    setBackgroundImage(state.settings.wallpaper.name);
  }, [state.settings.wallpaper.name]);
  // const lake  = "lake";
  // document.documentElement.style.setProperty('--bg-image', `url("${state.settings.wallpaper.name}")`);
   
  
  return (
    <div
    className='page'
    id='page'
    onContextMenu={openContextMenu}
    onClick={handleLeftClick}
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* {console.log(children)} */}
      {/* {console.log(state.settings.wallpaper.name)} */}
      {/* <BootingLoader /> */}
      {children}
    </div>
  )
}

export default Page