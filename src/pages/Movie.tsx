import styled from "styled-components";
import TagSelector from "../components/TagSelector";
import MovieList from "../components/MovieList";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

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

const movies = [
  {
    id: 1,
    title: "Inside Out 2",
    poster_path: "/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
    genres: [16, 35, 10751],
  },
  {
    id: 2,
    title: "Godzilla x Kong: The New Empire",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [28, 12, 878],
  },
  {
    id: 3,
    title: "Despicable Me 4",
    poster_path: "/dZbLqRjjiiNCpTYzhzL2NMvz4J0.jpg",
    genres: [16, 35, 10751],
  },
  {
    id: 4,
    title: "Bad Boys: Ride or Die",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    genres: [28, 35, 80],
  },
  {
    id: 5,
    title: "The Garfield Movie",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [16, 35, 10751],
  },
  {
    id: 6,
    title: "A Quiet Place: Day One",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [27, 53, 878],
  },
  {
    id: 7,
    title: "Kingdom of the Planet of the Apes",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [12, 878, 28],
  },
  {
    id: 8,
    title: "The Watchers",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [27, 9648, 53],
  },
  {
    id: 9,
    title: "The Fall Guy",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [28, 35],
  },
  {
    id: 10,
    title: "Atlas",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [878, 28, 53],
  },
  {
    id: 11,
    title: "Furiosa: A Mad Max Saga",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [28, 12, 53],
  },
  {
    id: 12,
    title: "Civil War",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [28, 18, 53],
  },
  {
    id: 13,
    title: "The Bikeriders",
    poster_path: "/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg",
    genres: [18, 80],
  },
  {
    id: 14,
    title: "The Exorcism",
    poster_path: "/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg",
    genres: [27, 53],
  },
  {
    id: 15,
    title: "IF",
    poster_path: "/yOm993lsJyPmBodlYjgpPwBjXP9.jpg",
    genres: [35, 10751, 14],
  },
  {
    id: 18,
    title: "Haikyu!!: The Dumpster Battle",
    poster_path: "/tC78Pck2YCsUAtEdZwuHYUFYtOj.jpg",
    genres: [16, 18, 10751],
  },
  {
    id: 19,
    title: "The Strangers: Chapter 1",
    poster_path: "/bXi6IQiQDHD00JFio5ZSZOeRSBh.jpg",
    genres: [27, 53],
  },
  {
    id: 20,
    title: "The Ministry of Ungentlemanly Warfare",
    poster_path: "/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg",
    genres: [28, 12, 36],
  },
  {
    id: 21,
    title: "Young Woman and the Sea",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [18, 36, 10749],
  },
  {
    id: 22,
    title: "Challengers",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [18, 10749, 10402],
  },
  {
    id: 23,
    title: "Tarot",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [27, 53, 9648],
  },
  {
    id: 24,
    title: "Unsung Hero",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [18, 10402],
  },
  {
    id: 25,
    title: "The Garfield Movie",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [16, 35, 10751],
  },
  {
    id: 26,
    title: "Back to Black",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [18, 10402],
  },
  {
    id: 27,
    title: "The Beekeeper",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [28, 53, 80],
  },
  {
    id: 28,
    title: "Godzilla Minus One",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [28, 878, 53],
  },
  {
    id: 29,
    title: "Migration",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [16, 12, 35, 10751],
  },
  {
    id: 30,
    title: "Kung Fu Panda 4",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [16, 28, 35, 12],
  },
  {
    id: 31,
    title: "The First Omen",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [27, 9648, 53],
  },
  {
    id: 32,
    title: "Ghostbusters: Frozen Empire",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [12, 35, 14],
  },
  {
    id: 33,
    title: "Dune: Part Two",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [878, 12, 28],
  },
  {
    id: 34,
    title: "Madame Web",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [28, 878, 53],
  },
  {
    id: 35,
    title: "Monkey Man",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [28, 53, 18],
  },
  {
    id: 36,
    title: "The Iron Claw",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [18, 36],
  },
  {
    id: 37,
    title: "Oppenheimer",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [18, 36],
  },
  {
    id: 38,
    title: "Wonka",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [35, 10751, 14],
  },
  {
    id: 39,
    title: "Aquaman and the Lost Kingdom",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [28, 12, 14],
  },
  {
    id: 40,
    title: "Wish",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [16, 12, 14, 10751],
  },
  {
    id: 41,
    title: "The Marvels",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [28, 12, 878],
  },
  {
    id: 42,
    title: "Napoleon",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [36, 28, 18],
  },
  {
    id: 43,
    title: "Poor Things",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [18, 35, 878],
  },
  {
    id: 44,
    title: "The Hunger Games: The Ballad of Songbirds & Snakes",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [12, 18, 878],
  },
  {
    id: 45,
    title: "Wish Dragon",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [16, 35, 10751, 14],
  },
  {
    id: 46,
    title: "Elemental",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [16, 35, 10751, 10749],
  },
  {
    id: 47,
    title: "The Little Mermaid",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [12, 10751, 14, 10749],
  },
  {
    id: 48,
    title: "Barbie",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [35, 12, 14, 10751],
  },
  {
    id: 49,
    title: "The Super Mario Bros. Movie",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [16, 12, 10751, 14],
  },
  {
    id: 50,
    title: "Spider-Man: Across the Spider-Verse",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [16, 28, 12, 878],
  },
  {
    id: 51,
    title: "Guardians of the Galaxy Vol. 3",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [28, 12, 878],
  },
  {
    id: 52,
    title: "John Wick: Chapter 4",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [28, 53, 80],
  },
  {
    id: 53,
    title: "Mission: Impossible – Dead Reckoning Part One",
    poster_path: "/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    genres: [28, 12, 53],
  },
  {
    id: 54,
    title: "Fast X",
    poster_path: "/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg",
    genres: [28, 80, 53],
  },
  {
    id: 55,
    title: "Transformers: Rise of the Beasts",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    genres: [28, 12, 878],
  },
  {
    id: 56,
    title: "The Flash",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: [28, 12, 878],
  },
  {
    id: 57,
    title: "Indiana Jones and the Dial of Destiny",
    poster_path: "/zK2sFxZcelHJRPVr242rxy5VK4T.jpg",
    genres: [12, 28, 53],
  },
  {
    id: 58,
    title: "The Equalizer 3",
    poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    genres: [28, 53, 80],
  },
  {
    id: 59,
    title: "The Nun II",
    poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genres: [27, 53, 9648],
  },
  {
    id: 60,
    title: "Five Nights at Freddy's",
    poster_path: "/e1J2oNzSBdou01sUvriVuoYp0pJ.jpg",
    genres: [27, 53, 9648],
  },
];

const MovieContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 65px; /* Adjust based on Header height + 5px*/
`;

const Movie = () => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    // 초기 로딩 시 영화 리스트 불러오기
    console.log("Movie component mounted");
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
            movie.genres.some((genre) => selectedGenres.includes(genre)) ||
            selectedGenres.length === 0
        )}
      />
    </MovieContainer>
  );
};

export default Movie;
