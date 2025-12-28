import React,{ useContext} from 'react';
import { store } from '../../App';
import './QueryBoardlinks.scss';

import { GrFormClose, GrFormSubtract } from "react-icons/gr";
import { CgExpand } from "react-icons/cg";
import { FiGithub } from  "react-icons/fi";
// import { IconContext } from "react-icons";
// import { FaGithubSquare } from "react-icons/fa";

const QueryBoardLinks = () => {

  const [ _state,dispatch ] = useContext(store);

  const closeWindow = (e : React.MouseEvent<HTMLElement>) => {
        
    e.stopPropagation();
    console.log("button clicked!! Weather");
    dispatch({
        type: "weather/CLOSE",
    });
};

const minimizeWindow = (e : React.MouseEvent<HTMLElement>) => {
    
    e.stopPropagation();
    console.log("button clicked!! Weather");
    dispatch({
        type: "weather/MINI",
    });
};

const stretchWindow = (e : React.MouseEvent<HTMLElement>) => {
    
    e.stopPropagation();
    console.log("button clicked!! Weather");
    dispatch({
        type: "weather/STRETCH",
    });
   
};

  return (
    <div className='links'>
      <div className='dots'>
        <div className='dot red' id='dot1w' onClick ={closeWindow}>
          < GrFormClose className="close" />
        </div>
        <div className='dot yellow' id='dot2w' onClick ={minimizeWindow}>
          <GrFormSubtract className="minimize" />
        </div>
        <div className='dot green' id='dot3w' onClick ={stretchWindow}>
          <CgExpand className="stretch" />
        </div>
      </div>

      <button className='nav github-btn'>
        <FiGithub size={20} className="github svg" id="svg" />
      </button>
    </div>
  )
}

export default QueryBoardLinks