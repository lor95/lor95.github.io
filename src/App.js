import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { GameScreen } from './components/GameScreen';
import { MainScreen } from './components/MainScreen';

function App() {
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
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/asteroids" element={<GameScreen />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}

export default App;
