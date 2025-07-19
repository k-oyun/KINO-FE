import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import UserProfileSection from "../../components/mypage/UserProfileSection";
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import MovieCard from "../../components/mypage/MovieCard";

import useMypageApi from "../../api/mypage";
import VideoBackground from '../../components/VideoBackground';

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;

  display: flex;
  flex-direction: column;
  // gap: 25px;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
    gap: 15px;
  }
`;

const SectionWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  // border-radius: 8px;

  @media (max-width: 767px) {
    padding: 20px;
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
  /* gap은 각 카드 컴포넌트의 margin-bottom으로 처리 */

  @media (max-width: 767px) {
    /* gap: 10px; */
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

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface Follow {
  follower: number;
  following: number;
}

interface ShortReviewType {
  shortReviewId: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

// interface Reviewer {
//     id: string;
//     nickname: string;
//     image: string;
// }

interface DetailReviewType {
  reviewId: string;
  image: string;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  mine: boolean;
  liked: boolean;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
  // reviewer?: {
  //   id: string;
  //   nickname: string;
  //   image: string;
  // };

  reviewer: UserProfileType;
}

interface FavoriteMovieType {
  myPickId: string;
  movieTitle: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
};

const MyPageMain: React.FC = () => {
  const navigate = useNavigate();
  const [shortReviewSort, setShortReviewSort] = useState<
    "latest" | "rating" | "likes"
  >("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<
    "latest" | "views" | "likes"
  >("latest");

  const [userProfile, setUserProfile] = useState<UserProfileType>();
  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
  const [userFollow, setUserFollow] = useState<Follow>();

  const {
    mypageMyPickMovie,
    mypageReview,
    mypageShortReview,
    userInfoGet,
    getFollower,
    getFollowing,
  } = useMypageApi();

  useEffect(() => {
    const userDataGet = async () => {
      const res = await userInfoGet();
      setUserProfile(res.data.data);

      const userId = res.data.data.userId;
      if (userId) {
        console.log("userid : " + userId);
        const [followerRes, followingRes] = await Promise.all([
          getFollower(userId),
          getFollowing(userId),
        ]);

        const followData: Follow = {
          follower: followerRes.data.data.length,
          following: followingRes.data.data.length,
        };

        console.log(followerRes.data.data);
        console.log(followingRes.data.data);

        setUserFollow(followData);
      }
    };
    const myShortReviewGet = async () => {
      const res = await mypageShortReview();
      const shortReview = Array.isArray(res.data.data.shortReviews)
        ? res.data.data.shortReviews
        : [];
      setShortReviews(shortReview);
    };
    const myReviewGet = async () => {
      const res = await mypageReview();
      const review = Array.isArray(res.data.data.reviews)
        ? res.data.data.reviews
        : [];
      setDetailReviews(review);
    };
    const myPickGet = async () => {
      const res = await mypageMyPickMovie();
      const pick = Array.isArray(res.data.data.myPickMoives)
        ? res.data.data.myPickMoives
        : [];
      setFavoriteMovies(pick);
    };

    userDataGet();
    myPickGet();
    myReviewGet();
    myShortReviewGet();
  }, []);

  const sortedShortReviews = [...shortReviews].sort((a, b) => {
    if (shortReviewSort === "latest") {
      return (
        parseDateString(b.createdAt).getTime() -
        parseDateString(a.createdAt).getTime()
      );
    } else if (shortReviewSort === "likes") {
      return b.likes - a.likes;
    } else if (shortReviewSort === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  const sortedDetailReviews = [...detailReviews].sort((a, b) => {
    if (detailReviewSort === "latest") {
      return (
        parseDateString(b.createdAt).getTime() -
        parseDateString(a.createdAt).getTime()
      );
    } else if (detailReviewSort === "views") {
      return (b.totalViews || 0) - (a.totalViews || 0);
    } else if (detailReviewSort === "likes") {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  // 공통적인 카드 클릭 핸들러 (네비게이션)
  const handleShortReviewClick = (reviewId: string) => {
    navigate(`/mypage/reviews/short/${reviewId}`);
  };

  const handleDetailReviewClick = (reviewId: string) => {
    navigate(`/mypage/reviews/detail/${reviewId}`);
  };

  if (!userProfile || !userFollow) return null;

  return (
    <MyPageContainer>
      <VideoBackground />
      <UserProfileSection userProfile={userProfile} follow={userFollow} />

      {/* 내가 작성한 한줄평 섹션 */}
      <SectionWrapper>
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
              isActive={shortReviewSort === "rating"}
              onClick={() => setShortReviewSort("rating")}
            >
              별점순
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "likes"}
              onClick={() => setShortReviewSort("likes")}
            >
              좋아요순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedShortReviews && sortedShortReviews.length > 0 ? (
            sortedShortReviews.slice(0, 3).map((review: ShortReviewType) => (
              <ShortReviewCard
                key={review.shortReviewId}
                review={review}
                onClick={() => handleShortReviewClick(review.shortReviewId)}
              />
            ))
          ) : (
            <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 내가 작성한 상세 리뷰 섹션 */}
      <SectionWrapper>
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
              isActive={detailReviewSort === "views"}
              onClick={() => setDetailReviewSort("views")}
            >
              조회순
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "likes"}
              onClick={() => setDetailReviewSort("likes")}
            >
              좋아요순
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedDetailReviews && sortedDetailReviews.length > 0 ? (
            sortedDetailReviews.slice(0, 3).map((review: DetailReviewType) => (
              <DetailReviewCard
                key={review.reviewId}
                review={review}
                isMine={true}
                showProfile={true}
                onClick={() => handleDetailReviewClick(review.reviewId)}
              />
            ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 내가 찜한 영화 섹션 */}
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
          </SortOptions>        </SectionHeader>
        <MovieCardGrid>
          {favoriteMovies && favoriteMovies.length > 0 ? (
            favoriteMovies
              .slice(0, 12)
              .map((movie: FavoriteMovieType) => (
                <MovieCard key={movie.myPickId} movie={movie} />
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
