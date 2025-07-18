import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useEffect, useState } from "react";
import SurveyModal from "../components/SurveyModal";
import teaservideo from "../assets/video/teaser.mp4";
import useHomeApi from "../api/home";
import Review from "../components/Review";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const VideoContainer = styled.div`
  background-color: black;
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  scroll-snap-align: start;
  /* position: fixed; */
`;

const Video = styled.iframe`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100vw;
  height: auto;
  top: 77vh;
  overflow-x: hidden;
  /* background-color: ${({ theme }) => theme.backgroundColor}; */
  background-color: transparent;
  backdrop-filter: blur(8px);
  padding-bottom: 50px;
`;

const MovieContainer = styled.div`
  width: 100%;
  height: 210px;
  position: relative;
  margin-top: 20px;
  margin-left: 40px;
  right: 0px;
  background-color: transparent;
`;

const MoviesSlider = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  margin-top: 15px;
  background-color: transparent;
  overflow-y: hidden;
`;

const Movies = styled.div`
  display: inline-block;
  width: 250px;
  height: 150px;
  margin-right: 8px;
  background-color: #ddd;
  text-align: center;
  line-height: 120px;
  position: relative;
`;

const PreviousSlideBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  border: none;
  cursor: pointer;
`;

const NextSlideBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  /* right: 0px;
  top: 52px; */
  border: none;
  cursor: pointer;
`;

const SliderTypeTxt = styled.span`
  font-size: 18px;
  font-weight: 400;
  margin-top: 30px;
  color: ${({ theme }) => theme.textColor};
`;

interface TeaserType {
  movieId: number;
  title: string;
  teaserUrl: string;
}

interface TopLikeReviewListType {
  reviewId: number;
  reviewTitle: string;
  content: string;
  movieId: number;
  movieTitle: string;
}

interface MovieList {
  title: string;
  movie_id: number;
  poster_url: string;
}

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const { getHomeApi, searchHomeApi } = useHomeApi();

  const [teaser, setTeaser] = useState<TeaserType>({
    movieId: 0,
    title: "",
    teaserUrl: "",
  });

  const [topLikeReviewList, setTopLikeReviewList] = useState<
    TopLikeReviewListType[]
  >([]);

  const [topPickMovieList, setTopPickMovieList] = useState<MovieList[]>([]);
  const [boxOfficeMovieList, setBoxOfficeMovieList] = useState<MovieList[]>([]);
  const [dailyTopMovieList, setDailyTopMovieList] = useState<MovieList[]>([]);
  const [monthlyTopMovieList, setMonthlyTopMovieList] = useState<MovieList[]>(
    []
  );
  const [recommendedMovieList, setRecommendedMovieList] = useState<MovieList[]>(
    []
  );

  const [searchedMovieList, setSearchedMovieList] = useState<MovieList[]>([]);

  const getHomeData = async () => {
    const res = await getHomeApi();

    console.log(res);
    setTeaser(res.data.data.teaser);
    setTopLikeReviewList(res.data.data.topLikeReviewList);
    setTopPickMovieList(res.data.data.topPickMovieList);
    setBoxOfficeMovieList(res.data.data.boxOfficeMovieList);
    setDailyTopMovieList(res.data.data.dailyTopMovieList);
    setMonthlyTopMovieList(res.data.data.monthlyTopMovieList);
  };

  const searchData = async () => {
    const res = await searchHomeApi(keyword);
    setSearchedMovieList(res.data.data);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    searchData();
    console.log("검색 결과", searchedMovieList);
  }, [keyword]);

  const reviewData = [{ prefix: "사용자 좋아요", highlight: "TOP 10 리뷰" }];
  const movieData = [
    { prefix: "사용자 좋아요", highlight: "TOP 10 영화" },
    { prefix: "현재 상영작 박스 오피스", highlight: "TOP 10 영화" },
    { prefix: "일별 조회수", highlight: "TOP 10 영화" },
    { prefix: "월별 조회수", highlight: "TOP 10 영화" },
    { prefix: "추천 TOP 10 영화", highlight: "" },
  ];

  const reviewLists = [topLikeReviewList];
  const movieLists = [
    topPickMovieList, // 사용자 좋아요 TOP 10 영화
    boxOfficeMovieList, // 박스 오피스 TOP 10 영화
    dailyTopMovieList, // 일별 조회수 TOP 10 영화
    monthlyTopMovieList, // 월별 조회수 TOP 10 영화
    recommendedMovieList, // 추천 TOP 10 영화 (필요하다면 추가)
  ];

  useEffect(() => {
    console.log("사용자 좋아요 TOP 10 리뷰:", topLikeReviewList);
    console.log("사용자 좋아요 TOP 10 영화:", topPickMovieList);
    console.log(" 박스 오피스 TOP 10 영화:", boxOfficeMovieList);
    console.log("일별 조회수 TOP 10 영화:", dailyTopMovieList);
    console.log("월별 조회수 TOP 10 영화:", monthlyTopMovieList);
    console.log("추천 TOP 10 영화 (필요하다면 추가):", recommendedMovieList);
  }, [
    topLikeReviewList,
    topPickMovieList,
    boxOfficeMovieList,
    dailyTopMovieList,
    monthlyTopMovieList,
    recommendedMovieList,
  ]);

  return (
    <>
      {isNewUser && <SurveyModal setIsNewUser={setIsNewUser} />}
      <MainHeader keyword={keyword} setKeyword={setKeyword} />
      <MainContainer>
        <VideoContainer>
          <Video
            width="560"
            height="315"
            src="https://www.youtube.com/embed/g2ClO3O5QWA"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            // src={teaservideo}
            // autoPlay
            // muted
            // loop
            // playsInline
            // controls={false}
          />
        </VideoContainer>
        {keyword !== "" ? (
          <></>
        ) : (
          <ListContainer>
            {reviewData.map(({ prefix, highlight }, idx) => (
              <MovieContainer key={idx}>
                <SliderTypeTxt>
                  {prefix} <strong>{highlight}</strong>
                </SliderTypeTxt>
                <MoviesSlider>
                  {reviewLists[idx] && reviewLists[idx].length > 0 ? (
                    reviewLists[idx].map((review, reviewIdx) => (
                      <Movies key={review.movieId}>
                        {/* <img
                          src={movie.poster_url}
                          alt={movie.title}
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        /> */}
                      </Movies>
                    ))
                  ) : (
                    <div>영화 없음</div>
                  )}
                </MoviesSlider>
              </MovieContainer>
            ))}
            {movieData.map(({ prefix, highlight }, idx) => (
              <MovieContainer key={idx}>
                <SliderTypeTxt>
                  {prefix} <strong>{highlight}</strong>
                </SliderTypeTxt>
                <MoviesSlider>
                  {movieLists[idx] && movieLists[idx].length > 0 ? (
                    movieLists[idx].map((movie, movieIdx) => (
                      <Movies key={movie.movie_id}>
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </Movies>
                    ))
                  ) : (
                    <div>영화가 없습니다.</div>
                  )}
                </MoviesSlider>
              </MovieContainer>
            ))}
          </ListContainer>
        )}
      </MainContainer>
    </>
  );
};

export default Main;

{
  /* <PreviousSlideBtn>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </PreviousSlideBtn> */
}
{
  /* <NextSlideBtn>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </NextSlideBtn> */
}
