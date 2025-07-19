import styled from "styled-components";
import TagSelector from "../components/TagSelector";
import MovieList from "../components/MovieList";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useMovieApi } from "../api/movie";

// const genres = [
//   { id: 12, name: "Adventure" },
//   { id: 14, name: "Fantasy" },
//   { id: 16, name: "Animation" },
//   { id: 18, name: "Drama" },
//   { id: 27, name: "Horror" },
//   { id: 28, name: "Action" },
//   { id: 35, name: "Comedy" },
//   { id: 36, name: "History" },
//   { id: 37, name: "Western" },
//   { id: 53, name: "Thriller" },
//   { id: 80, name: "Crime" },
//   { id: 99, name: "Documentary" },
//   { id: 878, name: "Science Fiction" },
//   { id: 9648, name: "Mystery" },
//   { id: 10402, name: "Music" },
//   { id: 10749, name: "Romance" },
//   { id: 10751, name: "Family" },
//   { id: 10752, name: "War" },
//   { id: 10700, name: "TV Movie" },
// ];

const genresKOR = [
  { id: 12, name: "모험" },
  { id: 14, name: "판타지" },
  { id: 16, name: "애니메이션" },
  { id: 18, name: "드라마" },
  { id: 27, name: "공포" },
  { id: 28, name: "액션" },
  { id: 35, name: "코미디" },
  { id: 36, name: "역사" },
  { id: 37, name: "서부" },
  { id: 53, name: "스릴러" },
  { id: 80, name: "범죄" },
  { id: 99, name: "다큐멘터리" },
  { id: 878, name: "SF" },
  { id: 9648, name: "미스터리" },
  { id: 10402, name: "음악" },
  { id: 10749, name: "로맨스" },
  { id: 10751, name: "가족" },
  { id: 10752, name: "전쟁" },
  // { id: 10700, name: "TV 영화" },
];

const MovieContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 65px; /* Adjust based on Header height + 5px*/
`;

interface Movie {
  movieId: number;
  title: string;
  posterUrl: string;
  movieGenre: string[];
}

const Movie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { getMovies } = useMovieApi();

  useEffect(() => {
    console.log("Movie component mounted");
    const res = getMovies();
    res
      .then((data) => {
        console.log("Fetched movies:", data.data);
        setMovies(data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  useEffect(() => {
    // 선택된 장르에 따라 영화 리스트 불러오기
  }, [selectedGenres]);

  return (
    <MovieContainer>
      <TagSelector
        isMobile={isMobile}
        tags={genresKOR}
        selectedTags={selectedGenres}
        onChange={setSelectedGenres}
      />
      <MovieList
        isMobile={isMobile}
        movies={movies.filter(
          (movie) =>
            movie.movieGenre.some((genre) => selectedGenres.includes(genre)) ||
            selectedGenres.length === 0
        )}
      />
    </MovieContainer>
  );
};

export default Movie;
