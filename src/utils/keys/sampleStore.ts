import storeType from "../../types/store";
import img from '../../assets/wallpapers/46.jpg';

const sampleStore: storeType = {
    weather: {
        current: null,
        forecast: null,
    },
    query: null,
    loading: false,
    section: null,
    dockItem: undefined,
    date: ['Mon Apr 23', '11:00 AM'],
    selected: undefined,
    failed: false,
    booting: false,
    onTop: null,
    soundPlayed: false,
    settings: {
        open: false,
        animation: false,
        color: null,
        notch: false,
        airdrop: false,
        wallpaper: {
            open: true,
            src: null,
            preview: null,
            name: img,
            surname: null,
        },
    },
    wallpaperWindow: {
        wallpaperClose: true,
        wallpaperOpen: false,
        wallpaperMinimize: false,
        wallpaperStretch: false,
    },
    vscodeWindow: {
        vscodeClose: false,
        vscodeOpen: true,
        vscodeMinimize: false,
    },
    weatherWindow: {

        weatherClose: true,
        weatherOpen: false,
        weatherMinimize: false,
        weatherStretch: false,
    },
    float: {
        weatherBoard: false,
        wallpaperBoard: false,
    },
    finderCloseOpen: false,
    launchpadOpen: false,
    // App windows initial state
    qonunlarWindow: { closed: true },
    qoidalarWindow: { closed: true },
    videoWindow: { closed: true },
    slaydlarWindow: { closed: true },
    temiryolWindow: { closed: true },
    bannerlarWindow: { closed: true },
    kasbWindow: { closed: true },
    dashboardWindow: { closed: true },
    globaldashWindow: { closed: true },
    korxonalarWindow: { closed: true },
    kpiWindow: { closed: true },
    adminWindow: { closed: true },
    profilWindow: { closed: true },
    safetyproWindow: { closed: true },
    city: "Toshkent",
    currentColor: "lightblue",

}

export default sampleStore;