import React from 'react';
import './WindowNav.scss';
import { GrFormClose, GrFormSubtract } from "react-icons/gr";
import { CgExpand } from "react-icons/cg";

const WindowNav = ({ handleName, name, setIsClose } :any) => {
    // console.log(handleName);
    const closeWindow = (e : React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        setIsClose((prev :any) => !prev);
    }
    return (
        <section className='handle1' id={`${handleName}`}>
            <div className='dots-ver2'>
                <div className='dot-ver2 red1' onClick={closeWindow}>
                    <GrFormClose className='close1' />
                </div>

                <div className='dot-ver2 yellow1' >
                    <GrFormSubtract className='minimize1' />
                </div>

                <div className='dot-ver2 green1' >
                    <CgExpand className='stretch1' />
                </div>
            </div>
            <div className='windowNav-header'>
            <h1>
                {name}
            </h1>
            </div>
        </section>
    )
}

export default WindowNav