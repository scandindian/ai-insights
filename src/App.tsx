import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Departments from "./pages/Departments";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ContentContainer = styled.div`
  padding-left: 2.5vw;
  padding-right: 2.5vw;
  @media (max-width: 600px) {
    padding-left: 1vw;
    padding-right: 1vw;
  }
`;

const App: React.FC = () => (
  <AppContainer>
    <BrowserRouter>
      <NavigationBar />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </ContentContainer>
    </BrowserRouter>
  </AppContainer>
);

export default App;
