import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import MovieCard from './api/components/MovieCard'; 
import { fetchSearchMovies, fetchMovieDetails, fetchGenres, fetchDiscoverMovies } from './api/tmdb';
import type { Movie } from './api/tmdb';

function App() {
  type MoviesApiResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'date' | ''>('');
  const [dark, setDark] = useState(() => {
    // Use localStorage or system preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Toggle dark mode and save to localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    fetchGenres().then(data => setGenres(data.genres));
  }, []);

  const {
    data: popularData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPopularLoading,
    error: popularError,
  } = useInfiniteQuery({
    queryKey: ['discoverMovies', selectedGenres],
    queryFn: ({ pageParam = 1 }) => fetchDiscoverMovies(pageParam, selectedGenres),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !debouncedSearch, // Only run when not searching
  });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ['searchMovies', debouncedSearch],
    queryFn: () => fetchSearchMovies(debouncedSearch),
    enabled: !!debouncedSearch, // Only run when searching
  });

  const { data: movieDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['movieDetails', selectedMovieId],
    queryFn: () => fetchMovieDetails(selectedMovieId!),
    enabled: !!selectedMovieId,
  });

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };



  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || debouncedSearch) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, debouncedSearch]);

  if (isPopularLoading || isSearchLoading || isDetailsLoading) return <div>Loading...</div>;
  if (popularError || searchError) return <div>Error loading movies.</div>;

  // Choose which data to show
  const allMovies = debouncedSearch
    ? searchData?.results || []
    : popularData?.pages.flatMap((page: MoviesApiResponse) => page.results) || [];

  const dedupedMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());

  const moviesToShow = showWatchlist
    ? dedupedMovies.filter((movie: Movie) => watchlist.includes(movie.id))
    : dedupedMovies;

  const sortedMovies = [...moviesToShow];
  if (sortBy === 'rating') {
    sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy === 'date') {
    sortedMovies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  }

  return (
    <main className="font-sans p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setDark(d => !d)}
          className={`px-3 py-1 rounded border font-semibold transition
            ${dark
              ? 'bg-yellow-400 text-black border-yellow-500 shadow'
              : 'bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300'}
            hover:scale-105 focus:ring-2 focus:ring-yellow-400`}
          aria-pressed={dark}
        >
          {dark ? '🌙 Night' : '☀️ Day'}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('theme');
            setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
          }}
          className="px-3 py-1 rounded border font-semibold bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300 hover:scale-105 focus:ring-2 focus:ring-blue-400"
        >
          System
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 rounded border font-semibold transition
            ${viewMode === 'grid'
              ? 'bg-blue-600 text-white border-blue-700 shadow'
              : 'bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300'}
            hover:scale-105 focus:ring-2 focus:ring-blue-400`}
          aria-pressed={viewMode === 'grid'}
        >
          ⬛ Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1 rounded border font-semibold transition
            ${viewMode === 'list'
              ? 'bg-blue-600 text-white border-blue-700 shadow'
              : 'bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300'}
            hover:scale-105 focus:ring-2 focus:ring-blue-400`}
          aria-pressed={viewMode === 'list'}
        >
          ☰ List
        </button>
      </div>
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Search movies"
      />
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2
            ${!showWatchlist
              ? 'bg-blue-600 text-white shadow border-blue-700 ring-2 ring-blue-300'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300'}
            border hover:scale-105 focus:ring-2 focus:ring-blue-400`}
          aria-pressed={!showWatchlist}
          onClick={() => setShowWatchlist(false)}
        >
          <span>🎬</span> All Movies
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2
            ${showWatchlist
              ? 'bg-yellow-400 text-black shadow border-yellow-500 ring-2 ring-yellow-300'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300'}
            border hover:scale-105 focus:ring-2 focus:ring-yellow-400`}
          aria-pressed={showWatchlist}
          onClick={() => setShowWatchlist(true)}
        >
          <span>⭐</span> My Watchlist
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
  {genres.map((genre) => {
    const isActive = selectedGenres.includes(genre.id);
    return (
      <button
        key={genre.id}
        className={`px-3 py-1 rounded-full border font-medium shadow-sm transition
          ${isActive
            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 scale-105'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-800'}
        `}
        style={{
          fontWeight: isActive ? 'bold' : 'normal',
          outline: isActive ? '2px solid #2563eb' : undefined,
        }}
        aria-pressed={isActive}
        onClick={() =>
          setSelectedGenres((prev) =>
            prev.includes(genre.id)
              ? prev.filter((id) => id !== genre.id)
              : [...prev, genre.id]
          )
        }
      >
        {isActive && <span className="mr-1">✔</span>}
        {genre.name}
      </button>
    );
  })}
</div>
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2 font-medium">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'rating' | 'date' | '')}
          className="p-2 border rounded"
        >
          <option value="">Default</option>
          <option value="rating">Rating</option>
          <option value="date">Release Date</option>
        </select>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedMovies.map((movie: Movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              viewMode="grid"
              onClick={() => setSelectedMovieId(movie.id)}
              inWatchlist={watchlist.includes(movie.id)}
              onToggleWatchlist={() => toggleWatchlist(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedMovies.map((movie: Movie) => (
            <div key={movie.id} className="w-full">
              <MovieCard
                movie={movie}
                viewMode="list"
                onClick={() => setSelectedMovieId(movie.id)}
                inWatchlist={watchlist.includes(movie.id)}
                onToggleWatchlist={() => toggleWatchlist(movie.id)}
              />
            </div>
          ))}
        </div>
      )}
      {/* Infinite scroll sentinel */}
      {!debouncedSearch && hasNextPage && (
        <div ref={loadMoreRef} className="h-10" />
      )}

      {selectedMovieId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded max-w-lg w-full relative transition-colors duration-300">
            <button
              onClick={() => setSelectedMovieId(null)}
              className="absolute top-2 right-2 text-gray-500"
              aria-label="Close"
            >
              ✕
            </button>
            {isDetailsLoading ? (
              <div>Loading...</div>
            ) : movieDetails ? (
              <div>
                <h2 className="text-xl font-bold mb-2">{movieDetails.title}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`}
                  alt={movieDetails.title}
                  className="mb-2 rounded"
                />
                <p><strong>Genres:</strong> {movieDetails.genres.map((g: { id: number; name: string }) => g.name).join(', ')}</p>
                <p><strong>Runtime:</strong> {movieDetails.runtime} min</p>
                <p className="mt-2">{movieDetails.overview}</p>
              </div>
            ) : (
              <div>Movie not found.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
