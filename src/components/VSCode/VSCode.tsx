import React, { useContext } from 'react';
import './VSCode.scss';
import { store } from '../../App';
import { GrFormClose, GrFormSubtract } from "react-icons/gr";
import { CgExpand } from "react-icons/cg";
import Draggable from 'react-draggable';

const VSCode = () => {

    const [state, dispatch] = useContext(store);

    const closeWindow = (e : React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        dispatch({
            type: "vscode/CLOSE",
        });
    };

    return (
        <Draggable handle="#vscode-handle">
            <div className={`vscode-menu ${state.vscodeWindow.vscodeClose ? 'closed': ""}`} id='vscode-menu'>
                <section className='handle' id='vscode-handle'>
                    <div className='dots'>
                        <div className='dot red' onClick={closeWindow}>
                            <GrFormClose className='close' />
                        </div>

                        <div className='dot yellow' >
                            <GrFormSubtract className='minimize' />
                        </div>

                        <div className='dot green' >
                            <CgExpand className='stretch' />
                        </div>
                    </div>
                    <h1>
                        VS Code
                    </h1>
                </section>
                <section className="vscode-container">
                    <div>
                        <iframe
                            src='https://stackblitz.com/angular/pxxjqeeegeba?devToolsHeight=33&embed=1&file=src/index.html&hideNavigation=1&theme=dark'
                            title="VS Code for macOS Web"
                        />
                    </div>
                </section>
            </div>
        </Draggable>
    )
}

export default VSCode