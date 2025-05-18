import React from 'react';
import styled from 'styled-components';
import { Link } from '@tanstack/react-router';

import { MovieDetailsRoute } from '@/routeTree';
import { getPosterUrl } from '@/helpers/imageHelpers';
import { Movie } from '@/types/movie';
import { ThemeType } from '@/helpers/themes';

const MovieItem = styled.div`
    position: relative;
    width: 300px;
    text-align: left;
`;

const Poster = styled.img`
    width: 100%;
    min-height: 430px;
`;

const MovieInfo = styled.span<{ theme: ThemeType }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    color: ${({ theme }) => theme.text};
`;

const MovieTitle = styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin: 10px 0;
`;

const Title = styled.h2`
    font-size: 20px;
    width: 80%;
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const VoteAverage = styled.p`
    margin-left: 10px;
    color: #f0de24;
`;

const FavoriteButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

type MovieCardProps = {
    movie: Movie;
    isInWatchlist: boolean;
    onToggleWatchlist: (movieId: number) => void;
};

const MovieCard = ({ movie, isInWatchlist, onToggleWatchlist }: MovieCardProps) => {
    const getReleaseYear = (releaseDate: string | undefined): string => {
        if (releaseDate && releaseDate.length >= 4) {
            return releaseDate.slice(0, 4);
        }
        return 'N/A';
    };

    return (
        <MovieItem>
            <FavoriteButton
                onClick={() => onToggleWatchlist(movie.id)}
                aria-label={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
                {isInWatchlist ? "★ Remove from Watchlist" : "☆ Add to Watchlist"}
            </FavoriteButton>
            <Poster src={getPosterUrl(movie.poster_path)} alt={movie.title} />
            <MovieInfo>
                <MovieTitle>
                    <Title>{movie.title} ({getReleaseYear(movie.release_date)})</Title>
                    <VoteAverage>{`★ ${movie.vote_average.toFixed(1)}`}</VoteAverage>
                </MovieTitle>
                <Link to={MovieDetailsRoute.to} params={{ movieId: `${movie.id}` }}>
                    More Details
                </Link>
            </MovieInfo>
        </MovieItem>
    );
};

export default MovieCard;
