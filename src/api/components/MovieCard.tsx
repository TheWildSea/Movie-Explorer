import React from 'react';
import type { Movie } from '../tmdb';

type MovieCardProps = {
  movie: Movie;
  onClick?: () => void;
  inWatchlist?: boolean;
  onToggleWatchlist?: () => void;
  viewMode?: 'grid' | 'list';
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  inWatchlist,
  onToggleWatchlist,
  viewMode = 'grid',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-gray-800 rounded shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}
      style={{ minHeight: viewMode === 'list' ? 180 : undefined }}
    >
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.png'}
        alt={movie.title}
        className={viewMode === 'list' ? 'w-32 h-48 object-cover rounded-l' : 'w-full h-72 object-cover'}
      />
      <div className={`p-4 flex-1 flex flex-col justify-between ${viewMode === 'list' ? '' : 'items-center'}`}>
        <div>
          <h3 className="text-lg font-bold mb-1">{movie.title} <span className="text-gray-500 text-sm">({movie.release_date?.slice(0, 4)})</span></h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500 font-bold">★ {movie.vote_average.toFixed(1)}</span>
            {inWatchlist && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">In Watchlist</span>}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
        </div>
        {onToggleWatchlist && (
          <button
            onClick={e => { e.stopPropagation(); onToggleWatchlist(); }}
            className="mt-2 px-3 py-1 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
          >
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
