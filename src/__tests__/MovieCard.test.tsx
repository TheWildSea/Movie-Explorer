import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';

jest.mock('@/api/tmdb', () => ({}));

const movie = {
  id: 1,
  title: 'Test Movie',
  release_date: '2020-01-01',
  poster_path: null,
  vote_average: 8.5,
  genre_ids: [],
  adult: false,
  backdrop_path: null,
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'Test overview',
  popularity: 0,
  video: false,
  vote_count: 0,
};

test('add and remove from watchlist', () => {
  const toggleWatchlist = jest.fn();
  render(
    <MovieCard
      movie={movie}
      isInWatchlist={false}
      onToggleWatchlist={toggleWatchlist}
    />
  );

  const addBtn = screen.getByRole('button', { name: /add to watchlist/i });
  fireEvent.click(addBtn);
  expect(toggleWatchlist).toHaveBeenCalledWith(1);

  // Now test remove
  render(
    <MovieCard
      movie={movie}
      isInWatchlist={true}
      onToggleWatchlist={toggleWatchlist}
    />
  );
  const removeBtn = screen.getByRole('button', { name: /remove from watchlist/i });
  fireEvent.click(removeBtn);
  expect(toggleWatchlist).toHaveBeenCalledWith(1);
});