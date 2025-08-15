import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavBar = styled.nav`
    background: #222;
    padding: 0.5rem 2rem;
    display: flex;
    align-items: center;
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
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.2s;

    &:hover {
        color: #61dafb;
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