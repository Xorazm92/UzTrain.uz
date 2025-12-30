import React, { useContext } from 'react';
import { store } from '../../App';
import './Dock.scss';
import { finder, photos, weather } from '../../resources';
import AppIcons from './ProfessionalIcons';

const appIcons = AppIcons;

const Dock = () => {
    const [state, dispatch] = useContext(store);

    const openWallpaper = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'wallpaper/OPEN' });
    };

    const openWeather = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'weather/OPEN' });
    };

    const openFinder = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'finder/OPEN' });
    };

    const openLaunchpad = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'launchpad/OPEN' });
    };

    const openApp = (appId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: `${appId}/OPEN` });
    };

    return (
        <>
            <div className="dock">
                {/* Finder */}
                <div className="dock-item" onClick={openFinder}>
                    <div className='tool-tip'>Finder</div>
                    <img src={finder} alt="Finder" className='dock-icon' />
                    <div className='point' />
                </div>

                <div className='divison' />

                {/* Launchpad */}
                <div className="dock-item" onClick={openLaunchpad}>
                    <div className='tool-tip'>Launchpad</div>
                    <img src={appIcons.launchpad} alt="Launchpad" className='dock-icon dock-icon--image launchpad' />
                </div>

                {/* Dashboard */}
                <div className="dock-item" onClick={openApp('dashboard')}>
                    <div className='tool-tip'>Dashboard</div>
                    <img src={appIcons.dashboard} alt="Dashboard" className='dock-icon dock-icon--image dashboard' />
                    {!state.dashboardWindow?.closed && <div className='point' />}
                </div>

                {/* Global Dashboard */}
                <div className="dock-item" onClick={openApp('globaldash')}>
                    <div className='tool-tip'>Global Dashboard</div>
                    <img src={appIcons.globaldash} alt="Global Dashboard" className='dock-icon dock-icon--image globaldash' />
                    {!state.globaldashWindow?.closed && <div className='point' />}
                </div>

                {/* KPI */}
                <div className="dock-item" onClick={openApp('kpi')}>
                    <div className='tool-tip'>KPI Boshqaruv</div>
                    <img src={appIcons.kpi} alt="KPI" className='dock-icon dock-icon--image kpi' />
                    {!state.kpiWindow?.closed && <div className='point' />}
                </div>

                {/* Qonunlar */}
                {/* Normativ Hujjatlar */}
                <div className="dock-item" onClick={openApp('qoidalar')}>
                    <div className='tool-tip'>Normativ Hujjatlar</div>
                    <img src={appIcons.qoidalar} alt="Normativ Hujjatlar" className='dock-icon dock-icon--image qoidalar' />
                    {!state.qoidalarWindow?.closed && <div className='point' />}
                </div>

                {/* Temir Yo'l */}
                <div className="dock-item" onClick={openApp('temiryol')}>
                    <div className='tool-tip'>Temir Yo'l</div>
                    <img src={appIcons.temiryol} alt="Temir Yo'l" className='dock-icon dock-icon--image temiryol' />
                    {!state.temiryolWindow?.closed && <div className='point' />}
                </div>

                {/* Video Materials */}
                <div className="dock-item" onClick={openApp('video')}>
                    <div className='tool-tip'>Video Materiallar</div>
                    <img src={appIcons.video} alt="Video" className='dock-icon dock-icon--image video' />
                    {!state.videoWindow?.closed && <div className='point' />}
                </div>

                {/* Korxonalar */}
                <div className="dock-item" onClick={openApp('korxonalar')}>
                    <div className='tool-tip'>Korxonalar</div>
                    <img src={appIcons.korxonalar} alt="Korxonalar" className='dock-icon dock-icon--image korxonalar' />
                    {!state.korxonalarWindow?.closed && <div className='point' />}
                </div>

                {/* Kasb Yo'riqnomalari */}
                <div className="dock-item" onClick={openApp('kasb')}>
                    <div className='tool-tip'>Kasb Yo'riqnomalari</div>
                    <img src={appIcons.kasb} alt="Kasb Yo'riqnomalari" className='dock-icon dock-icon--image kasb' />
                    {!state.kasbWindow?.closed && <div className='point' />}
                </div>

                <div className='divison' />

                {/* Photos/Wallpaper */}
                <div className="dock-item" onClick={openWallpaper}>
                    <div className='tool-tip'>Photos</div>
                    <img src={photos} alt="Photos" className='dock-icon' />
                </div>

                {/* Weather */}
                <div className="dock-item" onClick={openWeather}>
                    <div className='tool-tip'>Weather</div>
                    <img src={weather} alt="Weather" className='dock-icon' />
                    {state.weatherWindow?.weatherOpen && <div className='point' />}
                </div>

                <div className='divison' />

                {/* Admin */}
                <div className="dock-item" onClick={openApp('admin')}>
                    <div className='tool-tip'>Admin</div>
                    <img src={appIcons.admin} alt="Admin" className='dock-icon dock-icon--image admin' />
                    {!state.adminWindow?.closed && <div className='point' />}
                </div>

                {/* Profile */}
                <div className="dock-item" onClick={openApp('profil')}>
                    <div className='tool-tip'>Profil</div>
                    <img src={appIcons.profil} alt="Profil" className='dock-icon dock-icon--image profil' />
                    {!state.profilWindow?.closed && <div className='point' />}
                </div>
            </div>
        </>
    );
};

export default Dock;