import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchMovieById } from '@/api/tmdb';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import Header from '@/components/Header';

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

const Watchlist = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [sortBy, setSortBy] = useState<'added' | 'rating'>('added');

  useEffect(() => {
    const stored = localStorage.getItem('watchlist');
    const entryList: WatchlistEntry[] = stored ? JSON.parse(stored) : [];
    setEntries(entryList);
  }, []);

  useEffect(() => {
    Promise.all(entries.map(entry => fetchMovieById(entry.id)))
      .then((movieDetailsArr) => {
        const movies: Movie[] = movieDetailsArr.map((details) => ({
          ...details,
          genre_ids: details.genres ? details.genres.map(g => g.id) : [],
        }));
        setMovies(movies);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        // TODO: Implement error handling UI feedback
      });
  }, [entries]);

  // Sorting logic

  const sortedMovies = [...movies];
  if (sortBy === 'added') {
    sortedMovies.sort((a, b) => {
      const aEntry = entries.find(e => e.id === a.id);
      const bEntry = entries.find(e => e.id === b.id);
      return (bEntry?.addedAt ?? 0) - (aEntry?.addedAt ?? 0);
    });
  } else if (sortBy === 'rating') {
    sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'added' | 'rating');
  };

  const handleSearchChange = () => {};
  const handleSearchClear = () => {};
  const handleSidebarToggle = () => {};

  return (
    <Container>
      <Header
        menuOpen={false}
        query=""
        handleSearchChange={handleSearchChange}
        handleSearchClear={handleSearchClear}
        handleSidebarToggle={handleSidebarToggle}
      />
      <h1 style={{ marginTop: 0 }}>My Watchlist</h1>
      <div style={{ margin: '20px 0' }}>
        <label>
          Sort by:{' '}
          <select value={sortBy} onChange={handleSortChange}>
            <option value="added">Date Added</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>
      <Movies>
        {sortedMovies.length === 0 ? (
          <p>Your watchlist is empty.</p>
        ) : (
          sortedMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={entries.some(e => e.id === movie.id)}
              onToggleWatchlist={() => {
                const updated = entries.filter(e => e.id !== movie.id);
                setEntries(updated);
                localStorage.setItem('watchlist', JSON.stringify(updated));
              }}
            />
          ))
        )}
      </Movies>
    </Container>
  );
};

export default Watchlist;