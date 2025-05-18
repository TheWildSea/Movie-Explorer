import React from 'react';
import styled from 'styled-components';

import { ThemeType } from '@/helpers/themes';

const Container = styled.div`
    position: relative;
    width: 40px;
    height: 23px;
    cursor: pointer;
    overflow: hidden;
    z-index: 9999;
`;

const MenuItem = styled.div<{ open: boolean, theme: ThemeType }>`
    position: absolute;
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.text};
    transition-duration: 0.3s, 0.3s;

    &:nth-child(1) {
      top: ${({ open }) => (open ? '10px' : '0')};
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'none'};
      transition-property: top, transform;
      transition-delay: ${({ open }) => open ? '0s, 0.3s' : '0.3s, 0s'};
    }

    &:nth-child(2) {
      top: 10px;
      transform: ${({ open }) => open ? 'translateX(-100px)' : 'none'};
      transition-property: transform;
      transition-delay: ${({ open }) => open ? '0.3s' : '0s'};
    }

    &:nth-child(3) {
      bottom: ${({ open }) => open ? '10px' : '0'};
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'none'};
      transition-property: bottom, transform;
      transition-delay: ${({ open }) => open ? '0s, 0.3s' : '0.3s, 0s'};
    } 
`;

const Menu = ({ open, handleSidebarToggle }: { open: boolean, handleSidebarToggle: () => void; }) => (
    <Container onClick={handleSidebarToggle} aria-label="Toggle menu" role="button">
        <MenuItem open={open}/>
        <MenuItem open={open}/>
        <MenuItem open={open}/>
    </Container>
);

export default Menu;
