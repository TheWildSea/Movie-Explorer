import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@/helpers/themes';
import { GlobalStyle } from '@/helpers/globalStyles';

import { ThemeToggleContext } from './ThemeToggleContext';

const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('theme');

            if (!savedTheme) {
                localStorage.setItem('theme', 'dark');
                setIsDarkMode(true);
            } else {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            // Fallback to default theme if localStorage is not available
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            try {
                localStorage.setItem('theme', !prev ? 'dark' : 'light');
            } catch (error) {
                console.error('Error setting theme in localStorage:', error);
            }
            return !prev;
        });
    };

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme }}>
                {children}
            </ThemeToggleContext.Provider>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;