import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // 기존 axios 대신 커스텀 인스턴스 사용
import axiosInstance from "../../api/axiosInstance"; // 새로 생성한 axiosInstance 임포트

import UserProfileSection from "../../components/mypage/UserProfileSection";
import ReviewCard from "../../components/mypage/ReviewCard";
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from "../../components/VideoBackground";

// 백엔드 API 기본 URL은 이제 axiosInstance에서 관리하므로 여기서는 필요 없음
// const API_BASE_URL = "http://43.203.218.183:8080/api/data";

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;

  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
`;

const SectionWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    margin-left: 10px;
    font-size: 1.5em;
    color: #f0f0f0;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateX(5px);
    }
  }

  @media (max-width: 767px) {
    font-size: 1.4em;
  }
  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const SortOptions = styled.div`
  display: flex;
  gap: 10px;
  font-size: 0.9em;

  @media (max-width: 767px) {
    font-size: 0.8em;
  }
`;

const SortButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.isActive ? "#e0e0e0" : "#888")};
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  cursor: pointer;
  padding: 5px 0;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }

  ${(props) =>
    props.isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #e0e0e0;
    }
  `}
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 767px) {
    gap: 10px;
  }
`;

const EmptyState = styled.div`
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;

  @media (max-width: 767px) {
    padding: 20px 0;
    font-size: 1em;
  }
`;

const MovieCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding-top: 10px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;

// =======================================================
// 타입 정의 (백엔드 응답 스키마와 프런트엔드 컴포넌트 props에 맞춰 수정)
// =======================================================

// 백엔드 API 응답 데이터 구조에 맞춘 타입
interface MyPageMainApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    nickname: string;
    image: string; // 프로필 이미지 URL
    shortReview: { // 메인 페이지에 한줄평 하나만 보여주는 것으로 추정됩니다.
      shortReviewId: number;
      content: string;
      rating: number;
      movieTitle: string;
      createdAt: string;
      likes: number;
      userNickname: string;
      userProfileUrl: string; // 이 필드는 사용되지 않을 수 있지만, 일단 유지
    } | null; // 한줄평이 없을 수도 있으므로 null 허용
    review: { // 메인 페이지에 상세 리뷰 하나만 보여주는 것으로 추정됩니다.
      reviewId: number;
      title: string;
      content: string;
      movieTitle: string; // 상세 리뷰에 영화 제목 추가
      totalViews: number;
      createdAt: string;
      likes: number;
      comments: number;
      // 백엔드에서 reviewer 정보를 제공한다면 여기에 추가
      reviewer?: { 
        id: string;
        nickname: string;
        image: string;
      };
    } | null; // 상세 리뷰가 없을 수도 있으므로 null 허용
    followers: number;
    following: number;
    myPickMoives: Array<{ // 오타 수정: myPickMovies (myPickMoives -> myPickMovies)
      myPickId: number;
      movieTitle: string;
      posterUrl: string;
      director: string;
      releaseDate: string; // 백엔드 응답은 "2025-07-18" 형태
    }>;
  };
}

// UserProfileSection 컴포넌트에 전달될 props 타입
interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

// ReviewCard (ShortReview) 컴포넌트에 전달될 props 타입
interface ShortReviewType {
  id: string; // ReviewCard는 id를 string으로 받음
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

// ReviewCard (DetailReview) 컴포넌트에 전달될 props 타입
interface DetailReviewType {
  id: string; // ReviewCard는 id를 string으로 받음
  title: string;
  image?: string; // 백엔드 상세 리뷰 응답에 image 필드가 없음. DetailReviewCard에 필요하다면 추가 논의 필요.
  content: string;
  likes: number;
  views: number; // totalViews -> views
  comments: number;
  createdAt: string;
  reviewer?: { // MyPageMain에서 임시로 추가했으므로, DetailReviewCard가 이 필드를 꼭 필요로 한다면 API에 추가 요청
    id: string;
    nickname: string;
    image: string;
  };
  movieTitle?: string; // MyPageMain에서 직접 movieTitle을 넘겨줄 수 있도록 추가
}

// MovieCard 컴포넌트에 전달될 props 타입
interface FavoriteMovieType {
  id: string; // MovieCard는 id를 string으로 받음
  title: string; // movieTitle -> title
  director: string;
  releaseDate: string;
  posterUrl: string;
}

// =======================================================
// 메인 컴포넌트
// =======================================================
const MyPageMain: React.FC = () => {
  const navigate = useNavigate();

  // API 데이터 상태
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 정렬 상태 (기존 유지)
  const [shortReviewSort, setShortReviewSort] = useState<
    "latest" | "likes" | "rating"
  >("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<
    "latest" | "views" | "likes"
  >("latest");

  // API 호출 로직
  useEffect(() => {
    const fetchMyPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        // axios 대신 axiosInstance 사용
        const response = await axiosInstance.get<MyPageMainApiResponse>("/mypage/main");
        const data = response.data.data;

        // User Profile 매핑
        setUserProfile({
          nickname: data.nickname,
          profileImageUrl: data.image,
          followerCount: data.followers,
          followingCount: data.following,
        });

        // Short Reviews 매핑
        if (data.shortReview) {
          setShortReviews([
            {
              id: String(data.shortReview.shortReviewId),
              movieTitle: data.shortReview.movieTitle,
              content: data.shortReview.content,
              rating: data.shortReview.rating,
              likes: data.shortReview.likes,
              createdAt: data.shortReview.createdAt,
            },
          ]);
        } else {
          setShortReviews([]);
        }

        // Detail Reviews 매핑
        if (data.review) {
          setDetailReviews([
            {
              id: String(data.review.reviewId),
              title: data.review.title,
              content: data.review.content,
              likes: data.review.likes,
              views: data.review.totalViews,
              comments: data.review.comments,
              createdAt: data.review.createdAt,
              movieTitle: data.review.movieTitle, // API 응답에서 movieTitle 가져옴
              // 백엔드에서 reviewer 정보를 제공하면 data.review.reviewer를 직접 할당
              reviewer: data.review.reviewer || { 
                id: 'logged_in_user_id', // 실제 로그인한 유저 ID로 대체 필요
                nickname: data.nickname, 
                image: data.image 
              }, // MyPageMain은 본인 리뷰이므로 본인 프로필 정보 사용 가능
            },
          ]);
        } else {
          setDetailReviews([]);
        }

        // Favorite Movies 매핑
        setFavoriteMovies(
          data.myPickMoives.map((movie) => ({ // myPickMoives -> myPickMovies 로 수정
            id: String(movie.myPickId),
            title: movie.movieTitle,
            director: movie.director,
            releaseDate: movie.releaseDate.substring(0, 4),
            posterUrl: movie.posterUrl,
          }))
        );
      } catch (err) {
        console.error("마이페이지 데이터 불러오기 실패:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
        // 에러가 401 Unauthorized인 경우 로그인 페이지로 리다이렉트 등의 추가 처리
        // if (axios.isAxiosError(err) && err.response?.status === 401) {
        //   navigate('/login'); // 예시: 401 에러 시 로그인 페이지로 이동
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 정렬 로직 (API 데이터가 없는 경우를 대비하여 조건부 실행)
  const sortedShortReviews = userProfile && shortReviews.length > 0 ? [...shortReviews].sort((a, b) => {
    if (shortReviewSort === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (shortReviewSort === "likes") {
      return b.likes - a.likes;
    } else if (shortReviewSort === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  }) : [];

  const sortedDetailReviews = userProfile && detailReviews.length > 0 ? [...detailReviews].sort((a, b) => {
    if (detailReviewSort === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (detailReviewSort === "views") {
      return (b.views || 0) - (a.views || 0);
    } else if (detailReviewSort === "likes") {
      return b.likes - a.likes;
    }
    return 0;
  }) : [];

  // 로딩 및 에러 상태 처리
  if (loading) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>데이터를 불러오는 중입니다...</EmptyState>
      </MyPageContainer>
    );
  }

  if (error) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>{error}</EmptyState>
      </MyPageContainer>
    );
  }

  // 데이터가 없는데 로딩도 끝났을 때
  if (!userProfile && !error) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>마이페이지 데이터를 찾을 수 없습니다.</EmptyState>
      </MyPageContainer>
    );
  }

  return (
    <MyPageContainer>
      <VideoBackground />
      {userProfile && <UserProfileSection userProfile={userProfile} />}

      <SectionWrapper style={{ gridArea: "shortReview" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/reviews/short")}>
            내가 작성한<PinkText>한줄평</PinkText>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L15 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SectionTitle>
          <SortOptions>
            <SortButton
              isActive={shortReviewSort === "latest"}
              onClick={() => setShortReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "likes"}
              onClick={() => setShortReviewSort("likes")}
            >
              좋아요순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "rating"}
              onClick={() => setShortReviewSort("rating")}
            >
              별점순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedShortReviews.length > 0 ? (
            sortedShortReviews
              .slice(0, 3)
              .map((review: ShortReviewType) => (
                <ReviewCard key={review.id} review={review} type="short" />
              ))
          ) : (
            <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: "detailReview" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/reviews/detail")}>
            내가 작성한<PinkText>상세 리뷰</PinkText>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L15 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SectionTitle>
          <SortOptions>
            <SortButton
              isActive={detailReviewSort === "latest"}
              onClick={() => setDetailReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "likes"}
              onClick={() => setDetailReviewSort("likes")}
            >
              좋아요순
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "views"}
              onClick={() => setDetailReviewSort("views")}
            >
              조회순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedDetailReviews.length > 0 ? (
            sortedDetailReviews
              .slice(0, 3)
              .map((review: DetailReviewType) => (
                // DetailReviewCard에 movieTitle prop 전달
                <ReviewCard key={review.id} review={review} type="detail" />
              ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: "favoriteMovies" }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate("/mypage/movies/favorite")}>
            내가<PinkText>찜한 영화</PinkText>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L15 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SectionTitle>
          <SortOptions>
            <SortButton isActive={true}>최신순</SortButton>
          </SortOptions>
        </SectionHeader>
        <MovieCardGrid>
          {favoriteMovies.length > 0 ? (
            favoriteMovies
              .slice(0, 12)
              .map((movie: FavoriteMovieType) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
          ) : (
            <EmptyState>찜한 영화가 없습니다.</EmptyState>
          )}
        </MovieCardGrid>
      </SectionWrapper>
    </MyPageContainer>
  );
};

export default MyPageMain;