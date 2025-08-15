import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Users from './pages/Users';
import Departments from './pages/Departments';

const AppContainer = styled.div`
    min-height: 100vh;
    background: #f5f6fa;
`;

const App: React.FC = () => (
    <AppContainer>
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/departments" element={<Departments />} />
            </Routes>
        </BrowserRouter>
    </AppContainer>
);

export default App;