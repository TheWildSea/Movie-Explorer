import React, { useState } from 'react';
import styled from 'styled-components';
import {Link, useParams} from '@tanstack/react-router';

import { MovieDetailsRoute } from '@/routeTree';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { getPosterUrl } from '@/helpers/imageHelpers';

import RightArrowIcon from '@/assets/right.png';
import LeftArrowIcon from '@/assets/left.png';
import { ThemeType } from '@/helpers/themes';

const Container = styled.div`
    padding-top: 70px;
`;

const Details = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
`;

const ImageContainer = styled.div`
    display: flex;
    width: 300px;
    height: auto;
    margin-right: 60px;
`;

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 60%;
    max-width: 800px;
`;

const Genres = styled.div`
    display: flex;
    gap: 10px;
`;

const GenreItem = styled.div`
    padding: 10px;
    background: #777;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 5px;
`;


const Section = styled.div`
    margin-top: 30px;
    text-align: left;
`;

const SectionTitle = styled.h3<{ theme: ThemeType }>`
    color: ${({ theme }) => theme.titleText};
    margin-bottom: 7px;
`;

const SectionDetails = styled.p<{ theme: ThemeType }>`
    color: ${({ theme }) => theme.text};
`;

const MovieTitle = styled.h1<{ theme: ThemeType }>`
    color: ${({ theme }) => theme.titleText};
`;

const CastList = styled.div<{ theme: ThemeType }>`
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
`;

const CastCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ActorName = styled.p<{ theme: ThemeType }>`
    font-weight: bold;
    font-size: 14px;
    color: ${({ theme }) => theme.titleText};
`;

const CharacterName = styled.p<{ theme: ThemeType }>`
    margin-top: 5px;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
`;

const TrailerSlider = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const ArrowButton = styled.button<{ direction: 'left' | 'right', theme: ThemeType }>`
    position: relative;
    height: 40px;
    width: 40px;
    cursor: pointer;
    overflow: hidden;
    background-image: ${({direction}) =>
            direction === 'left' ? `url(${LeftArrowIcon})` : `url(${RightArrowIcon})`};
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

const VideoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TrailerTitle = styled.p<{ theme: ThemeType }>`
    margin-top: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
`;

const StyledBackLink = styled(Link)<{ theme: ThemeType }>`
    position: absolute;
    top: 20px;
    left: 20px;
    color: ${({ theme }) => theme.text};
    font-size: 24px;
    background: none;
    border: none;
    z-index: 10;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;


const MovieDetails = () => {

    const [currentTrailer, setCurrentTrailer] = useState(0);

    const nextTrailer = () => {
        setCurrentTrailer((prev) => (prev + 1) % videos.length);
    };

    const prevTrailer = () => {
        setCurrentTrailer((prev) => (prev - 1 + videos.length) % videos.length);
    };

    const { movieId } = useParams({ from: MovieDetailsRoute.id });
    const movieIdNum = parseInt(movieId);

    const { movie, credits, videos, isLoading, isError, error } = useMovieDetails(movieIdNum);

    if (isError) {
        console.error('Error fetching movie details:', error);
        return <p>Error loading movie: {error?.message || 'Unknown error occurred'}</p>;
    }
    if (!movie) return <p>Movie not found</p>;

    return (
        <Container style={{ position: 'relative', minHeight: '100vh' }}>
            <StyledBackLink to="/">← Home</StyledBackLink>
            {isLoading ? <p>Loading movie details...</p> :
                <Details>
                    <ImageContainer>
                        <img src={getPosterUrl(movie.poster_path)} alt={movie.title} />
                    </ImageContainer>
                    <DetailsContainer>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <Section>
                            <SectionTitle>Overview:</SectionTitle>
                            <SectionDetails>{movie.overview}</SectionDetails>
                        </Section>
                        <Section>
                            <SectionTitle>Genres:</SectionTitle>
                            <Genres>
                                {movie.genres.map((genre) => (
                                    <GenreItem key={genre.id}>
                                        {genre.name}
                                    </GenreItem>
                                ))}
                            </Genres>
                        </Section>
                        <Section>
                            <SectionTitle>Release Date:</SectionTitle>
                            <SectionDetails>{movie.release_date}</SectionDetails>
                        </Section>
                        {credits?.cast != null && credits?.cast.length > 0 && (
                            <Section>
                                <SectionTitle>Top Cast:</SectionTitle>
                                <CastList>
                                    {credits.cast.slice(0, 10).map(actor => (
                                        <CastCard key={actor.id}>
                                            <ActorName>{actor.name}</ActorName>
                                            <CharacterName>{actor.character}</CharacterName>
                                        </CastCard>
                                    ))}
                                </CastList>
                            </Section>
                        )}
                        {videos.length > 0 && (
                            <Section>
                                <SectionTitle>Trailers:</SectionTitle>
                                <TrailerSlider>
                                    {videos.length === 1 ? null : <ArrowButton direction="left" onClick={prevTrailer} />}
                                    <VideoWrapper>
                                        <iframe
                                            width="400"
                                            height="225"
                                            src={`https://www.youtube.com/embed/${videos[currentTrailer].key}`}
                                            title={videos[currentTrailer].name}
                                        />
                                        <TrailerTitle>{videos[currentTrailer].name}</TrailerTitle>
                                    </VideoWrapper>
                                    {videos.length === 1 ? null : <ArrowButton direction="right" onClick={nextTrailer} />}
                                </TrailerSlider>
                            </Section>
                        )}
                    </DetailsContainer>
                </Details>
            }
        </Container>
    );
};

export default MovieDetails;
