import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GameScreen } from './components/GameScreen';
import { MainScreen } from './components/MainScreen';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainScreen />} />
                <Route path="/asteroids" element={<GameScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
