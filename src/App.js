import { MantineProvider } from '@mantine/core';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { GameScreen } from './components/GameScreen';
import { MainScreen } from './components/MainScreen';

function App() {
    console.log(process.env.PUBLIC_URL);
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                fontFamily: 'LatoLight, sans-serif',
                headings: {
                    fontFamily: 'LatoBold, sans-serif',
                },
                fontSizes: {
                    xl: '2.2rem',
                },
            }}
        >
            <HashRouter>
                {/* TODO: use BrowserRouter*/}
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/asteroids" element={<GameScreen />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </HashRouter>
        </MantineProvider>
    );
}

export default App;
