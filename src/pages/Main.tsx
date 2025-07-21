import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import SurveyModal from "../components/SurveyModal";
import useHomeApi from "../api/home";
import { useMediaQuery } from "react-responsive";
import logo from "../assets/img/Logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { KinoLogoPlaceholderSVG } from "../assets/svg/KinoLogoPlaceholder.tsx";
import { KinoPosterPlaceholderSVG } from "../assets/svg/KinoPosterPlaceholder.tsx";
import ProgressCircle from "../components/ProgressCycle.tsx";
import { useTranslation } from "react-i18next";

interface styleType {
  $ismobile: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const VideoContainer = styled.div<styleType>`
  width: 100%;
  height: ${(props) => (props.$ismobile ? " 30vh" : "80vh")};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: black;
`;

const Video = styled.iframe<styleType>`
  width: 100%;
  height: ${(props) => (props.$ismobile ? " 40vh" : "100vh")};
  object-fit: cover;
  border: none;
  outline: none;
  pointer-events: none;
`;

const ListContainer = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100vw;
  height: auto;
  top: ${(props) => (props.$ismobile ? "32vh" : " 77vh")};
  padding-top: ${(props) => (props.$ismobile ? "0px" : "15px")};
  overflow-x: hidden;
  background-color: #141414;
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

const MoviesSlider = styled.div<styleType>`
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: ${(props) => (props.$ismobile ? "30px" : "60px")};
  overflow-y: hidden;
`;

const Movies = styled(motion.div)<styleType>`
  display: inline-block;
  width: ${(props) => (props.$ismobile ? "180px" : "250px")};
  height: ${(props) => (props.$ismobile ? "110px" : "150px")};
  margin-right: 8px;
  background-color: transparent;
  text-align: center;
  line-height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
`;

const SkeletonBox = styled(motion.div)<styleType>`
  display: inline-block;
  width: ${(props) => (props.$ismobile ? "180px" : "250px")};
  height: ${(props) => (props.$ismobile ? "110px" : "150px")};
  margin-right: 8px;
  border-radius: 12px;
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

const SliderTypeTxt = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "16px;" : "18px")};
  font-weight: 400;
  margin-top: 15px;
  border-left: 4px solid #f06292;
  margin-left: ${(props) => (props.$ismobile ? "30px" : "60px")};
  padding-left: 10px;
  /* color: ${({ theme }) => theme.textColor}; */
  color: white;
`;

const VideoHiddenContainer = styled(motion.div)<{
  $image: string;
  $ismobile: boolean;
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 100px;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.5) 50%,
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
  padding-bottom: 10px;
  padding-left: ${(props) => (props.$ismobile ? "30px" : "140px")};
  font-size: 32;
  font-weight: bold;
  cursor: pointer;
`;

const Logo = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "49px" : "80px")};
  margin-left: ${(props) => (props.$ismobile ? "8px" : "0px")};
  cursor: pointer;
  margin-top: ${(props) => (props.$ismobile ? "95px" : "100px")};
`;

const MoviePosterImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
`;
const TeaserTitleContainer = styled.div<styleType>`
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: auto;
  font-size: ${(props) => (props.$ismobile ? "20px" : "40px")};
  margin-top: 10px;
`;

const TeaserExplainContainer = styled.div<styleType>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$ismobile ? 1 : 3)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  padding-left: 20px;
  font-size: ${(props) => (props.$ismobile ? "10px" : "20px")};
  margin-top: ${(props) => (props.$ismobile ? "5px" : "20px")};
  width: ${(props) => (props.$ismobile ? "88vw" : "640px")};
  max-width: 95vw;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const ModalContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3000;
  width: 30vw;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
`;
const ModalBox = styled(motion.div)`
  display: flex;
  width: 590px;
  /* height: 500px; */
  background-color: rgba(0, 0, 0, 0.7);
  border: 1.5px solid rgba(240, 98, 146, 0.4);
  border-radius: 20px;
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.53),
    0 0 0 2px rgba(229, 132, 165, 0.07);
  backdrop-filter: blur(12px) saturate(125%);
  padding: 38px 38px 34px 40px;
  gap: 36px;
  transition: box-shadow 0.22s cubic-bezier(0.44, 0.06, 0.36, 1);
`;

const ReviewModalBox = styled(motion.div)`
  display: flex;
  width: 590px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1.5px solid rgba(240, 98, 146, 0.4);
  border-radius: 20px;
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.53),
    0 0 0 2px rgba(229, 132, 165, 0.07);
  backdrop-filter: blur(12px) saturate(125%);
  padding: 38px 38px 34px 40px;
  gap: 36px;
  transition: box-shadow 0.22s cubic-bezier(0.44, 0.06, 0.36, 1);
`;

const MoviePoster = styled.img`
  width: 140px;
  min-width: 140px;
  max-width: 140px;
  height: 200px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(240, 98, 146, 1), 0 2px 14px 0 rgba(0, 0, 0, 1);
  background: #19191b;
  margin-right: 8px;
`;

const PosterWrapper = styled.div`
  width: 140px;
  min-width: 140px;
  max-width: 140px;
  height: 200px;
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(240, 98, 146, 1), 0 2px 14px 0 rgba(0, 0, 0, 1);
  background: #19191b;
  margin-right: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 3px;
  min-width: 0;
  width: 315px;
`;

const MovieTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
  letter-spacing: 0.32px;
  color: #fff;
  word-break: keep-all;
`;

const MovieGenre = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 3px;
`;

const GenreTag = styled.span<styleType>`
  background: rgba(240, 98, 146, 0.44);
  border-radius: 50px;
  padding: ${(props) =>
    props.$ismobile ? "2px 6px 2px 6px" : "3px 13px 2px 13px"};
  font-size: ${(props) => (props.$ismobile ? "5px" : "16px")};
  color: #f06292;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  font-weight: 700;
  letter-spacing: 0.16px;
  box-shadow: 0 2px 6px 0 rgba(240, 98, 146, 0.1);
  transition: background-color 0.18s;
  &:hover {
    background: rgba(240, 98, 146, 0.3);
  }
`;

const MoviePlot = styled.div`
  font-size: 16px;
  color: #eaeaea;
  line-height: 1.56;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  margin-bottom: 8px;
`;

const MovieMeta = styled.div`
  font-size: 15px;
  color: #b6b6b6;
  display: flex;
  gap: 22px;
  align-items: center;
  margin-top: 3px;
`;

const MoreBtn = styled.button`
  background: linear-gradient(90deg, #f06292 60%, #ff9f80 100%);
  color: white;
  font-weight: bold;
  border: none;
  width: 90px;
  height: 35px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 7px 10px; */
  padding-top: 2px;
  font-size: 13px;
  box-shadow: 0 3px 10px rgba(240, 98, 146, 0.11);
  cursor: pointer;
  margin-top: 16px;
  margin-left: auto;
  transition: filter 0.16s, transform 0.12s;
  padding-bottom: 6px;
  &:hover {
    filter: brightness(94%);
    transform: scale(1.05);
  }
`;

const TeaserMetaContainer = styled.div<styleType>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  margin: ${({ $ismobile }) => ($ismobile ? "6px 0 0 20px" : "26px 0 0 20px")};
  font-size: ${({ $ismobile }) => ($ismobile ? "6px" : "18px")};
  color: #c6c6c6;
`;

const TeaserGenre = styled.div`
  display: flex;
  gap: 8px;
`;

const TeaserBtnContainer = styled.div<styleType>`
  width: 100%;
  height: 100%;
  top: 82%;
  left: 0px;
  position: absolute;
  color: #c6c6c6;
  z-index: 5000;
`;

const TeaserDetailBtn = styled(motion.button)<styleType>`
  background: linear-gradient(90deg, #f06292 60%, #ff9f80 100%);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: ${(props) => (props.$ismobile ? "4px" : "15px")};
  width: ${(props) => (props.$ismobile ? "30px" : "100px")};
  height: ${(props) => (props.$ismobile ? "14px" : "40px")};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  padding-bottom: ${(props) => (props.$ismobile ? "0px" : "3px")};
  top: ${(props) => (props.$ismobile ? "7%" : "6%")};
  right: ${(props) => (props.$ismobile ? "35px" : "170px")};
  /* padding: ${({ $ismobile }) =>
    $ismobile ? "2px 6px" : "2px 13px 4px  13px"}; */
  font-size: ${({ $ismobile }) => ($ismobile ? "4px" : "13px")};
  cursor: pointer;
  overflow: hidden;
  z-index: 10;
`;

const ContentArea = styled.div`
  font-size: 1em;
  line-height: 1.6;
  width: 100%;
  /* min-height: 200px; */
  max-height: 300px;
  overflow: auto;
  white-space: pre-wrap;
  border: 1px solid #d9d9d9;
  border-radius: 15px;

  padding: 20px;
  img {
    max-width: 100%;
    object-fit: cover;
    height: auto;
    display: block;
  }
`;
interface TeaserType {
  movieId: number;
  title: string;
  teaserUrl: string;
  plot: string;
  stillCutUrl: string;
  releaseDate: string;
  runningTime: number;
  genres: string[];
}

interface TopLikeReviewListType {
  reviewId: number;
  reviewTitle: string;
  content: string;
  movieId: number;
  movieTitle: string;
  releaseDate: string;
  runningTime: number;
  plot: string;
  ageRating: string;
  genres: string[];
  stillCutUrl: string;
  posterUrl: string;
}

interface MovieList {
  title: string;
  movie_id: number;
  still_cut_url: string;
  poster_url: string;
  release_date: string;
  plot: string;
  running_time: number;
  genres: string[];
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
    releaseDate: "",
    runningTime: 0,
    genres: [],
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
  const [showIframe, setShowIframe] = useState(false);
  const [hoveredMovie, setHoveredMovie] = useState<MovieList | null>(null);
  const [hoveredReview, setHoveredReview] =
    useState<TopLikeReviewListType | null>(null);
  const [language, setLanguage] = useState<string | null>("");
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
    const lang = localStorage.getItem("language");
    setLanguage(lang);
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

  const reviewData = [
    {
      prefix: "userLikeTop10ReviewsPrefix",
      highlight: "userLikeTop10ReviewsHighlight",
    },
  ];
  const movieData = [
    {
      prefix: "userLikeTop10MoviesPrefix",
      highlight: "userLikeTop10MoviesHighlight",
    },
    {
      prefix: "currentBoxOfficePrefix",
      highlight: "currentBoxOfficeHighlight",
    },
    { prefix: "dailyTopPrefix", highlight: "dailyTopHighlight" },
    { prefix: "monthlyTopPrefix", highlight: "monthlyTopHighlight" },
    { prefix: "recommendedTopPrefix", highlight: "recommendedTopHighlight" },
  ];

  const reviewLists = [topLikeReviewList];
  const movieLists = [
    topPickMovieList, // 사용자 좋아요 TOP 10 영화
    boxOfficeMovieList, // 박스 오피스 TOP 10 영화
    dailyTopMovieList, // 일별 조회수 TOP 10 영화
    monthlyTopMovieList, // 월별 조회수 TOP 10 영화
    recommendedMovieList, // 추천 TOP 10 영화 (필요하다면 추가)
  ];
  // useEffect(() => {
  //   console.log(hoveredMovie);
  // }, [hoveredMovie]);
  const [reviewProgressIdx, setReviewProgressIdx] = useState<number | null>(
    null
  );
  const [reviewHoverProgress, setReviewHoverProgress] = useState(0);
  const reviewHoverTimer = useRef<number | null>(null);
  const reviewProgressTimer = useRef<number | null>(null);

  const [movieHoverProgress, setMovieHoverProgress] = useState(0);
  const movieHoverTimer = useRef<number | null>(null);
  const movieProgressTimer = useRef<number | null>(null);
  const [movieProgressKey, setMovieProgressKey] = useState<string | null>(null);

  const handleReviewHoverEnter = (i: number, review: TopLikeReviewListType) => {
    setReviewProgressIdx(i);
    setReviewHoverProgress(0);

    let start = Date.now();
    reviewProgressTimer.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min(100, (elapsed / 1000) * 100);
      setReviewHoverProgress(percent);
      if (percent >= 100) clearInterval(reviewProgressTimer.current!);
    }, 16);

    reviewHoverTimer.current = window.setTimeout(() => {
      setHoveredReview(review);
      setReviewHoverProgress(0);
      setReviewProgressIdx(null);
    }, 1000);
  };

  const handleReviewHoverLeave = () => {
    if (reviewHoverTimer.current) clearTimeout(reviewHoverTimer.current);
    if (reviewProgressTimer.current) clearInterval(reviewProgressTimer.current);
    setHoveredReview(null);
    setReviewHoverProgress(0);
    setReviewProgressIdx(null);
  };

  const handleMovieHoverEnter = (
    sliderKey: string,
    idx: number,
    movie: any
  ) => {
    const key = `${sliderKey}-${idx}`;
    setMovieProgressKey(key);
    setMovieHoverProgress(0);

    let start = Date.now();
    movieProgressTimer.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min(100, (elapsed / 1000) * 100);
      setMovieHoverProgress(percent);
      if (percent >= 100) clearInterval(movieProgressTimer.current!);
    }, 16);

    movieHoverTimer.current = window.setTimeout(() => {
      setHoveredMovie(movie);
      setMovieHoverProgress(0);
    }, 1000);
  };

  const handleMovieHoverLeave = () => {
    if (movieHoverTimer.current) clearTimeout(movieHoverTimer.current);
    if (movieProgressTimer.current) clearInterval(movieProgressTimer.current);
    setHoveredMovie(null);
    setMovieProgressKey(null);
    setMovieHoverProgress(0);
  };
  const { t } = useTranslation();
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
          onMouseEnter={() => {
            if (teaser.stillCutUrl !== "") setShowIframe(true);
          }}
          onMouseLeave={() => {
            if (teaser.stillCutUrl !== "") setShowIframe(false);
          }}
          $ismobile={isMobile}
        >
          {showIframe && (
            <Video
              width="100%"
              height="100%"
              src={`${teaser.teaserUrl}`}
              title="Teaser"
              allow="accelerometer; autoplay; encrypted-media"
              allowFullScreen
              $ismobile={isMobile}
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
                  $ismobile={isMobile}
                >
                  <Logo $ismobile={isMobile} src={logo} />
                  <TeaserTitleContainer $ismobile={isMobile}>
                    {teaser.title}
                  </TeaserTitleContainer>

                  <TeaserExplainContainer $ismobile={isMobile}>
                    {isMobile
                      ? teaser.plot.length > 30
                        ? teaser.plot.slice(0, 30) + "..."
                        : teaser.plot
                      : teaser.plot.length > 120
                      ? teaser.plot.slice(0, 120) + "..."
                      : teaser.plot}
                  </TeaserExplainContainer>

                  <TeaserMetaContainer $ismobile={isMobile}>
                    <span>
                      {t("releaseDate")}:{" "}
                      {teaser.releaseDate || t("releaseUpcoming")}
                    </span>
                    <span>
                      {t("runningTime")}:
                      {teaser.runningTime
                        ? ` ${teaser.runningTime}${t("minutes")}`
                        : t("releaseUpcoming")}
                    </span>
                  </TeaserMetaContainer>
                  <TeaserMetaContainer $ismobile={isMobile}>
                    <TeaserGenre>
                      {teaser.genres.map((g) => (
                        <GenreTag $ismobile={isMobile} key={g}>
                          {g}{" "}
                        </GenreTag>
                      ))}
                    </TeaserGenre>
                  </TeaserMetaContainer>
                  <TeaserBtnContainer
                    $ismobile={isMobile}
                    onMouseEnter={() => {
                      setShowIframe(false);
                    }}
                    onMouseLeave={() => {
                      setShowIframe(true);
                    }}
                  >
                    <TeaserDetailBtn
                      $ismobile={isMobile}
                      onClick={() => {
                        navigate(`/movie/${teaser.movieId}`);
                      }}
                      whileHover={{
                        filter: "brightness(93%)",
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.96,
                        filter: "brightness(87%)",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 8px 1px #f0629280, 0 3px 10px rgba(240,98,146,0.10)",
                          "0 0 20px 5px #f06292cc, 0 8px 22px rgba(240,98,146,0.17)",
                          "0 0 8px 1px #f0629280, 0 3px 10px rgba(240,98,146,0.10)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 1.7,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                        },
                        scale: { type: "spring", stiffness: 350, damping: 22 },
                        filter: { duration: 0.22 },
                      }}
                    >
                      {t("detailView")}
                    </TeaserDetailBtn>
                  </TeaserBtnContainer>
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
            <ListContainer $ismobile={isMobile}>
              <MovieContainer>
                <SliderTypeTxt
                  $ismobile={isMobile}
                  style={{ marginTop: "0px" }}
                >
                  <span>{t("searchResults")}</span>
                </SliderTypeTxt>
                <MoviesSlider $ismobile={isMobile}>
                  {searchedMovieList.map((movie, i) => (
                    <Movies
                      $ismobile={isMobile}
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
                      onMouseEnter={() =>
                        handleMovieHoverEnter("searched", i, movie)
                      }
                      onMouseLeave={handleMovieHoverLeave}
                    >
                      {movieProgressKey === `searched-${i}` &&
                        movieHoverProgress > 0 &&
                        movieHoverProgress < 100 && (
                          <ProgressCircle progress={movieHoverProgress} />
                        )}
                      {movie.still_cut_url ? (
                        <MoviePosterImg
                          src={movie.still_cut_url}
                          alt={movie.title}
                        />
                      ) : (
                        <KinoLogoPlaceholderSVG />
                      )}
                    </Movies>
                  ))}
                </MoviesSlider>
              </MovieContainer>
            </ListContainer>
          ) : (
            <ListContainer $ismobile={isMobile}>
              <MovieContainer>
                <SliderTypeTxt $ismobile={isMobile}>
                  <span>{t("noSearchResults")}</span>
                </SliderTypeTxt>
              </MovieContainer>
            </ListContainer>
          )
        ) : (
          <ListContainer $ismobile={isMobile}>
            {reviewData.map(({ prefix, highlight }, idx) => (
              <MovieContainer key={idx}>
                <SliderTypeTxt
                  $ismobile={isMobile}
                  style={{ marginTop: "0px" }}
                >
                  {t(prefix)} <strong>{t(highlight)}</strong>
                </SliderTypeTxt>
                <MoviesSlider $ismobile={isMobile}>
                  {isReviewLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonBox
                        $ismobile={isMobile}
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
                        $ismobile={isMobile}
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
                        onClick={() =>
                          navigate(`/community/${review.reviewId}`)
                        }
                        onMouseEnter={() => handleReviewHoverEnter(i, review)}
                        onMouseLeave={() => handleReviewHoverLeave()}
                      >
                        {reviewProgressIdx === i &&
                          reviewHoverProgress > 0 &&
                          reviewHoverProgress < 100 && (
                            <ProgressCircle progress={reviewHoverProgress} />
                          )}

                        {review.stillCutUrl ? (
                          <MoviePosterImg
                            src={review.stillCutUrl}
                            alt={review.movieTitle}
                          />
                        ) : (
                          <KinoLogoPlaceholderSVG />
                        )}
                      </Movies>
                    ))
                  ) : (
                    <div>{t("noReviews")}</div>
                  )}
                </MoviesSlider>
              </MovieContainer>
            ))}
            {movieData.map(({ prefix, highlight }, idx) => (
              <MovieContainer key={idx}>
                <SliderTypeTxt $ismobile={isMobile}>
                  {t(prefix)} <strong>{t(highlight)}</strong>
                </SliderTypeTxt>
                <MoviesSlider $ismobile={isMobile}>
                  {isMovieLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonBox
                        $ismobile={isMobile}
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
                        $ismobile={isMobile}
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
                        onMouseEnter={() =>
                          handleMovieHoverEnter(`slider${idx}`, i, movie)
                        }
                        onMouseLeave={() => handleMovieHoverLeave()}
                      >
                        {movieProgressKey === `slider${idx}-${i}` &&
                          movieHoverProgress > 0 &&
                          movieHoverProgress < 100 && (
                            <ProgressCircle progress={movieHoverProgress} />
                          )}
                        {movie.still_cut_url ? (
                          <MoviePosterImg
                            src={movie.still_cut_url}
                            alt={movie.title}
                          />
                        ) : (
                          <KinoLogoPlaceholderSVG />
                        )}
                      </Movies>
                    ))
                  ) : (
                    <div>{t("noMovies")}</div>
                  )}
                </MoviesSlider>
              </MovieContainer>
            ))}
          </ListContainer>
        )}
      </MainContainer>
      <AnimatePresence>
        {!isMobile && hoveredMovie && (
          <ModalContainer
            onMouseEnter={() => setHoveredMovie(hoveredMovie)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <ModalBox
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{
                duration: 0.22,
                ease: [0.44, 0.06, 0.36, 1],
              }}
            >
              {hoveredMovie.poster_url ? (
                <MoviePoster
                  src={hoveredMovie.poster_url}
                  alt={hoveredMovie.title}
                />
              ) : (
                <PosterWrapper>
                  <KinoPosterPlaceholderSVG />
                </PosterWrapper>
              )}

              <InfoSection>
                <MovieTitle>{hoveredMovie.title}</MovieTitle>
                <MovieGenre>
                  {(Array.isArray(hoveredMovie.genres)
                    ? hoveredMovie.genres
                    : []
                  ).map((g: string, idx: number) => (
                    <GenreTag $ismobile={isMobile} key={g + idx}>
                      {g.trim()}
                    </GenreTag>
                  ))}
                </MovieGenre>
                <MoviePlot>
                  {hoveredMovie.plot ? hoveredMovie.plot : t("noPlot")}
                </MoviePlot>
                <MovieMeta>
                  <span>
                    {language === "ko" ? (
                      <>
                        {t("releaseDate")}: {hoveredMovie.release_date}
                      </>
                    ) : (
                      <>
                        {t("releaseDate")}:<br />
                        {hoveredMovie.release_date}
                      </>
                    )}
                  </span>
                  <span>
                    {language === "ko" ? (
                      <>
                        {t("runningTime")}:{" "}
                        {hoveredMovie.running_time === 0
                          ? "- "
                          : hoveredMovie.running_time}
                        {t("minutes")}
                      </>
                    ) : (
                      <>
                        {t("runningTime")}:<br />
                        {hoveredMovie.running_time === 0
                          ? "- "
                          : hoveredMovie.running_time}
                        {t("minutes")}
                      </>
                    )}
                  </span>
                </MovieMeta>
                <MoreBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${hoveredMovie.movie_id}`);
                  }}
                >
                  {t("detailView")}
                </MoreBtn>
              </InfoSection>
            </ModalBox>
          </ModalContainer>
        )}

        {!isMobile && hoveredReview && (
          <ModalContainer
            style={{ width: "1200px" }}
            onMouseEnter={() => setHoveredReview(hoveredReview)}
            onMouseLeave={() => setHoveredReview(null)}
          >
            <ReviewModalBox
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{
                duration: 0.22,
                ease: [0.44, 0.06, 0.36, 1],
              }}
            >
              {hoveredReview.posterUrl ? (
                <MoviePoster
                  src={hoveredReview.posterUrl}
                  alt={hoveredReview.movieTitle}
                />
              ) : (
                <PosterWrapper>
                  <KinoPosterPlaceholderSVG />
                </PosterWrapper>
              )}

              <InfoSection>
                <MovieTitle>{hoveredReview.movieTitle}</MovieTitle>
                <MovieGenre>
                  {(Array.isArray(hoveredReview.genres)
                    ? hoveredReview.genres
                    : []
                  ).map((g: string, idx: number) => (
                    <GenreTag $ismobile={isMobile} key={g + idx}>
                      {g.trim()}
                    </GenreTag>
                  ))}
                </MovieGenre>
                <MoviePlot>
                  {hoveredReview.plot ? hoveredReview.plot : t("noReviews")}
                </MoviePlot>

                <MovieMeta>
                  <span>
                    {language === "ko" ? (
                      <>
                        {t("releaseDate")}: {hoveredReview.releaseDate}
                      </>
                    ) : (
                      <>
                        {t("releaseDate")}:<br />
                        {hoveredReview.releaseDate}
                      </>
                    )}
                  </span>
                  <span>
                    {language === "ko" ? (
                      <>
                        {t("runningTime")}:{" "}
                        {hoveredReview.runningTime === 0
                          ? "- "
                          : hoveredReview.runningTime}
                        {t("minutes")}
                      </>
                    ) : (
                      <>
                        {t("runningTime")}:<br />
                        {hoveredReview.runningTime === 0
                          ? "- "
                          : hoveredReview.runningTime}
                        {t("minutes")}
                      </>
                    )}
                  </span>
                </MovieMeta>
                {hoveredReview.content ? (
                  <ContentArea
                    dangerouslySetInnerHTML={{ __html: hoveredReview.content }}
                  />
                ) : (
                  t("noPlot")
                )}
                <MoreBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/community/${hoveredReview.reviewId}`);
                  }}
                  style={{ marginLeft: "85%" }}
                >
                  {t("detailView")}
                </MoreBtn>
              </InfoSection>
            </ReviewModalBox>
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Main;
