import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useEffect, useState } from "react";
import SurveyModal from "../components/SurveyModal";
import useHomeApi from "../api/home";
import { useMediaQuery } from "react-responsive";
import logo from "../assets/img/Logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface styleType {
  $ismobile: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Video = styled.iframe`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  border: none;
  outline: none;
  pointer-events: none;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100vw;
  height: auto;
  top: 77vh;
  overflow-x: hidden;
  background-color: transparent;
  margin-top: 10px;
  backdrop-filter: blur(2px);
  padding-bottom: 50px;
  z-index: 1000;
`;

const MovieContainer = styled.div`
  width: 100%;
  position: relative;
  right: 0px;
`;

const MoviesSlider = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  /* padding: 15px 0px; */
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 60px;
  overflow-y: hidden;
`;

const Movies = styled(motion.div)`
  display: inline-block;
  width: 250px;
  height: 150px;
  margin-right: 8px;
  background-color: transparent;
  text-align: center;
  line-height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
`;

const SkeletonBox = styled(motion.div)`
  display: inline-block;
  width: 250px;
  height: 150px;
  margin-right: 8px;
  border-radius: 10px;
  background: linear-gradient(90deg, #222222 25%, #444444 50%, #222222 75%);

  background-size: 200% 100%;
`;
const VideoSkeletonBox = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 130px;
  border-radius: 24px;
  background: linear-gradient(90deg, #222222 25%, #444444 50%, #222222 75%);
  background-size: 200% 100%;
  z-index: 2;
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
  border: none;
  cursor: pointer;
`;

const SliderTypeTxt = styled.span`
  font-size: 18px;
  font-weight: 400;
  margin-top: 30px;
  padding-left: 60px;
  color: ${({ theme }) => theme.textColor};
`;

const VideoHiddenContainer = styled(motion.div)<{ $image: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 130px;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0) 100%
    ),
    url(${(props) => props.$image});
  background-position: center;
  background-size: cover;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  margin-bottom: 100px;
  padding-left: 140px;
  font-size: 32;
  font-weight: bold;
  cursor: pointer;
`;

const Logo = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "80px" : "80px")};
  margin-right: 30px;
  cursor: pointer;
`;

const MoviePosterImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
`;
const TeaserTitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: auto;
  font-size: 40px;
  margin-top: 10px;
`;

const TeaserExplainContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 20px;
  margin-top: 20px;
`;

interface TeaserType {
  movieId: number;
  title: string;
  teaserUrl: string;
  plot: string;
  stillCutUrl: string;
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
  still_cut_url: string;
}

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { getHomeApi, searchHomeApi } = useHomeApi();
  const navigate = useNavigate();
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [isMovieLoading, setIsMovieLoading] = useState(true);

  const [teaser, setTeaser] = useState<TeaserType>({
    movieId: 0,
    title: "",
    teaserUrl: "",
    plot: "",
    stillCutUrl: "",
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
    setIsReviewLoading(true);
    setIsMovieLoading(true);
    const res = await getHomeApi();

    setTeaser(res.data.data.teaser);
    setTopLikeReviewList(res.data.data.topLikeReviewList);
    setTopPickMovieList(res.data.data.topPickMovieList);
    setBoxOfficeMovieList(res.data.data.boxOfficeMovieList);
    setDailyTopMovieList(res.data.data.dailyTopMovieList);
    setMonthlyTopMovieList(res.data.data.monthlyTopMovieList);
    setRecommendedMovieList(res.data.data.recommendedMovieList || []);
    setIsReviewLoading(false);
    setIsMovieLoading(false);
  };

  const searchData = async () => {
    const res = await searchHomeApi(keyword);
    setSearchedMovieList(res.data.data);
  };

  useEffect(() => {
    getHomeData();
    console.log("새로운 유저인가 : ", isNewUser);
  }, []);

  useEffect(() => {
    searchData();
    console.log(searchedMovieList);
  }, [keyword]);

  useEffect(() => {
    if (teaser.stillCutUrl === "") {
      setShowIframe(false);
    }
  }, [teaser.stillCutUrl]);

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

  const [showIframe, setShowIframe] = useState(false);

  return (
    <>
      {isNewUser && <SurveyModal setIsNewUser={setIsNewUser} />}
      <MainHeader
        keyword={keyword}
        setKeyword={setKeyword}
        setIsNewUser={setIsNewUser}
      />
      <MainContainer>
        <VideoContainer
          // onMouseEnter={() => setShowIframe(true)}
          // onMouseLeave={() => setShowIframe(false)}
          onMouseEnter={() => {
            if (teaser.stillCutUrl !== "") setShowIframe(true);
          }}
          onMouseLeave={() => {
            if (teaser.stillCutUrl !== "") setShowIframe(false);
          }}
        >
          {showIframe && (
            <Video
              width="100%"
              height="100%"
              src={`${teaser.teaserUrl}`}
              title="Teaser"
              allow="accelerometer; autoplay; encrypted-media"
              allowFullScreen
            />
          )}
          <AnimatePresence>
            {!showIframe &&
              (teaser.stillCutUrl ? (
                <VideoHiddenContainer
                  as={motion.div}
                  key="teaser"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.3 }}
                  $image={teaser.stillCutUrl}
                >
                  <Logo $ismobile={isMobile} src={logo} />
                  <TeaserTitleContainer>{teaser.title}</TeaserTitleContainer>
                  <TeaserExplainContainer>{teaser.plot}</TeaserExplainContainer>
                </VideoHiddenContainer>
              ) : (
                <VideoSkeletonBox
                  key="teaser-skeleton"
                  animate={{
                    backgroundPosition: ["200% 0", "-200% 0"],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
          </AnimatePresence>
        </VideoContainer>
        {keyword !== "" ? (
          searchedMovieList.length > 0 ? (
            <ListContainer>
              <MovieContainer>
                <SliderTypeTxt>
                  <span>검색 결과</span>
                </SliderTypeTxt>
                <MoviesSlider>
                  {searchedMovieList.map((movie, i) => (
                    <Movies
                      key={movie.movie_id ?? i}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 30px 30px rgba(0,0,0,0.25)",
                        zIndex: 10,
                        borderRadius: "15px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      }}
                      onClick={() => {
                        navigate(`/movie/${movie.movie_id}`);
                      }}
                    >
                      <MoviePosterImg
                        src={movie.still_cut_url}
                        alt={movie.title}
                      />
                    </Movies>
                  ))}
                </MoviesSlider>
              </MovieContainer>
            </ListContainer>
          ) : (
            <ListContainer>
              <MovieContainer>
                <SliderTypeTxt>
                  <span>검색 결과가 없습니다.</span>
                </SliderTypeTxt>
              </MovieContainer>
            </ListContainer>
          )
        ) : (
          <ListContainer>
            {reviewData.map(({ prefix, highlight }, idx) => (
              <MovieContainer key={idx}>
                <SliderTypeTxt>
                  {prefix} <strong>{highlight}</strong>
                </SliderTypeTxt>
                <MoviesSlider>
                  {isReviewLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonBox
                        key={i}
                        animate={{
                          backgroundPosition: ["200% 0", "-200% 0"],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ))
                  ) : reviewLists[idx] && reviewLists[idx].length > 0 ? (
                    reviewLists[idx].map((review, i) => (
                      <Movies
                        key={review.reviewId ?? i}
                        style={{ backgroundColor: "gray" }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 30px 30px rgba(0,0,0,0.25)",
                          zIndex: 10,
                          borderRadius: "15px",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 18,
                        }}
                      ></Movies>
                    ))
                  ) : (
                    <div>리뷰가 존재하지 않습니다.</div>
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
                  {isMovieLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonBox
                        key={i}
                        animate={{
                          backgroundPosition: ["200% 0", "-200% 0"],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ))
                  ) : movieLists[idx] && movieLists[idx].length > 0 ? (
                    movieLists[idx].map((movie, i) => (
                      <Movies
                        key={movie.movie_id ?? i}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 30px 30px rgba(0,0,0,0.25)",
                          zIndex: 10,
                          borderRadius: "15px",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 18,
                        }}
                        onClick={() => {
                          navigate(`/movie/${movie.movie_id}`);
                        }}
                      >
                        <MoviePosterImg
                          src={movie.still_cut_url}
                          alt={movie.title}
                        />
                      </Movies>
                    ))
                  ) : (
                    <div>영화가 존재하지 않습니다.</div>
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
