import { Movies, Movie, MovieDetails, Genres, Credits, Videos } from '@/types/movie';

const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

const getHeaders = () => ({
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
});

export const fetchMovies = async (
    query: string | null = null,
    page: number = 1,
    genreIds: number[] = []
): Promise<Movies> => {
    let url: string;
    let filterByGenres = false;

    if (query) {
        // /search/movie does NOT support with_genres, so we filter client-side
        url = `${baseUrl}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
        filterByGenres = genreIds.length > 0;
    } else {
        const genreParam = genreIds.length ? `&with_genres=${genreIds.join(',')}` : '';
        url = `${baseUrl}/discover/movie?page=${page}${genreParam}`;
    }

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        const errorMessage = `Failed to fetch movies. Status: ${response.status}. StatusText: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    const data = await response.json();

    // TODO: Implement server-side filtering or pagination for better performance with large datasets
    if (filterByGenres) {
        data.results = data.results.filter((movie: Movie) =>
            movie.genre_ids && genreIds.every(id => movie.genre_ids.includes(id))
        );
    }

    return data;
};

export const fetchMovieById = async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(`${baseUrl}/movie/${movieId}`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch movie with ID: ${movieId}`);
    return await response.json();
};

export const fetchGenres = async (): Promise<Genres> => {
    const response = await fetch(`${baseUrl}/genre/movie/list?language=en`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch genres');
    return await response.json();
};

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
    const response = await fetch(`${baseUrl}/movie/${movieId}/credits`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch credits for movie ID: ${movieId}`);
    return await response.json();
};

export const fetchMovieVideos = async (movieId: number): Promise<Videos> => {
    const response = await fetch(`${baseUrl}/movie/${movieId}/videos`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch videos for movie ID: ${movieId}`);
    return await response.json();
};
