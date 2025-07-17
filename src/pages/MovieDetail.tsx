import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import GeneralMovieInfo from "../components/GeneralMovieInfo";
import TabSelector from "../components/TabSelector";
import MovieInfo from "../components/MovieInfo";
import ShortReview from "../components/ShortReview";
import Review from "../components/Review";
import { useParams } from "react-router-dom";

// const movieDetail = {
//   id: 603692,
//   title: "Inside Out 2",
//   original_title: "Inside Out 2",
//   overview:
//     "조이와 친구들이 돌아왔다! 라일리의 머릿속 감정 컨트롤 본부에 새로운 감정들이 등장하면서 벌어지는 유쾌한 모험.",
//   release_date: "2024-06-12",
//   runtime: 98,
//   genres: [
//     { id: 16, name: "Animation" },
//     { id: 35, name: "Comedy" },
//     { id: 10751, name: "Family" },
//   ],
//   poster_path: "/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
//   backdrop_path: "/u3YQJctMzFN2wAvnkmXy41bXhFv.jpg",
//   vote_average: 7.8,
//   vote_count: 1234,
//   adult: false,
//   status: "Released",
//   tagline: "새로운 감정, 새로운 모험!",
//   spoken_languages: [
//     { iso_639_1: "en", name: "English" },
//     { iso_639_1: "ko", name: "Korean" },
//   ],
//   production_countries: [
//     { iso_3166_1: "US", name: "United States of America" },
//   ],
//   production_companies: [
//     {
//       id: 3,
//       name: "Pixar",
//       logo_path: "/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png",
//       origin_country: "US",
//     },
//     {
//       id: 2,
//       name: "Walt Disney Pictures",
//       logo_path: "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
//       origin_country: "US",
//     },
//   ],
//   homepage: "https://movies.disney.com/inside-out-2",
//   imdb_id: "tt1234567",
// };

interface MovieDetail {
  movieId: number;
  title: string;
  plot: string;
  backdropUrl: string;
  releaseDate: string;
  runningTime: number;
  ageRating: boolean;
  avgRating: number;
  genres: string[];
  director: string;
  actors: [{ name: string; profileUrl: string }];
  otts: [{ name: string; logoUrl: string; linkUrl: string }];
  teaserUrl: string;
}

const MovieDetailContainer = styled.div`
  margin-top: 65px; /* 헤더 높이만큼 여백 */
`;

const Categories = styled.div<{ $ismobile: boolean }>`
  padding: ${(props) => (props.$ismobile ? "20px" : "20px 50px")};
`;

const tabs = [
  { id: "info", label: "작품정보" },
  { id: "shortReview", label: "한줄평" },
  { id: "review", label: "상세 리뷰" },
] as const;

type Tabs = (typeof tabs)[number]["id"];

const MovieDetail = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [selectedTab, setSelectedTab] = useState<Tabs>("info");
  const { id: movieId } = useParams<{ id: string }>();
  // const BASE_URL = process.env.REACT_APP_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);

  useEffect(() => {
    // 초기 정보 불러오기
    console.log(`Movie ID from params: ${movieId}`);
    const fetchMovieDetail = async () => {
      fetch(`${BASE_URL}/api/${movieId}/info`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched movie detail:", data);
          setMovieDetail(data.data);
        })
        .catch((error) => {
          console.error("Error fetching movie detail:", error.message);
        });
    };

    fetchMovieDetail().catch((error) => {
      console.error("Error fetching movie detail:", error);
    });
  }, []);

  return !movieDetail ? (
    <div>Loading...</div>
  ) : (
    <div>
      <MovieDetailContainer>
        <GeneralMovieInfo isMobile={isMobile} movieDetail={movieDetail} />
        <Categories $ismobile={isMobile}>
          <TabSelector
            isMobile={isMobile}
            tabs={tabs}
            selectedTab={selectedTab}
            onChange={setSelectedTab}
          />
          {selectedTab === "info" && (
            <MovieInfo isMobile={isMobile} movieDetail={movieDetail} />
          )}
          {selectedTab === "shortReview" && (
            <ShortReview isMobile={isMobile} movieId={movieDetail.movieId} />
          )}
          {selectedTab === "review" && (
            <Review isMobile={isMobile} movieId={movieDetail.movieId} />
          )}
        </Categories>
      </MovieDetailContainer>
    </div>
  );
};

export default MovieDetail;
