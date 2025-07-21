import styled from "styled-components";
import TagSelector from "../components/TagSelector";
import MovieList from "../components/MovieList";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useMovieApi } from "../api/movie";
import { useTranslation } from "react-i18next";

interface styledType {
  $ismobile?: boolean;
}

const MovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 65px; /* Adjust based on Header height + 5px*/
`;

const Wrapper = styled.div<styledType>`
  width: ${(props) => (props.$ismobile ? "100%" : "80%")};
`;

const EmptyState = styled.div`
  /* color: #aaa; */
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;

  @media (max-width: 767px) {
    padding: 20px 0;
    font-size: 1em;
  }
`;

interface Movie {
  movieId: number;
  title: string;
  posterUrl: string;
  movieGenre: number[];
}

const Movie = () => {
  const { t } = useTranslation();
  const genres = [
    { id: 12, name: t("Adventure") },
    { id: 14, name: t("Fantasy") },
    { id: 16, name: t("Animation") },
    { id: 18, name: t("Drama") },
    { id: 27, name: t("Horror") },
    { id: 28, name: t("Action") },
    { id: 35, name: t("Comedy") },
    { id: 53, name: t("Thriller") },
    { id: 80, name: t("Crime") },
    { id: 99, name: t("Documentary") },
    { id: 878, name: t("Science Fiction") },
    { id: 9648, name: t("Mystery") },
    { id: 10749, name: t("Romance") },
    { id: 10751, name: t("Family") },
    { id: 10752, name: t("War") },
  ];
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { getMovies } = useMovieApi();

  const loadMoreMovies = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await getMovies(page, pageSize, selectedGenres);
      const newMovies = res.data.data.content as Movie[];
      console.log("Fetched movies:", page, pageSize, newMovies);
      setMovies((prev) => [...prev, ...newMovies]);
      setPage((prev) => prev + 1);
      if (res.data.data.last) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("영화 데이터를 불러오지 못했습니다", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   loadMoreMovies();
  // }, []);

  // useEffect(() => {
  //   loadMoreMovies();
  // }, [selectedGenres]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMovies();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <MovieContainer>
      <Wrapper $ismobile={isMobile}>
        <TagSelector
          isMobile={isMobile}
          tags={genres}
          selectedTags={selectedGenres}
          onChange={setSelectedGenres}
        />
        <MovieList
          isMobile={isMobile}
          movies={movies.filter(
            (movie) =>
              movie.movieGenre.some((genre) =>
                selectedGenres.includes(genre)
              ) || selectedGenres.length === 0
          )}
        />
        <div ref={observerRef} style={{ height: 1 }} /> {/* 감지용 sentinel */}
        {isLoading && <EmptyState>불러오는 중...</EmptyState>}
      </Wrapper>
    </MovieContainer>
  );
};

export default Movie;
