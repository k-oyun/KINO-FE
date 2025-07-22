import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import UserProfileSection from "../../components/mypage/UserProfileSection";
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from "../../components/VideoBackground";

import useMypageApi from "../../api/mypage";
import { useTranslation } from "react-i18next";

// ---------- style --------------
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
    // gap: 15px;
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

const MovieCardGrid = styled.div<{ isEmpty?: boolean }>`
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

// ---------- type --------------
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
  userId: number;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  isMine: boolean;
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

// ---------- util --------------
const parseDateString = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(
    parts[0],
    (parts[1] || 1) - 1,
    parts[2] || 1,
    parts[3] ?? 0,
    parts[4] ?? 0
  );
};

const parseShortReviewDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  const isoTry = new Date(dateStr);
  if (!isNaN(isoTry.getTime())) return isoTry;
  return parseDateString(dateStr);
};

const getRelativeTime = (
  dateStr: string,
  t: (key: string, options?: Record<string, unknown>) => string,
  nowDate?: Date
): string => {
  const now = nowDate ?? new Date();
  const past = parseShortReviewDate(dateStr);
  const pastMs = past.getTime();
  if (isNaN(pastMs)) return dateStr;

  const diffSec = (now.getTime() - pastMs) / 1000;

  if (diffSec < 0) {
    const futureSec = Math.abs(diffSec);
    if (futureSec < 60) return t("mypage.relativeTime.soon");
    if (futureSec < 3600)
      return t("mypage.relativeTime.minutesLater", {
        count: Math.floor(futureSec / 60),
      });
    if (futureSec < 86400)
      return t("mypage.relativeTime.hoursLater", {
        count: Math.floor(futureSec / 3600),
      });
    return t("mypage.relativeTime.daysLater", {
      count: Math.floor(futureSec / 86400),
    });
  }

  if (diffSec < 60) return t("mypage.relativeTime.justNow");
  if (diffSec < 3600)
    return t("mypage.relativeTime.minutesAgo", {
      count: Math.floor(diffSec / 60),
    });
  if (diffSec < 86400)
    return t("mypage.relativeTime.hoursAgo", {
      count: Math.floor(diffSec / 3600),
    });

  const diffDay = Math.floor(diffSec / 86400);
  if (diffDay < 30) return t("mypage.relativeTime.daysAgo", { count: diffDay });

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return t("mypage.relativeTime.monthsAgo", { count: diffMonth });

  const diffYear = Math.floor(diffMonth / 12);
  return t("mypage.relativeTime.yearsAgo", { count: diffYear });
};

// ---------- component --------------
const MyPageMain: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { targetId } = useParams<{ targetId?: string }>();

  const [shortReviewSort, setShortReviewSort] = useState<
    "latest" | "rating" | "likes"
  >("latest");
  const [detailReviewSort, setDetailReviewSort] = useState<
    "latest" | "views" | "likes"
  >("latest");

  const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(
    null
  );

  const [viewedUser, setViewedUser] = useState<UserProfileType | null>(null);
  const [viewedFollow, setViewedFollow] = useState<Follow | null>(null);

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
    mypageMain,
  } = useMypageApi();

  /* ------------------ 데이터 로딩 ------------------ */
  const loadLoggedInUser = useCallback(async () => {
    try {
      const res = await userInfoGet();
      setLoggedInUser(res.data?.data ?? null);
    } catch (err) {
      console.error("로그인 사용자 정보 로드 실패:", err);
      setLoggedInUser(null);
    }
  }, [userInfoGet]);

  const loadViewedUserAndFollow = useCallback(
    async (uid: number) => {
      try {
        const res = await mypageMain(uid);
        console.log("viewedUser: ", res.data.data);
        setViewedUser(res.data?.data ?? null);

        const [followerRes, followingRes] = await Promise.all([
          getFollower(uid),
          getFollowing(uid),
        ]);
        setViewedFollow({
          follower: Array.isArray(followerRes.data?.data)
            ? followerRes.data.data.length
            : 0,
          following: Array.isArray(followingRes.data?.data)
            ? followingRes.data.data.length
            : 0,
        });
      } catch (error) {
        console.error("페이지 주인 정보 로드 실패:", error);
        setViewedUser(null);
        setViewedFollow({ follower: 0, following: 0 });
      }
    },
    [mypageMain, getFollower, getFollowing]
  );

  const loadShortReviews = useCallback(
    async (uid: number) => {
      try {
        const res = await mypageShortReview(uid);
        setShortReviews(
          Array.isArray(res.data?.data?.shortReviews)
            ? res.data.data.shortReviews
            : []
        );
      } catch (error) {
        console.error("한줄평 로드 실패:", error);
        setShortReviews([]);
      }
    },
    [mypageShortReview]
  );

  const loadDetailReviews = useCallback(
    async (uid: number) => {
      try {
        const res = await mypageReview(uid);
        setDetailReviews(
          Array.isArray(res.data?.data?.reviews) ? res.data.data.reviews : []
        );
      } catch (error) {
        console.error("상세 리뷰 로드 실패:", error);
        setDetailReviews([]);
      }
    },
    [mypageReview]
  );

  const loadFavoriteMovies = useCallback(
    async (uid: number) => {
      try {
        const res = await mypageMyPickMovie(uid);
        setFavoriteMovies(
          Array.isArray(res.data?.data?.myPickMovies)
            ? res.data.data.myPickMovies
            : []
        );
        console.log("찜한 영화 로드 성공:", res.data.data.myPickMovies);
      } catch (error) {
        console.error("찜한 영화 로드 실패:", error);
        setFavoriteMovies([]);
      }
    },
    [mypageMyPickMovie]
  );

  /* ------------------ Effect ------------------ */
  useEffect(() => {
    loadLoggedInUser();
  }, [loadLoggedInUser]);

  useEffect(() => {
    if (!loggedInUser) return;
    const uid = targetId ? Number(targetId) : loggedInUser.userId;
    const finalUid = isNaN(uid) ? loggedInUser.userId : uid;

    loadViewedUserAndFollow(finalUid);
    loadShortReviews(finalUid);
    loadDetailReviews(finalUid);
    loadFavoriteMovies(finalUid);
  }, [
    loggedInUser,
    targetId,
    loadViewedUserAndFollow,
    loadShortReviews,
    loadDetailReviews,
    loadFavoriteMovies,
  ]);

  /* ------------------ 메모 / 정렬 ------------------ */
  const isOwner = useMemo(() => {
    if (!loggedInUser) return false;
    if (!targetId) return true;
    const tid = Number(targetId);
    if (Number.isNaN(tid)) return false;
    return tid === loggedInUser.userId;
  }, [loggedInUser, targetId]);

  const sortedShortReviews = useMemo(() => {
    const arr = [...shortReviews];
    if (shortReviewSort === "latest") {
      arr.sort(
        (a, b) =>
          parseShortReviewDate(b.createdAt).getTime() -
          parseShortReviewDate(a.createdAt).getTime()
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
          parseDateString(b.createdAt).getTime() -
          parseDateString(a.createdAt).getTime()
      );
    } else if (detailReviewSort === "views") {
      arr.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    } else if (detailReviewSort === "likes") {
      arr.sort((a, b) => b.likeCount - a.likeCount);
    }
    return arr;
  }, [detailReviews, detailReviewSort]);

  const displayShortReviews = useMemo(() => {
    const now = new Date();
    return sortedShortReviews.map((r) => ({
      ...r,
      createdAt: getRelativeTime(r.createdAt, t, now),
    }));
  }, [sortedShortReviews, t]);

  const displayDetailReviews = sortedDetailReviews;

  /* ------------------ 핸들러 ------------------ */
  const handleDetailReviewCardClick = (reviewId: number) => {
    navigate(`/reviews/detail/${reviewId}`);
  };

  const handleEditShortReview = async (updated: ShortReviewType) => {
    if (!updated.shortReviewId || updated.movieId == null) return;
    try {
      const payload = { content: updated.content, rating: updated.rating };
      await updateShortReview(updated.movieId, updated.shortReviewId, payload);
      alert(t("mypage.main.shortReviewEdit.success"));
      if (viewedUser?.userId) loadShortReviews(viewedUser.userId);
    } catch (err) {
      console.error("한줄평 수정 실패:", err);
      alert(t("mypage.main.shortReviewEdit.failure"));
    }
  };

  const handleDeleteShortReview = async (movieId: number, reviewId: string) => {
    if (!reviewId || movieId == null) return;
    try {
      if (!window.confirm(t("mypage.shortReviews.delete.confirm"))) return; // 기존 키 재사용

      await deleteShortReview(movieId, reviewId);
      alert(t("mypage.main.shortReviewDelete.success"));
      if (viewedUser?.userId) loadShortReviews(viewedUser.userId);
    } catch (err) {
      console.error("한줄평 삭제 실패:", err);
      alert(t("mypage.main.shortReviewDelete.failure"));
    }
  };

  /* --- 페이지 이동 헬퍼 함수 --- */
  const goShortReviewsPage = useCallback(() => {
    if (isOwner) {
      navigate("/mypage/reviews/short");
    } else if (viewedUser?.userId) {
      navigate(`/mypage/reviews/short/${viewedUser.userId}`);
    } else {
      console.warn(t("mypage.main.navigation.noShortReviewPage"));
    }
  }, [isOwner, viewedUser, navigate, t]);

  const goDetailReviewsPage = useCallback(() => {
    if (isOwner) {
      navigate("/mypage/reviews/detail");
    } else if (viewedUser?.userId) {
      navigate(`/mypage/reviews/detail/${viewedUser.userId}`);
    } else {
      console.warn(t("mypage.main.navigation.noDetailReviewPage"));
    }
  }, [isOwner, viewedUser, navigate, t]);

  const goFavoritesPage = useCallback(() => {
    if (isOwner) {
      navigate("/mypage/movies/favorite");
    } else if (viewedUser?.userId) {
      navigate(`/mypage/movies/favorite/${viewedUser.userId}`);
    } else {
      console.warn(t("mypage.main.navigation.noFavoriteMoviesPage"));
    }
  }, [isOwner, viewedUser, navigate, t]);

  /* ------------------ 렌더 ------------------ */
  if (!viewedUser || !viewedFollow) {
    return (
      <MyPageContainer>
        <VideoBackground />
        <EmptyState>{t("mypage.main.loadingProfile")}</EmptyState>
      </MyPageContainer>
    );
  }

  return (
    <MyPageContainer>
      <VideoBackground />
      <UserProfileSection
        userProfile={viewedUser}
        follow={viewedFollow}
        isOwner={isOwner}
      />

      {/* 한줄평 */}
      <SectionWrapper>
        <SectionHeader>
          {/* SectionTitle 클릭 시 한줄평 목록 페이지로 이동 */}
          <SectionTitle onClick={goShortReviewsPage}>
            {isOwner
              ? t("mypage.main.shortReviewSection.titlePrefix.my")
              : t("mypage.main.shortReviewSection.titlePrefix.other", {
                  nickname: viewedUser.nickname,
                })}
            <PinkText>{t("shortReview")}</PinkText>
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
              {t("Bylatest")}
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "rating"}
              onClick={() => setShortReviewSort("rating")}
            >
              {t("Byrating")}
            </SortButton>
            <SortButton
              isActive={shortReviewSort === "likes"}
              onClick={() => setShortReviewSort("likes")}
            >
              {t("Bylikdes")}
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {displayShortReviews.length > 0 ? (
            displayShortReviews
              .slice(0, 3)
              .map((review) => (
                <ShortReviewCard
                  key={review.shortReviewId}
                  review={review}
                  onClick={goShortReviewsPage}
                  onEdit={isOwner ? handleEditShortReview : undefined}
                  onDelete={isOwner ? handleDeleteShortReview : undefined}
                  isOwner={isOwner}
                />
              ))
          ) : (
            <EmptyState>
              {t("mypage.main.shortReviewSection.emptyState")}
            </EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 상세 리뷰 */}
      <SectionWrapper>
        <SectionHeader>
          {/* SectionTitle 클릭 시 상세 리뷰 목록 페이지로 이동 */}
          <SectionTitle onClick={goDetailReviewsPage}>
            {isOwner
              ? t("mypage.main.detailedReviewSection.titlePrefix.my")
              : t("mypage.main.detailedReviewSection.titlePrefix.other", {
                  nickname: viewedUser.nickname,
                })}
            <PinkText>{t("detailedReview")}</PinkText>
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
              {t("Bylatest")}
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "views"}
              onClick={() => setDetailReviewSort("views")}
            >
              {t("Byviews")}
            </SortButton>
            <SortButton
              isActive={detailReviewSort === "likes"}
              onClick={() => setDetailReviewSort("likes")}
            >
              {t("Bylikdes")}
            </SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {displayDetailReviews.length > 0 ? (
            displayDetailReviews
              .slice(0, 3)
              .map((review) => (
                <DetailReviewCard
                  key={review.reviewId}
                  review={{ ...review, userImage: review.userProfile }}
                  isMine={isOwner}
                  showProfile={true}
                  onClick={() => handleDetailReviewCardClick(review.reviewId)}
                />
              ))
          ) : (
            <EmptyState>
              {t("mypage.main.detailedReviewSection.emptyState")}
            </EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      {/* 찜한 영화 */}
      <SectionWrapper>
        <SectionHeader>
          {/* SectionTitle 클릭 시 찜한 영화 목록 페이지로 이동 */}
          <SectionTitle onClick={goFavoritesPage}>
            {isOwner
              ? t("mypage.main.favoriteMoviesSection.titlePrefix.my")
              : t("mypage.main.favoriteMoviesSection.titlePrefix.other", {
                  nickname: viewedUser.nickname,
                })}
            <PinkText>{t("myPickMovies")}</PinkText>
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
            <SortButton isActive={true}>{t("Bylatest")}</SortButton>{" "}
            {/* 찜한 영화는 최신순만 있음 */}
          </SortOptions>
        </SectionHeader>
        <MovieCardGrid isEmpty={favoriteMovies.length === 0}>
          {favoriteMovies.length > 0 ? (
            favoriteMovies
              .slice(0, 12)
              .map((movie) => <MovieCard key={movie.myPickId} movie={movie} />)
          ) : (
            <EmptyState>
              {t("mypage.main.favoriteMoviesSection.emptyState")}
            </EmptyState>
          )}
        </MovieCardGrid>
      </SectionWrapper>
    </MyPageContainer>
  );
};

export default MyPageMain;
