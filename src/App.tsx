import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Users from './pages/Users';
import Departments from './pages/Departments';

const App: React.FC = () => (
    <BrowserRouter>
        <NavigationBar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
        </Routes>
    </BrowserRouter>
);

export default App;