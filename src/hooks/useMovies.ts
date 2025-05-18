import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchMovies } from '@/api/tmdb';
import { Movies } from '@/types/movie';

export const useMovies = (
    query: string | null,
    page: number,
    genreIds: number[] = []
) => {
    return useQuery<Movies>({
        queryKey: ['movies', query, page, genreIds],
        queryFn: () => fetchMovies(query, page, genreIds),
        staleTime: 60000,
        keepPreviousData: true,
    } as UseQueryOptions<Movies, Error, Movies>);
};