import React from 'react';
import styled from 'styled-components';

import { useGenres } from '@/hooks/useGanres';
import { Genre } from '@/types/movie';
import { ThemeType } from '@/helpers/themes';

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'sidebarOpen'
})<{ sidebarOpen: boolean, theme: ThemeType }>`
    position: fixed;
    top: 70px;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 20px;
    background-color: ${({ theme }) => theme.sidebarBackground};
    color: ${({ theme }) => theme.titleText};
    z-index: 1000;
    transform: ${({ sidebarOpen }) => sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 40px;
`;

const Title = styled.div`
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
`;

const Content = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
`;

const GenreItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>`
    padding: 10px;
    background: ${({ isSelected }) => isSelected ? '#777' : '#444'};
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #555;
    }
`;

const ClearButton = styled.div<{ theme: ThemeType }>`
    margin-top: 20px;
    padding: 10px;
    color: ${({ theme }) => theme.titleText};
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #555;
    }
`;

type SidebarProps = {
    sidebarOpen: boolean;
    selectedGenres: number[];
    onToggleGenre: (genreId: number) => void;
    handleGenreClear: () => void;
};

const Sidebar = ({ sidebarOpen, selectedGenres, onToggleGenre, handleGenreClear }: SidebarProps) => {
    const { data, isLoading, error } = useGenres();

    return (
        <Container sidebarOpen={sidebarOpen}>
            <h2>Filter By</h2>
            {
                isLoading ? <p>Loading genres...</p> :
                    <Section>
                        {error ? <p>Error loading genres</p> :
                            <>
                                <Title>Genres</Title>
                                <Content>
                                    {data && data.genres && data.genres.map((genre: Genre) => {
                                        const isSelected = selectedGenres.includes(genre.id);
                                        return (
                                            <GenreItem
                                                key={genre.id}
                                                onClick={() => onToggleGenre(genre.id)}
                                                isSelected={isSelected}
                                            >
                                                {genre.name}
                                            </GenreItem>
                                        );
                                    })}
                                </Content>
                            </>
                        }
                    </Section>
            }
            {selectedGenres.length > 0 && <ClearButton onClick={handleGenreClear}>Clear Filters</ClearButton>}
        </Container>
    );
};

export default Sidebar;
