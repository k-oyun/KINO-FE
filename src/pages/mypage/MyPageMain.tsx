import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios는 그대로 사용

// 컴포넌트 임포트 (경로 확인 필요)
import UserProfileSection from "../../components/mypage/UserProfileSection";
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from "../../components/VideoBackground";

// API 훅 임포트
import useMypageApi from "../../api/mypage";

// 스타일드 컴포넌트
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
    gap: 15px;
  }
`;

const SectionWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;

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

const MovieCardGrid = styled.div<MovieCardGridProps>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding-top: 10px;

  ${(props) =>
    props.isEmpty &&
    `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 200px;
    padding: 0;
  `}

  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    ${(props) =>
      props.isEmpty &&
      `
      min-height: 150px;
    `}
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

// 인터페이스 정의
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
  movieId: number;
  shortReviewId: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

interface DetailReviewType {
  reviewId: number;
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
  reviewer: UserProfileType;
}

interface FavoriteMovieType {
  myPickId: string;
  movieTitle: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}

interface MovieCardGridProps {
  isEmpty?: boolean;
}

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3] ?? 0, parts[4] ?? 0);
};

const MyPageMain: React.FC = () => {
  const navigate = useNavigate();
  const [shortReviewSort, setShortReviewSort] = useState<"latest" | "rating" | "likes">("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<"latest" | "views" | "likes">("latest");

  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined); // 초기값을 undefined로 설정
  const [userFollow, setUserFollow] = useState<Follow | undefined>(undefined); // 초기값을 undefined로 설정

  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);

  const {
    mypageMyPickMovie,
    mypageReview,
    mypageShortReview,
    userInfoGet,
    getFollower,
    getFollowing,
    updateShortReview,
    deleteShortReview,
  } = useMypageApi();

  const loadUserProfileAndFollow = useCallback(async () => {
    try {
      const res = await userInfoGet();
      const profile: UserProfileType = res.data?.data;
      setUserProfile(profile);

      if (profile?.userId != null) {
        const [followerRes, followingRes] = await Promise.all([
          getFollower(profile.userId),
          getFollowing(profile.userId),
        ]);
        const followData: Follow = {
          follower: Array.isArray(followerRes.data?.data) ? followerRes.data.data.length : 0,
          following: Array.isArray(followingRes.data?.data) ? followingRes.data.data.length : 0,
        };
        setUserFollow(followData);
      } else {
        setUserFollow({ follower: 0, following: 0 });
      }
    } catch (error) {
      console.error("사용자 프로필 및 팔로우 정보 로드 실패:", error);
      setUserProfile(undefined);
      setUserFollow({ follower: 0, following: 0 });
    }
  }, [userInfoGet, getFollower, getFollowing]);

  const loadShortReviews = useCallback(async () => {
    if (userProfile?.userId == null) {
      console.warn("사용자 ID를 찾을 수 없어 한줄평을 로드할 수 없습니다.");
      setShortReviews([]);
      return;
    }

    try {
      const res = await mypageShortReview(userProfile.userId); // userId 사용
      const arr = Array.isArray(res.data?.data?.shortReviews) ? res.data.data.shortReviews : [];
      console.log("shortReviews raw:", arr);
      setShortReviews(arr);
    } catch (error) {
      console.error("한줄평 로드 실패:", error);
      setShortReviews([]);
    }
  }, [mypageShortReview, userProfile]); // userProfile 의존성 추가

  const loadDetailReviews = useCallback(async () => {
    if (userProfile?.userId == null) {
      console.warn("사용자 ID를 찾을 수 없어 상세 리뷰를 로드할 수 없습니다.");
      setDetailReviews([]);
      return;
    }
    try {
      const res = await mypageReview(userProfile.userId); // userId 사용
      const arr = Array.isArray(res.data?.data?.reviews) ? res.data.data.reviews : [];
      setDetailReviews(arr);
    } catch (error) {
      console.error("상세 리뷰 로드 실패:", error);
      setDetailReviews([]);
    }
  }, [mypageReview, userProfile]); // userProfile 의존성 추가

  const loadFavoriteMovies = useCallback(async () => {
    if (userProfile?.userId == null) {
      console.warn("사용자 ID를 찾을 수 없어 찜한 영화를 로드할 수 없습니다.");
      setFavoriteMovies([]);
      return;
    }
    try {
      const res = await mypageMyPickMovie(userProfile.userId); // userId 사용
      const arr = Array.isArray(res.data?.data?.myPickMovies) ? res.data.data.myPickMovies : [];
      setFavoriteMovies(arr);
    } catch (error) {
      console.error("찜한 영화 로드 실패:", error);
      setFavoriteMovies([]);
    }
  }, [mypageMyPickMovie, userProfile]); // userProfile 의존성 추가

  // 1. 프로필 정보 로드 (가장 먼저 실행)
  useEffect(() => {
    loadUserProfileAndFollow();
  }, [loadUserProfileAndFollow]);

  // 2. userProfile이 로드된 후에 다른 데이터를 로드
  useEffect(() => {
    if (userProfile?.userId != null) {
      (async () => {
        await Promise.allSettled([loadFavoriteMovies(), loadDetailReviews(), loadShortReviews()]);
      })();
    }
  }, [userProfile, loadFavoriteMovies, loadDetailReviews, loadShortReviews]); // userProfile을 의존성에 추가

  const sortedShortReviews = useMemo(() => {
    const arr = [...shortReviews];
    if (shortReviewSort === "latest") {
      arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() - parseDateString(a.createdAt).getTime()
      );
    } else if (shortReviewSort === "likes") {
      arr.sort((a, b) => b.likes - a.likes);
    } else if (shortReviewSort === "rating") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr;
  }, [shortReviews, shortReviewSort]);

  const sortedDetailReviews = useMemo(() => {
    const arr = [...detailReviews];
    if (detailReviewSort === "latest") {
      arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() - parseDateString(a.createdAt).getTime()
      );
    } else if (detailReviewSort === "views") {
      arr.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    } else if (detailReviewSort === "likes") {
      arr.sort((a, b) => b.likeCount - a.likeCount);
    }
    return arr;
  }, [detailReviews, detailReviewSort]);

  const handleShortReviewClick = (reviewId: string) => {
    navigate(`/mypage/reviews/short/${reviewId}`);
  };
  const handleDetailReviewClick = (reviewId: number) => {
    navigate(`/mypage/reviews/detail/${reviewId}`);
  };

  const handleEditShortReview = async (updated: ShortReviewType) => {
    // 1) 값 확인
    console.log("[handleEditShortReview] incoming updated:", updated);

    // 2) movieId와 shortReviewId 방어 로직 강화
    if (updated.movieId == null) {
      alert("영화 ID가 없어 한줄평 수정 요청을 보낼 수 없습니다. (movieId: null)");
      console.error("movieId is null for short review update:", updated);
      return;
    }
    if (updated.shortReviewId == null || updated.shortReviewId === '') {
        alert("한줄평 ID가 없어 수정 요청을 보낼 수 없습니다. (shortReviewId: null/empty)");
        console.error("shortReviewId is null/empty for short review update:", updated);
        return;
    }

    try {
      // 3) 호출 직전 로깅
      const payload = {
        content: updated.content,
        rating: updated.rating,
        // movieTitle: updated.movieTitle, // 서버가 받으면 주석 해제. 백엔드 API에 따라 다름.
      };
      console.log("[handleEditShortReview] PUT", {
        url: `/${updated.movieId}/short-reviews/${updated.shortReviewId}`,
        payload,
      });

      await updateShortReview(updated.movieId, updated.shortReviewId, payload);
      alert("한줄평이 성공적으로 수정되었습니다."); // 사용자에게 알림
      await loadShortReviews(); // 수정 후 목록 새로고침
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("[handleEditShortReview] status:", err.response?.status);
        console.error("[handleEditShortReview] resp data:", err.response?.data);
        console.error("[handleEditShortReview] req url:", err.config?.url);
        console.error("[handleEditShortReview] req data:", err.config?.data);
      }
      console.error("한줄평 수정 실패:", err);
      alert("한줄평 수정에 실패했습니다. 콘솔 로그를 확인하세요.");
    }
  };

  const handleDeleteShortReview = async (movieId: number, reviewId: string) => {
    console.log("[handleDeleteShortReview] movieId:", movieId, "reviewId:", reviewId);

    // 삭제 전 ID 유효성 검사 추가
    if (movieId == null) {
        alert("영화 ID가 없어 한줄평 삭제 요청을 보낼 수 없습니다. (movieId: null)");
        console.error("movieId is null for short review delete:", { movieId, reviewId });
        return;
    }
    if (reviewId == null || reviewId === '') {
        alert("한줄평 ID가 없어 삭제 요청을 보낼 수 없습니다. (reviewId: null/empty)");
        console.error("reviewId is null/empty for short review delete:", { movieId, reviewId });
        return;
    }

    // 사용자에게 삭제 확인 받기
    if (!window.confirm("정말로 이 한줄평을 삭제하시겠습니까?")) {
        return;
    }

    try {
      await deleteShortReview(movieId, reviewId);
      alert("한줄평이 성공적으로 삭제되었습니다."); // 사용자에게 알림
      await loadShortReviews(); // 삭제 후 목록 새로고침
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("[handleDeleteShortReview] status:", err.response?.status);
        console.error("[handleDeleteShortReview] resp data:", err.response?.data);
        console.error("[handleDeleteShortReview] req url:", err.config?.url);
        console.error("[handleDeleteShortReview] req method:", err.config?.method);
        console.error("[handleDeleteShortReview] req params:", err.config?.params);
      }
      console.error("한줄평 삭제 실패:", err);
      alert("한줄평 삭제에 실패했습니다. 콘솔 로그를 확인하세요.");
    }
  };

  // userProfile 또는 userFollow가 로드되기 전에는 로딩 상태를 표시
  if (!userProfile || !userFollow) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>프로필 정보를 로드 중입니다...</EmptyState>
      </MyPageContainer>
    );
  }

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
          {sortedShortReviews.length > 0 ? (
            // slice(0, 3)으로 최대 3개만 표시
            sortedShortReviews.slice(0, 3).map((review) => (
              <ShortReviewCard
                key={review.shortReviewId}
                review={review}
                onClick={() => handleShortReviewClick(review.shortReviewId)}
                onEdit={handleEditShortReview}
                onDelete={(movieId, reviewId) => handleDeleteShortReview(movieId, reviewId)}
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
          {sortedDetailReviews.length > 0 ? (
            // slice(0, 3)으로 최대 3개만 표시
            sortedDetailReviews.slice(0, 3).map((review) => (
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
      <SectionWrapper>
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
            {/* 찜한 영화는 현재 최신순만 가능하므로 isActive를 true로 고정 */}
            <SortButton isActive={true}>최신순</SortButton>
          </SortOptions>
        </SectionHeader>
        <MovieCardGrid isEmpty={favoriteMovies.length === 0}>
           {favoriteMovies.length > 0 ? (
             favoriteMovies.slice(0, 12).map((movie) => (
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