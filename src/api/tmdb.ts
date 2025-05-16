// See vite-env.d.ts for ImportMeta type extension if needed
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
}


export interface PopularMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}


export const fetchPopularMovies = async (page: number = 1): Promise<PopularMoviesResponse> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  };

export const fetchSearchMovies = async (query: string): Promise<PopularMoviesResponse> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Failed to fetch search movies');
  return response.json();
};

export const fetchMovieDetails = async (id: number) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch movie details');
  return response.json();
};

export const fetchGenres = async (): Promise<{ genres: { id: number; name: string }[] }> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch genres');
  return response.json();
};

export const fetchDiscoverMovies = async (page: number = 1, genres: number[] = []): Promise<PopularMoviesResponse> => {
  const genreParam = genres.length ? `&with_genres=${genres.join(',')}` : '';
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${page}${genreParam}`
  );
  if (!response.ok) throw new Error('Failed to fetch discover movies');
  return response.json();
};

