    import React from "react";
    import styled from "styled-components";
    import { useNavigate } from "react-router-dom";

    interface MovieData {
        myPickId: string;
        movieTitle: string;
        director: string;
        releaseDate: string;
        posterUrl: string;
    }

    const CardContainer = styled.div`
        background-color: #1a1a1a;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        display: flex;
        flex-direction: column;

        &:hover {
            transform: translateY(-5px);
        }
    `;

    const MoviePoster = styled.img`
        width: 100%;
        height: 220px;
        object-fit: cover;
        display: block;
    `;

    const MovieInfo = styled.div`
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex-grow: 1;
    `;

    const MovieTitle = styled.h3`
        font-weight: bold;
        color: #e0e0e0;
        font-size: 1em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    `;

    const MovieDetailText = styled.p`
        color: #aaa;
        font-size: 0.85em;
        margin: 0;
    `;

    interface MovieCardProps {
        movie: MovieData;
    }

    const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
        const navigate = useNavigate();

        const handleClick = () => {
            navigate(`/movies/${movie.myPickId}`);
        };

        return (
            <CardContainer onClick={handleClick}>
                <MoviePoster src={movie.posterUrl} alt={movie.movieTitle} />
                <MovieInfo>
                    <MovieTitle>{movie.movieTitle}</MovieTitle>
                    <MovieDetailText>{movie.director}</MovieDetailText>
                    <MovieDetailText>{movie.releaseDate}</MovieDetailText>
                </MovieInfo>
            </CardContainer>
        );
    };

    export default MovieCard;
