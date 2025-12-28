import React, { useContext, useEffect, useRef } from 'react';
import './WallpaperMenu.scss';
import { store } from '../../App';
import { GrFormClose, GrFormSubtract } from "react-icons/gr";
import { CgExpand } from "react-icons/cg";
import Draggable from 'react-draggable';
import {
    catalina, preview_catalina,
    ventura, preview_ventura,
    dome, preview_dome,
    lake, preview_lake,
    bigsur, preview_bigsur,
    bigsurgraphic, preview_bigsurgraphic,
    iridescence, preview_iridescence,
    mojave, preview_mojave,
    monterey, preview_monterey,
    solargrad, preview_solargrad,
    peak, preview_peak,
    thedesert, preview_thedesert,
} from '../../resources';

import {
    age_of_titans,
    asgardian_sunrise,
    asura_lok,
    black_bird_in_a_city,
    blade_runner_2149,
    blood_diamonds,
    cabin_in_the_woods,
    childhood_innocence,
    cozy_night_with_cat,
    dune,
    fox_in_somber_forest,
    how_do_we_get_down,
    krypt_demise,
    lone_dune_wolf,
    my_neighbour_totoro,
    naha_sunset,
    somber_forest,
    sunrise_of_dreams,
    vibrant_night,
    tron

} from '../../assets'

const WallpaperMenu = () => {
    const [state, dispatch] = useContext(store);
    const nodeRef = useRef(null);

    // const [isClose, setIsClose] = useState(false);
    // const [isChange, setIsChange] = useState(false);

    const wallPaper2 = [
        [krypt_demise, "Kryptonian Demise"],
        [naha_sunset, "Naha Sunset"],
        [somber_forest, "Somber Forest"],
        [blade_runner_2149, "Blade Runner 2149"],
        [lone_dune_wolf, "Lone Dune Wolf"],
        [childhood_innocence, "Childhood Innocence"],
        [fox_in_somber_forest, "Fox in Somber Forest"],
        [blood_diamonds, "Blood Diamonds"],
        [black_bird_in_a_city, "Black Bird in a City"],
        [sunrise_of_dreams, "Sunrise of Dreams"],
        [how_do_we_get_down, "How do we get down?"],
        [cozy_night_with_cat, "Cozy Night with Cat"],
        [age_of_titans, "Age of Titans"],
        [dune, "Dune"],
        [vibrant_night, "Vibrant Night"],
        [cabin_in_the_woods, "Cabin in the Woods"],
        [asgardian_sunrise, "Asgardian Sunrise"],
        [asura_lok, "Asura Lok"],
        [my_neighbour_totoro, "My Neighbour Totoro"],
        [tron, "Tron"]
    ];

    const wallPaper = [
        [bigsur, preview_bigsur, "Bigsur"],
        [bigsurgraphic, preview_bigsurgraphic, "Bigsurgraphic"],
        [catalina, preview_catalina, "Catalina"],
        [dome, preview_dome, "Dome"],
        [iridescence, preview_iridescence, "Iridescence"],
        [lake, preview_lake, "Lake"],
        [mojave, preview_mojave, "Mojave"],
        [monterey, preview_monterey, "Monterey"],
        [solargrad, preview_solargrad, "Solargrad"],
        [peak, preview_peak, "Peak"],
        [thedesert, preview_thedesert, "The Desert"],
        [ventura, preview_ventura, "Ventura"]
    ];
    // const preview_wallPaper = [preview_bigsur,preview_bigsurgraphic,preview_catalina,preview_dome,preview_lake,preview_iridescence,preview_mojave,preview_monterey,preview_peak,preview_solargrad,preview_thedesert,preview_ventura ];
    const changeWallper = (e: React.MouseEvent<HTMLElement>, wally: string[]) => {
        e.preventDefault();

        // console.log(e);
        console.log(wally[0]);
        // const element = document.getElementById('page') as HTMLDivElement;
        // element.style.backgroundImage = `url(${wally[0]}})`;

        dispatch({
            type: "wallpaper/CHANGE",
            payload: wally[0],
        });

    };

    const closeWindow = (e: React.MouseEvent<HTMLElement>) => {

        e.stopPropagation();
        console.log("button clicked!! Wallpaper");
        dispatch({
            type: "wallpaper/CLOSE",
        });
    };

    const minimizeWindow = (e: React.MouseEvent<HTMLElement>) => {

        e.stopPropagation();
        console.log("button clicked!! Wallpaper");
        dispatch({
            type: "wallpaper/MINI",
        });
    };

    const stretchWindow = (e: React.MouseEvent<HTMLElement>) => {

        e.stopPropagation();
        console.log("button clicked!! Wallpaper");
        dispatch({
            type: "wallpaper/STRETCH",
        });
    };

    const floatWindow = (e: React.MouseEvent<HTMLElement>) => {

        e.stopPropagation();
        console.log("button clicked!! Wallpaper");
        dispatch({
            type: "wallpaper/Z-SELECT",
        });
    };

    useEffect(() => {
        const wallpaperMenu = document.getElementById("wallpaper-menu");
        const dot1 = document.getElementById("dot1");
        const dot2 = document.getElementById("dot2");
        const dot3 = document.getElementById("dot3");
        const dots = [dot1, dot2, dot3];
        
        const dot1w = document.getElementById("dot1w");
        const dot2w = document.getElementById("dot2w");
        const dot3w = document.getElementById("dot3w");
        const dotsw = [dot1w, dot2w, dot3w];
        if (state.float.wallpaperBoard && wallpaperMenu) {
            wallpaperMenu.style.zIndex = "8";
            dots.forEach((dot) => dot!.classList.remove("notActive-mode"));
            dotsw.forEach((dot) => dot!.classList.add("notActive-mode"));

        } else {
            if (wallpaperMenu)
            wallpaperMenu.style.zIndex = "4";
            dots.forEach((dot) => dot!.classList.add("notActive-mode"));
            dotsw.forEach((dot) => dot!.classList.remove("notActive-mode"));

        }
    }, [state.float.wallpaperBoard, state.float.weatherBoard]);

    // useEffect(() => {
    //     const element = document.getElementById('page') as HTMLDivElement;
    //     element.style.backgroundImage = `url(${catalina})`;
    //   }, []);


    return (
        <Draggable handle="#wallpaper-handle" nodeRef={nodeRef}>

            <div ref={nodeRef}
                className={`wallpaper-menu wallp 
                        ${state.wallpaperWindow.wallpaperOpen ? 'openWallpaper' : ''}
                        ${state.wallpaperWindow.wallpaperClose ? 'closedWallpaper' : ''}
                        ${state.wallpaperWindow.wallpaperMinimize ? 'minimizedWallpaper' : ''}
                        ${state.wallpaperWindow.wallpaperStretch ? 'stretchedWallpaper' : ''}

                        `}
                id='wallpaper-menu'
                onClick={floatWindow}
            >
                <section className='handle' id='wallpaper-handle'>
                    <div className='dots1' >
                        <div className='dot red' id='dot1' onClick={closeWindow}>
                            <GrFormClose className='close' />
                        </div>

                        <div className='dot yellow' id='dot2' onClick={minimizeWindow}>
                            <GrFormSubtract className='minimize' />
                        </div>

                        <div className='dot green' id='dot3' onClick={stretchWindow}>
                            <CgExpand className='stretch' />
                        </div>
                    </div>
                    <div className='title-wallpaper'>
                        <h1>
                            Wallpaper
                        </h1>
                    </div>
                </section>

                <section className='selection'>
                    <div className='prev'>
                        <img
                            id='check'
                            src={state.settings.wallpaper.name}
                            alt="Current Wallpaper"
                            className='current'
                        />
                        <h1>Current Wallpaper</h1>
                        {/* <h2>Dynamic Wallpaper</h2>

                            <div className='check'>
                                <input type="checkbox" />
                                <h2>Change dark/light mode as wallpaper change</h2>
                            </div> */}
                    </div>

                    <div className='wallpaper-selector'>
                        <h1>Dynamic Wallpaper</h1>
                        <div className='grid'>
                            {wallPaper.map((wally, i) => {
                                return (
                                    <div key={`dynamic-${i}`} className='item-container'>
                                        <img
                                            src={wally[1]}
                                            alt="wallpaper"
                                            className='image-wrapper iw'
                                            onClick={(e) => changeWallper(e, wally)}
                                        />
                                        <h2>{wally[2]}</h2>
                                    </div>
                                );

                            })
                            }
                        </div>
                    </div>

                    <div className='wallpaper-selector-two'>
                        <h1>
                            Standalone Wallpaper
                        </h1>
                        <div className='grid'>
                            {wallPaper2.map((wally, i) => {

                                return (
                                    <div key={`standalone-${i}`} className='item-container'>
                                            <img
                                                src={wally[0]}
                                                alt="standalone wallpaper"
                                                className="image-wrapper iw"
                                                onClick={(e) => changeWallper(e, wally)}

                                            />
                                        <h2>{wally[1]}</h2>
                                    </div>

                                );

                            })}

                        </div>
                    </div>
                </section>
            </div>



        </Draggable>
    )
}

export default WallpaperMenu