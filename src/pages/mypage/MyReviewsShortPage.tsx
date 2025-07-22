import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/Pagenation";
import { useTranslation } from "react-i18next";

// ---------------- Types ----------------w
interface ShortReviewType {
  movieId: number;
  shortReviewId: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

// ---------------- Utils ----------------
const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3] ?? 0, parts[4] ?? 0);
};

// ---------------- Styled ----------------
const PageContainer = styled.div`
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

const SectionWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 25px;
  @media (max-width: 767px) {
    padding: 20px;
    margin-bottom: 15px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #f0f0f0;
  font-size: 2em;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateX(-5px);
  }
  svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 10px;
    align-self: flex-start;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;
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
  margin-bottom: 20px;
  justify-content: flex-end;
  @media (max-width: 767px) {
    font-size: 0.8em;
    justify-content: flex-start;
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

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  color: #aaa;
  text-align: center;
  font-size: 1.1em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 150px;
  padding: 0;
  @media (max-width: 767px) {
    font-size: 1em;
    min-height: 100px;
  }
`;

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;

// ---------------- Const ----------------
const ITEMS_PER_PAGE = 10;

// ---------------- Component ----------------
const MyReviewsShortPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { targetId: rawTargetId } = useParams<{ targetId?: string }>();

  const parsed = rawTargetId !== undefined ? Number(rawTargetId) : undefined;
  const targetUserId = rawTargetId && !Number.isNaN(parsed) ? parsed : undefined;

  const {
    mypageShortReview,
    updateShortReview,
    deleteShortReview,
    userInfoGet,
    mypageMain,
  } = useMypageApi();

  const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(null);
  const [targetUserNickname, setTargetUserNickname] = useState<string | null>(null);
  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "likes" | "rating">("latest");

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  // ---------------- Load Logged-in User ----------------
  useEffect(() => {
    (async () => {
      try {
        const res = await userInfoGet();
        setLoggedInUser(res.data?.data || null);
      } catch (err) {
        console.error("[MyReviewsShortPage] 로그인 사용자 로드 실패:", err);
        setLoggedInUser(null);
      }
    })();
  }, [userInfoGet]);

  // ---------------- Load Target Nickname (if viewing someone else) ----------------
  useEffect(() => {
    if (targetUserId == null) {
      setTargetUserNickname(null);
      return;
    }
    (async () => {
      try {
        const res = await mypageMain(targetUserId);
        const profile: UserProfileType | undefined = res.data?.data;
        setTargetUserNickname(profile?.nickname ?? t('mypage.shortReviews.userFallbackNickname', { userId: targetUserId }));
      } catch {
        setTargetUserNickname(t('mypage.shortReviews.userFallbackNickname', { userId: targetUserId }));
      }
    })();
  }, [targetUserId, mypageMain, t]);

  // ---------------- Load Short Reviews ----------------
  const loadShortReviews = useCallback(async () => {
    const idToLoad =
      targetUserId ??
      loggedInUser?.userId;

    if (idToLoad == null || Number.isNaN(idToLoad)) {
      console.warn("[MyReviewsShortPage] 로드할 사용자 ID가 없습니다.");
      setShortReviews([]);
      return;
    }

    try {
      const res = await mypageShortReview(idToLoad);
      const arr = Array.isArray(res.data?.data?.shortReviews)
        ? res.data.data.shortReviews
        : [];
      setShortReviews(arr);
    } catch (err) {
      console.error("[MyReviewsShortPage] 한줄평 로드 실패:", err);
      setShortReviews([]);
    }
  }, [mypageShortReview, targetUserId, loggedInUser]);

  useEffect(() => {
    if (!rawTargetId && !loggedInUser) return; 
    loadShortReviews();
  }, [rawTargetId, loggedInUser, loadShortReviews]);

  // ---------------- Owner 판단 ----------------
  const isOwner =
    targetUserId == null ||
    (loggedInUser?.userId != null && targetUserId === loggedInUser.userId);

  // ---------------- Sorting ----------------
  const sortedReviews = useMemo(() => {
    const arr = [...shortReviews];
    if (sortOrder === "latest") {
      arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() -
          parseDateString(a.createdAt).getTime()
      );
    } else if (sortOrder === "likes") {
      arr.sort((a, b) => b.likes - a.likes);
    } else if (sortOrder === "rating") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr;
  }, [shortReviews, sortOrder]);

  // ---------------- Pagination ----------------
  useEffect(() => {
    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
    setPageInfo((prev) => {
      const currentPage =
        prev.currentPage >= totalPages ? Math.max(0, totalPages - 1) : prev.currentPage;
      return {
        ...prev,
        currentPage,
        size: ITEMS_PER_PAGE,
        pageContentAmount: totalPages,
      };
    });
  }, [sortedReviews]);

  const handleSortChange = (order: "latest" | "likes" | "rating") => {
    setSortOrder(order);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ---------------- Handlers ----------------
  // TODO: window.confirm 대신 커스텀 모달 UI 사용
  const handleReviewClick = (reviewId: string) => {
    // TODO: 실제 한줄평 상세 페이지 경로로 바꾸세요.
    // 현재는 임시로 영화 상세나 그냥 마이페이지 뒤로 이동 등 처리 가능
    console.log("short review clicked:", reviewId);
  };

  const handleEditReview = async (updatedReview: ShortReviewType) => {
    if (!isOwner) return;

    if (updatedReview.movieId == null) {
      alert(t('mypage.shortReviews.edit.noMovieIdError'));
      return;
    }
    if (!updatedReview.shortReviewId) {
      alert(t('mypage.shortReviews.edit.noReviewIdError'));
      return;
    }

    try {
      await updateShortReview(updatedReview.movieId, updatedReview.shortReviewId, {
        content: updatedReview.content,
        rating: updatedReview.rating,
      });
      await loadShortReviews();
      alert(t('mypage.shortReviews.edit.success'));
    } catch (err) {
      console.error("[MyReviewsShortPage] 수정 실패:", err);
      alert(t('mypage.shortReviews.edit.failure'));
    }
  };

  const handleDeleteReview = async (movieId: number, reviewId: string) => {
    if (!isOwner) return;

    if (movieId == null) {
      alert(t('mypage.shortReviews.delete.noMovieIdError'));
      return;
    }
    if (!reviewId) {
      alert(t('mypage.shortReviews.delete.noReviewIdError'));
      return;
    }

    if (!window.confirm(t('mypage.shortReviews.delete.confirm'))) return;

    try {
      await deleteShortReview(movieId, reviewId);
      await loadShortReviews();
      alert(t('mypage.shortReviews.delete.success'));
    } catch (err) {
      console.error("[MyReviewsShortPage] 삭제 실패:", err);
      alert(t('mypage.shortReviews.delete.failure'));
    }
  };

  // ---------------- Render ----------------
  const titlePrefix = isOwner
    ? t('mypage.shortReviews.titlePrefix.my')
    : targetUserNickname
    ? t('mypage.shortReviews.titlePrefix.other', { nickname: targetUserNickname })
    : t('mypage.shortReviews.titlePrefix.user');

  if (!loggedInUser && targetUserId == null) {
    return (
      <PageContainer>
        <VideoBackground />
        <EmptyState>{t('mypage.shortReviews.loadingProfile')}</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton
            onClick={() =>
              navigate(
                isOwner
                  ? "/mypage"
                  : `/mypage/${targetUserId}`
              )
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L9 12L15 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackButton>
          <PageTitle>
            {titlePrefix} <PinkText>{t('shortReview')}</PinkText>
          </PageTitle>
        </PageHeader>

        <SortOptions>
          <SortButton
            isActive={sortOrder === "latest"}
            onClick={() => handleSortChange("latest")}
          >
            {t('Bylatest')}
          </SortButton>
          <SortButton
            isActive={sortOrder === "rating"}
            onClick={() => handleSortChange("rating")}
          >
            {t('Byrating')}
          </SortButton>
          <SortButton
            isActive={sortOrder === "likes"}
            onClick={() => handleSortChange("likes")}
          >
            {t('Bylikdes')}
          </SortButton>
        </SortOptions>

        {sortedReviews.length > 0 ? (
          <>
            <ReviewList>
              {currentPageReviews.map((review) => (
                <ShortReviewCard
                  key={review.shortReviewId}
                  review={review}
                  onClick={() => handleReviewClick(review.shortReviewId)}
                  onEdit={isOwner ? handleEditReview : undefined}
                  onDelete={isOwner ? handleDeleteReview : undefined}
                />
              ))}
            </ReviewList>

            {pageInfo.pageContentAmount > 1 && (
              <Pagination
                size={pageInfo.size}
                itemsPerPage={ITEMS_PER_PAGE}
                pageContentAmount={pageInfo.pageContentAmount}
                currentPage={pageInfo.currentPage}
                setPageInfo={setPageInfo}
                pageInfo={pageInfo}
                selectedOption={sortOrder}
              />
            )}
          </>
        ) : (
          <EmptyState>
            {t('mypage.shortReviews.emptyState')}
          </EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsShortPage;