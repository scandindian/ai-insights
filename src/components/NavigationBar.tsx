import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavBar = styled.nav`
    background: #fff;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
    width: 100%;
    max-width: 100vw;
`;

const NavList = styled.ul`
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
    color: #1976d2;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.2s, color 0.2s;

    &:hover {
        background: #e3f2fd;
        color: #1565c0;
    }
`;

const NavigationBar: React.FC = () => (
    <NavBar>
        <NavList>
            <NavItem>
                <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to="/users">Users</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to="/departments">Departments</NavLink>
            </NavItem>
        </NavList>
    </NavBar>
);

export default NavigationBar;