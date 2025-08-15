import React from 'react';
import styled from 'styled-components';

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

const NavLink = styled.a`
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
                <NavLink href="#">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="#">Users</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="#">Departments</NavLink>
            </NavItem>
        </NavList>
    </NavBar>
);

export default NavigationBar;