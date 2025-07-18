import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import useMyPageApi from "../../api/useMyPageApi";

import UserProfileSection from "../../components/mypage/UserProfileSection";
import ReviewCard from "../../components/mypage/ReviewCard";
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from "../../components/VideoBackground";

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

const SortButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$isActive ? "#e0e0e0" : "#888")};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  cursor: pointer;
  padding: 5px 0;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }

  ${(props) =>
    props.$isActive &&
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

export interface MyPageMainApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    nickname: string;
    image: string;
    shortReview: {
      shortReviewId: number;
      content: string;
      rating: number;
      movieTitle: string;
      createdAt: string;
      likes: number;
      userNickname: string;
      userProfileUrl: string;
    } | null;
    review: {
      reviewId: number;
      title: string;
      content: string;
      movieTitle: string;
      totalViews: number;
      createdAt: string;
      likes: number;
      comments: number;
    } | null;
    followers: number;
    following: number;
    myPickMoives: Array<{
      myPickId: number;
      movieTitle: string;
      posterUrl: string;
      director: string;
      releaseDate: string;
    }>;
  };
}

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

interface ShortReviewType {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

interface DetailReviewType {
  id: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  reviewer?: {
    id: string;
    nickname: string;
    image: string;
  };
}

interface FavoriteMovieType {
  id: string;
  title: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}

const MyPageMain: React.FC = () => {
  const navigate = useNavigate();
  const { fetchMyPageMainData } = useMyPageApi();

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [shortReviewSort, setShortReviewSort] = useState<
    "latest" | "likes" | "rating"
  >("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<
    "latest" | "views" | "likes"
  >("latest");

  useEffect(() => {
    const loadMyPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyPageMainData();

        if (data) {
          setUserProfile({
            nickname: data.nickname,
            profileImageUrl: data.image,
            followerCount: data.followers,
            followingCount: data.following,
          });

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
                reviewer: {
                  id: 'dummy',
                  nickname: data.nickname,
                  image: data.image,
                }
              },
            ]);
          } else {
            setDetailReviews([]);
          }

          setFavoriteMovies(
            data.myPickMoives.map((movie) => ({
              id: String(movie.myPickId),
              title: movie.movieTitle,
              director: movie.director,
              releaseDate: movie.releaseDate.substring(0, 4),
              posterUrl: movie.posterUrl,
            }))
          );
        } else {
          setError("마이페이지 데이터를 찾을 수 없습니다.");
        }
      } catch (err: any) {
        console.error("마이페이지 데이터 불러오기 실패:", err);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
          localStorage.removeItem("accessToken"); 
          navigate("/login"); 
          return;
        } else {
          setError("데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMyPageData();
  }, [fetchMyPageMainData, navigate]);

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

  if (!userProfile) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>마이페이지 데이터를 찾을 수 없습니다. 로그인 상태를 확인해주세요.</EmptyState>
      </MyPageContainer>
    );
  }

  return (
    <MyPageContainer>
      <VideoBackground />
      {userProfile && <UserProfileSection userProfile={userProfile} />}

      {/* 한줄평 섹션 */}
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
              $isActive={shortReviewSort === "latest"} // $isActive로 변경
              onClick={() => setShortReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              $isActive={shortReviewSort === "likes"} // $isActive로 변경
              onClick={() => setShortReviewSort("likes")}
            >
              좋아요순
            </SortButton>
            <SortButton
              $isActive={shortReviewSort === "rating"} // $isActive로 변경
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

      {/* 상세 리뷰 섹션 */}
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
              $isActive={detailReviewSort === "latest"} // $isActive로 변경
              onClick={() => setDetailReviewSort("latest")}
            >
              최신순
            </SortButton>
            <SortButton
              $isActive={detailReviewSort === "likes"} // $isActive로 변경
              onClick={() => setDetailReviewSort("likes")}
            >
              좋아요순
            </SortButton>
            <SortButton
              $isActive={detailReviewSort === "views"} // $isActive로 변경
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
                <ReviewCard key={review.id} review={review} type="detail" />
              ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 찜한 영화 섹션 */}
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
            <SortButton $isActive={true}>최신순</SortButton> {/* $isActive로 변경 */}
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