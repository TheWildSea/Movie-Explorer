import React from 'react';
import styled from 'styled-components';
import { Link, useRouterState } from '@tanstack/react-router';

import Search from '@/components/Search';
import Menu from '@/components/Menu';
import ThemeSwitch from '@/components/ThemeSwitch';
import { ThemeType } from '@/helpers/themes';

const HeaderWrapper = styled.header<{ theme: ThemeType }>`
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    padding: 0 33px;
    background-color: ${({ theme }) => theme.headerBackground};
    color: white;
    text-align: center;
    z-index: 1;
`;

const WatchlistButton = styled(Link)`
    margin-right: 20px;
    font-size: 28px;
    color: #f5c518;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    &:hover {
        color: #bfa100;
    }
`;

type HeaderProps = {
    query: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearchClear: () => void;
    handleSidebarToggle: () => void;
    menuOpen: boolean;
}

const Header = ({ query, handleSearchChange, handleSearchClear, handleSidebarToggle, menuOpen }: HeaderProps) => {
    const location = useRouterState({ select: state => state.location });
    const isWatchlist = location.pathname === '/watchlist';

    return (
        <HeaderWrapper>
            <Menu open={menuOpen} handleSidebarToggle={handleSidebarToggle}/>
            <ThemeSwitch />
            {/* Move WatchlistButton here, before Search */}
            {isWatchlist ? (
                <WatchlistButton to="/" aria-label="Back to Home">
                    <span role="img" aria-label="home">Home</span>
                </WatchlistButton>
            ) : (
                <WatchlistButton to="/watchlist" aria-label="Open Watchlist">
                    <span role="img" aria-label="watchlist">Watchlist</span>
                </WatchlistButton>
            )}
            <Search query={query} onChange={handleSearchChange} onClear={handleSearchClear} />
        </HeaderWrapper>
    );
};

export default Header;
