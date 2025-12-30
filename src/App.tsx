import { createContext, useReducer } from 'react';
import NavBar from './components/NavBar/NavBar';
import Page from './components/Page/Page';
import Dock from './components/Dock/Dock.tsx';
import WallpaperMenu from './components/WallpaperMenu/WallpaperMenu.tsx';
import Weather from './components/Weather/Weather.tsx';
import Launchpad from './components/Launchpad/Launchpad.tsx';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import reducer from './reducers/reducer';
import sampleStore from './utils/keys/sampleStore.ts';
import ContextMenu from './components/ContextMenu/ContextMenu.tsx';

// Import all apps
import {
  QoidalarApp,
  VideoApp,
  SlaydlarApp,
  TemirYolApp,
  BannerlarApp,
  KasbApp,
  DashboardApp,
  GlobalDashboardApp,
  KorxonalarApp,
  KpiApp,
  AdminApp,
  ProfilApp,
} from './components/Apps';

// eslint-disable-next-line react-refresh/only-export-components
export const store = createContext<any>(null);

const StoreProvider = ({ children }: any) => (
  <store.Provider value={useReducer(reducer, sampleStore)}>
    {children}
  </store.Provider>
)


const App = () => {
  return (
    <>
      <ChakraProvider>
        <StoreProvider>
          <Page>
            <NavBar />
            <Dock />
            <Weather />
            <WallpaperMenu />
            <ContextMenu />
            <Launchpad />

            {/* Mehnat Platform Apps */}
            <QoidalarApp />
            <VideoApp />
            <SlaydlarApp />
            <TemirYolApp />
            <BannerlarApp />
            <KasbApp />

            {/* Safety Scoreboard Apps */}
            <DashboardApp />
            <GlobalDashboardApp />
            <KorxonalarApp />
            <KpiApp />
            <AdminApp />
            <ProfilApp />
          </Page>

        </StoreProvider>
      </ChakraProvider>
    </>
  )
}

export default App