import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '@/api/tmdb';
import { Genres } from '@/types/movie';

export const useGenres = () => {
    return useQuery<Genres, Error>({
        queryKey: ['genres'],
        queryFn: fetchGenres,
        staleTime: 60000,
    });
};