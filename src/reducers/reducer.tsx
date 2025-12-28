// import { AnyAction } from "@reduxjs/toolkit";
import sampleStore from '../utils/keys/sampleStore';
import getDate from "../utils/helpers/getDate";
import storeType from "../types/store";
import { Reducer, AnyAction } from '@reduxjs/toolkit';



const reducer: Reducer<storeType, AnyAction> = (state = sampleStore, action) => {

    switch (action.type) {
        case "section/SELECT":
            // eslint-disable-next-line no-case-declarations
            console.log(action.payload);
            // eslint-disable-next-line no-case-declarations
            const updatedSection = {
                ...state,
                section: action.payload,
            };
            return updatedSection;

        case "section/RESET":
            // eslint-disable-next-line no-case-declarations
            // console.log(action.payload);
            // eslint-disable-next-line no-case-declarations
            const resetSection = {
                ...state,
                section: "none",
            };
            return resetSection;

        case "settings/CLOSE":
            // eslint-disable-next-line no-case-declarations
            const closedSettings = {
                ...state,
                settings: {
                    ...state.settings,
                    open: false,
                },
            };
            return closedSettings;
        case "settings/OPEN":
            // eslint-disable-next-line no-case-declarations
            const openedSettings = {
                ...state,
                settings: {
                    ...state.settings,
                    open: true,
                },
            };
            return openedSettings;

        case "date/SET":
            // eslint-disable-next-line no-case-declarations
            const date = getDate();
            // eslint-disable-next-line no-case-declarations
            const updateDate = {
                ...state,
                date: date,
            };
            return updateDate;

        case "wallpaper/CHANGE":

            // eslint-disable-next-line no-case-declarations
            const updateWallpaper = {
                ...state,
                settings: {
                    ...state.settings,
                    wallpaper: {
                        ...state.settings.wallpaper,
                        name: action.payload,
                    },
                },
            };
            return updateWallpaper;

        case "vscode/OPEN":
            // eslint-disable-next-line no-case-declarations
            const openVSCode = {
                ...state,
                vscodeWindow: {
                    vscodeClose: false,
                    vscodeOpen: false,
                    vscodeMinimize: false,
                },
            };

            return openVSCode;

        case "vscode/CLOSE":
            // eslint-disable-next-line no-case-declarations
            const closeVSCode = {
                ...state,
                vscodeWindow: {
                    vscodeClose: true,
                    vscodeOpen: false,
                    vscodeMinimize: false,
                },
            };
            return closeVSCode;

        case "weather/CLOSE":
            // eslint-disable-next-line no-case-declarations
            console.log("Close Weather");
            // eslint-disable-next-line no-case-declarations
            const closeWeather = {
                ...state,
                weatherWindow: {
                    weatherClose: true,
                    weatherOpen: false,
                    weatherMinimize: false,
                    weatherStretch: false,

                },
            };
            return closeWeather;

        case "weather/OPEN":
            // eslint-disable-next-line no-case-declarations
            console.log("Open Weather");
            // eslint-disable-next-line no-case-declarations
            const openWeather = {
                ...state,
                weatherWindow: {
                    weatherClose: false,
                    weatherOpen: true,
                    weatherMinimize: false,
                    weatherStretch: false,

                },
            };
            return openWeather;

        case "weather/MINI":
            // eslint-disable-next-line no-case-declarations
            console.log("Minimize Weather");
            // eslint-disable-next-line no-case-declarations
            const minimizeWeather = {
                ...state,
                weatherWindow: {
                    weatherClose: false,
                    weatherOpen: false,
                    weatherMinimize: true,
                    weatherStretch: false,

                },
            };
            return minimizeWeather;

        case "weather/STRETCH":
            // eslint-disable-next-line no-case-declarations
            console.log("Expand Weather");
            // eslint-disable-next-line no-case-declarations
            const stretchWeather = {
                ...state,
                weatherWindow: {
                    weatherClose: false,
                    weatherOpen: false,
                    weatherMinimize: false,
                    weatherStretch: true,
                },
            };
            return stretchWeather;

        case "wallpaper/CLOSE":
            // eslint-disable-next-line no-case-declarations
            const closeWallpaper = {
                ...state,
                wallpaperWindow: {
                    wallpaperClose: true,
                    wallpaperOpen: false,
                    wallpaperMinimize: false,
                    wallpaperStretch: false,
                },
            };
            return closeWallpaper;

        case "wallpaper/OPEN":
            // eslint-disable-next-line no-case-declarations
            const openWallpaper = {
                ...state,
                wallpaperWindow: {
                    wallpaperClose: false,
                    wallpaperOpen: true,
                    wallpaperMinimize: false,
                    wallpaperStretch: false,
                },
            };
            return openWallpaper;

        case "wallpaper/MINI":
            // eslint-disable-next-line no-case-declarations
            const minimizeWallpaper = {
                ...state,
                wallpaperWindow: {
                    wallpaperClose: false,
                    wallpaperOpen: false,
                    wallpaperMinimize: true,
                    wallpaperStretch: false,
                },
            };
            return minimizeWallpaper;

        case "wallpaper/STRETCH":
            // eslint-disable-next-line no-case-declarations
            const strecthWallpaper = {
                ...state,
                wallpaperWindow: {
                    wallpaperClose: false,
                    wallpaperOpen: false,
                    wallpaperMinimize: false,
                    wallpaperStretch: true,
                },
            };
            return strecthWallpaper;

        case "wallpaper/Z-SELECT":
            // eslint-disable-next-line no-case-declarations

            // eslint-disable-next-line no-case-declarations
            const wallpaperZSelect = {
                ...state,
                float: {
                    weatherBoard: false,
                    wallpaperBoard: true,
                },
            };
            return wallpaperZSelect;

        case "weather/Z-SELECT":
            // eslint-disable-next-line no-case-declarations

            // eslint-disable-next-line no-case-declarations
            const weatherZSelect = {
                ...state,
                float: {
                    weatherBoard: true,
                    wallpaperBoard: false,
                },
            };
            return weatherZSelect;

        case "finder/OPEN":

            // eslint-disable-next-line no-case-declarations
            const openFinder = {
                ...state,
                finderCloseOpen: !state.finderCloseOpen,
            };
            return openFinder;

        case "city/CHANGE":

            // eslint-disable-next-line no-case-declarations
            const changeCity = {
                ...state,
                city: action.payload,
            };
            return changeCity;

        case "color/CHANGE":

            // eslint-disable-next-line no-case-declarations
            const changeColor = {
                ...state,
                currentColor: action.payload,
            };
            return changeColor;

        // Launchpad actions
        case "launchpad/OPEN":
            return { ...state, launchpadOpen: true };
        case "launchpad/CLOSE":
            return { ...state, launchpadOpen: false };

        // App window actions - Qonunlar
        case "qonunlar/OPEN":
            return { ...state, qonunlarWindow: { closed: false, minimized: false, maximized: false } };
        case "qonunlar/CLOSE":
            return { ...state, qonunlarWindow: { closed: true, minimized: false, maximized: false } };
        case "qonunlar/MINI":
            return { ...state, qonunlarWindow: { ...state.qonunlarWindow, minimized: true } };

        // Qoidalar
        case "qoidalar/OPEN":
            return { ...state, qoidalarWindow: { closed: false, minimized: false, maximized: false } };
        case "qoidalar/CLOSE":
            return { ...state, qoidalarWindow: { closed: true, minimized: false, maximized: false } };
        case "qoidalar/MINI":
            return { ...state, qoidalarWindow: { ...state.qoidalarWindow, minimized: true } };

        // Video
        case "video/OPEN":
            return { ...state, videoWindow: { closed: false, minimized: false, maximized: false } };
        case "video/CLOSE":
            return { ...state, videoWindow: { closed: true, minimized: false, maximized: false } };
        case "video/MINI":
            return { ...state, videoWindow: { ...state.videoWindow, minimized: true } };

        // Slaydlar
        case "slaydlar/OPEN":
            return { ...state, slaydlarWindow: { closed: false, minimized: false, maximized: false } };
        case "slaydlar/CLOSE":
            return { ...state, slaydlarWindow: { closed: true, minimized: false, maximized: false } };
        case "slaydlar/MINI":
            return { ...state, slaydlarWindow: { ...state.slaydlarWindow, minimized: true } };

        // Temir Yol
        case "temiryol/OPEN":
            return { ...state, temiryolWindow: { closed: false, minimized: false, maximized: false } };
        case "temiryol/CLOSE":
            return { ...state, temiryolWindow: { closed: true, minimized: false, maximized: false } };
        case "temiryol/MINI":
            return { ...state, temiryolWindow: { ...state.temiryolWindow, minimized: true } };

        // Bannerlar
        case "bannerlar/OPEN":
            return { ...state, bannerlarWindow: { closed: false, minimized: false, maximized: false } };
        case "bannerlar/CLOSE":
            return { ...state, bannerlarWindow: { closed: true, minimized: false, maximized: false } };
        case "bannerlar/MINI":
            return { ...state, bannerlarWindow: { ...state.bannerlarWindow, minimized: true } };

        // Kasb
        case "kasb/OPEN":
            return { ...state, kasbWindow: { closed: false, minimized: false, maximized: false } };
        case "kasb/CLOSE":
            return { ...state, kasbWindow: { closed: true, minimized: false, maximized: false } };
        case "kasb/MINI":
            return { ...state, kasbWindow: { ...state.kasbWindow, minimized: true } };

        // Dashboard
        case "dashboard/OPEN":
            return { ...state, dashboardWindow: { closed: false, minimized: false, maximized: false } };
        case "dashboard/CLOSE":
            return { ...state, dashboardWindow: { closed: true, minimized: false, maximized: false } };
        case "dashboard/MINI":
            return { ...state, dashboardWindow: { ...state.dashboardWindow, minimized: true } };

        // Global Dashboard
        case "globaldash/OPEN":
            return { ...state, globaldashWindow: { closed: false, minimized: false, maximized: false } };
        case "globaldash/CLOSE":
            return { ...state, globaldashWindow: { closed: true, minimized: false, maximized: false } };
        case "globaldash/MINI":
            return { ...state, globaldashWindow: { ...state.globaldashWindow, minimized: true } };

        // Korxonalar
        case "korxonalar/OPEN":
            return { ...state, korxonalarWindow: { closed: false, minimized: false, maximized: false } };
        case "korxonalar/CLOSE":
            return { ...state, korxonalarWindow: { closed: true, minimized: false, maximized: false } };
        case "korxonalar/MINI":
            return { ...state, korxonalarWindow: { ...state.korxonalarWindow, minimized: true } };

        // KPI
        case "kpi/OPEN":
            return { ...state, kpiWindow: { closed: false, minimized: false, maximized: false } };
        case "kpi/CLOSE":
            return { ...state, kpiWindow: { closed: true, minimized: false, maximized: false } };
        case "kpi/MINI":
            return { ...state, kpiWindow: { ...state.kpiWindow, minimized: true } };

        // Admin
        case "admin/OPEN":
            return { ...state, adminWindow: { closed: false, minimized: false, maximized: false } };
        case "admin/CLOSE":
            return { ...state, adminWindow: { closed: true, minimized: false, maximized: false } };
        case "admin/MINI":
            return { ...state, adminWindow: { ...state.adminWindow, minimized: true } };

        // Profil
        case "profil/OPEN":
            return { ...state, profilWindow: { closed: false, minimized: false, maximized: false } };
        case "profil/CLOSE":
            return { ...state, profilWindow: { closed: true, minimized: false, maximized: false } };
        case "profil/MINI":
            return { ...state, profilWindow: { ...state.profilWindow, minimized: true } };

        default:
            // Uncomment for debugging unknown actions
            // console.log("Unknown action type:", action.type);
            return state;

    }
}

export default reducer;