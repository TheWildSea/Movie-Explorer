import NoImageAvailable from '@/assets/no-image-available.svg';

export const getPosterUrl = (posterPath: string | null): string => {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : NoImageAvailable;
};
