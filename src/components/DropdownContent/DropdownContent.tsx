import { useContext} from 'react';
import { store } from '../../App';
import getDropdownItems from '../../utils/helpers/getDropdownContent';
import './DropdownContent.scss';

const DropdownContent = () => {
    const [ state, dispatch ] = useContext(store);
    const content = getDropdownItems(state);
  return (
    <div
        className={` dd dropdown-menu ${
            state.section === "logo"
            ? "dd-logo"
            : state.section === "finder"
            ? "dd-finder"
            : state.section === "file"
            ? "dd-file"
            : state.section === "edit"
            ? "dd-edit"
            : state.section === "help"
            ? "dd-help"
            : state.section === "view"
            ? "dd-view"
            : state.section === "window"
            ? "dd-window"
            : state.section === "go"
            ? "dd-go"
            : ""
        }`}
    >
        {content.map((item) => {
            if(item.name === "divider") return <div  className='divider dd hover-disabled'/>;

            return (
                <div
                    className={`dropdown-item dd ${
                        state.section === item.name
                        ? "dd-active"
                        : ""}
                        ${item.available ? "hover-active" : "hover-disabled"}
                    `}

                    style={{ color: item.available ? "white" : "rgba(255,255,255,0.5)" } }
                    onClick={(e) => {
                        dispatch({
                            type: "section/CHECK",
                            payload: e.target,
                        });
                    }}
                >
                    {item.name}
                </div>
            );
        })}
    </div>
  );
}

export default DropdownContent