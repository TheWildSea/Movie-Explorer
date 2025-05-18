import { useQuery } from '@tanstack/react-query';
import {
    fetchMovieById,
    fetchMovieCredits,
    fetchMovieVideos
} from '@/api/tmdb';

import {
    MovieDetails,
    Credits,
    Videos
} from '@/types/movie';

export const useMovieDetails = (movieId: number) => {
    const enabled = !!movieId;

    const movieQuery = useQuery<MovieDetails, Error>({
        queryKey: ['movie', movieId],
        queryFn: () => fetchMovieById(movieId),
        staleTime: 60000,
        enabled
    });

    const creditsQuery = useQuery<Credits, Error>({
        queryKey: ['credits', movieId],
        queryFn: () => fetchMovieCredits(movieId),
        staleTime: 60000,
        enabled
    });

    const videosQuery = useQuery<Videos, Error>({
        queryKey: ['videos', movieId],
        queryFn: () => fetchMovieVideos(movieId),
        staleTime: 60000,
        enabled
    });

    return {
        movie: movieQuery.data,
        credits: creditsQuery.data,
        videos: videosQuery.data?.results.filter(video => video.type === 'Trailer') || [],
        isLoading: movieQuery.isLoading || creditsQuery.isLoading || videosQuery.isLoading,
        isError: movieQuery.isError || creditsQuery.isError || videosQuery.isError
    };
};
