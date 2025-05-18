import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeToggleContext } from '@/components/ThemeToggleContext';

const StyledButton = styled.button`
    margin: 0 auto 0 20px;
    font-size: 24px;
`;

const ThemeToggleButton= () => {
    const { toggleTheme, isDarkMode } = useContext(ThemeToggleContext);

    return (
        <StyledButton onClick={toggleTheme}>
            {isDarkMode ? '🌞︎︎' : '🌙'}
        </StyledButton>
    );
};

export default ThemeToggleButton;