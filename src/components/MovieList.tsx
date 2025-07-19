import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Movie {
  movieId: number;
  title: string;
  posterUrl: string;
}

interface MovieListProps {
  isMobile: boolean;
  movies: Movie[];
}

interface styleType {
  $ismobile: boolean;
}

const MovieListContainer = styled.div<styleType>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const MovieItem = styled.div<styleType>`
  margin: ${(props) => (props.$ismobile ? "2px" : "8px")};
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s;
  &:hover {
    transform: scale(1.5);
    background: transparent;
  }
`;

const MoviePosters = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "80px" : "220px")};
  height: ${(props) => (props.$ismobile ? "120px" : "260px")};
  border-radius: 8px;
  object-fit: cover;
  display: block;
  transition: object-fit 0.15s;
  ${MovieItem}:hover & {
    object-fit: contain;
  }
`;

const MovieList = ({ isMobile, movies }: MovieListProps) => {
  const navigate = useNavigate();
  const handleMovieClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  return (
    <MovieListContainer $ismobile={isMobile}>
      {movies.map((movie) => (
        <MovieItem
          $ismobile={isMobile}
          key={movie.movieId}
          onClick={() => handleMovieClick(movie.movieId)}
        >
          <MoviePosters
            $ismobile={isMobile}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </MovieItem>
      ))}
    </MovieListContainer>
  );
};

export default MovieList;
