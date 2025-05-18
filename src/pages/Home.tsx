import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MovieCard from '@/components/MovieCard';

import { useMovies } from '@/hooks/useMovies';
import { Movie } from '@/types/movie';

const Container = styled.div`
    padding: 70px 0;
`;

const Movies = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 50px;
`;

type WatchlistEntry = { id: number; addedAt: number };

const Home = () => {

    const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
        const stored = localStorage.getItem("watchlist");
        return stored ? JSON.parse(stored) : [];
    });
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [page, setPage] = useState(1);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);

    const { data, isLoading, isFetching, error } = useMovies(debouncedQuery, page, selectedGenres);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 800);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        setPage(1);
        setAllMovies([]);
    }, [debouncedQuery, selectedGenres.length]);

    const prevPageRef = useRef<number>(page);

    useEffect(() => {
        if (!data?.results) return;

        const prevPage = prevPageRef.current;

        if (page > prevPage) {
            setAllMovies(prev => [...prev, ...data.results]);
        }

        if (page === 1) {
            setAllMovies(data.results);
        }

        prevPageRef.current = page;
    }, [data, page]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const handleScroll = () => {
            if (timeoutId || data?.total_pages === page) return;

            timeoutId = setTimeout(() => {
                const scrollTop = window.scrollY;
                const windowHeight = window.innerHeight;
                const fullHeight = document.body.offsetHeight;

                if (scrollTop + windowHeight >= fullHeight - 500 && !isFetching) {
                    setPage(prev => prev + 1);
                }

                timeoutId = null;
            }, 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetching, data?.total_pages, page]);


    const handleSidebarToggle = () => setIsSidebarOpen(prev => !prev);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleSearchClear = useCallback(() => {
        setQuery("");
        setAllMovies([]);
        setPage(1);
    }, []);

    const handleGenreToggle = useCallback((genreId: number) => {
        setSelectedGenres(prev =>
            prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
        );
    }, []);

    const handleGenreClear = useCallback(() => {
        setSelectedGenres([]);
        setAllMovies([]);
        setPage(1);
    }, []);


    const toggleWatchlist = (movieId: number) => {
        setWatchlist(prev => {
            const exists = prev.some(entry => entry.id === movieId);
            let updated;
            if (exists) {
                updated = prev.filter(entry => entry.id !== movieId);
            } else {
                updated = [...prev, { id: movieId, addedAt: Date.now() }];
            }
            localStorage.setItem('watchlist', JSON.stringify(updated));
            return updated;
        });
    };

    if (error) return <p>Error loading movies</p>;

    return (
        <Container>
            <Header
                menuOpen={isSidebarOpen}
                query={query}
                handleSearchChange={handleSearchChange}
                handleSearchClear={handleSearchClear}
                handleSidebarToggle={handleSidebarToggle}
            />
            <Sidebar
                sidebarOpen={isSidebarOpen}
                selectedGenres={selectedGenres}
                onToggleGenre={handleGenreToggle}
                handleGenreClear={handleGenreClear}
            />
            {isLoading && page === 1 ? (
                <p>Loading movies...</p>
            ) : (
                <>
                    <Movies>
                        {allMovies.length === 0 ? (
                            <p>No movies found.</p>
                        ) : (
                            allMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    isInWatchlist={watchlist.some(entry => entry.id === movie.id)}
                                    onToggleWatchlist={toggleWatchlist}
                                />
                            ))
                        )}
                    </Movies>
                    {isFetching && <p>Loading more...</p>}
                </>
            )}
        </Container>
    );
};

export default Home;
