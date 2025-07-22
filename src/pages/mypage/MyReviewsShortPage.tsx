import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/Pagenation";

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

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
};

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

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const ITEMS_PER_PAGE = 10;

const MyReviewsShortPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetId } = useParams<{ targetId?: string }>();
  const targetUserId = targetId ? Number(targetId) : null;

  const [sortOrder, setSortOrder] = useState<"latest" | "likes" | "rating">("latest");
  const { mypageShortReview, updateShortReview, deleteShortReview, userInfoGet } = useMypageApi();

  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  // 사용자 프로필 정보 로드
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await userInfoGet();
        setUserProfile(res.data?.data || null);
      } catch (err) {
        console.error("[MyReviewsShortPage] 사용자 프로필 로드 실패:", err);
        setUserProfile(null);
      }
    };
    fetchUserProfile();
  }, [userInfoGet]);

  // 한줄평 로드 함수
  const loadShortReviews = useCallback(async () => {
    // targetUserId가 있으면 그걸로, 없으면 로그인 유저 ID로 요청
    const idToLoad = targetUserId ?? userProfile?.userId;

    if (!idToLoad) {
      console.warn("로드할 사용자 ID가 없습니다.");
      setShortReviews([]);
      return;
    }

    try {
      const res = await mypageShortReview(idToLoad);
      const shortReview = Array.isArray(res.data?.data?.shortReviews)
        ? res.data.data.shortReviews
        : [];
      setShortReviews(shortReview);
    } catch (err) {
      console.error("[MyReviewsShortPage] 한줄평 로드 실패:", err);
      setShortReviews([]);
    }
  }, [mypageShortReview, targetUserId, userProfile]);

  // 한줄평 로드 useEffect
  useEffect(() => {
    loadShortReviews();
  }, [loadShortReviews]);

  // 정렬된 한줄평 계산
  const sortedReviews = useMemo(() => {
    const arr = [...shortReviews];
    if (sortOrder === "latest") {
      return arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() -
          parseDateString(a.createdAt).getTime()
      );
    } else if (sortOrder === "likes") {
      return arr.sort((a, b) => b.likes - a.likes);
    } else if (sortOrder === "rating") {
      return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr;
  }, [shortReviews, sortOrder]);

  // 페이지네이션 정보 업데이트
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
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, endIdx);

  const handleReviewClick = (reviewId: string) => {
    navigate(`/reviews/short/${reviewId}`);
  };

  const handleEditReview = async (updatedReview: ShortReviewType) => {
    if (updatedReview.movieId == null) {
      alert("영화 ID가 없어 한줄평 수정 요청을 보낼 수 없습니다.");
      return;
    }
    if (!updatedReview.shortReviewId) {
      alert("한줄평 ID가 없어 수정 요청을 보낼 수 없습니다.");
      return;
    }

    try {
      await updateShortReview(updatedReview.movieId, updatedReview.shortReviewId, {
        content: updatedReview.content,
        rating: updatedReview.rating,
      });
      await loadShortReviews();
      alert("한줄평이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("한줄평 수정 실패:", error);
      alert("한줄평 수정에 실패했습니다.");
    }
  };

  const handleDeleteReview = async (movieId: number, reviewId: string) => {
    if (movieId == null) {
      alert("영화 ID가 없어 한줄평 삭제 요청을 보낼 수 없습니다.");
      return;
    }
    if (!reviewId) {
      alert("한줄평 ID가 없어 삭제 요청을 보낼 수 없습니다.");
      return;
    }

    if (window.confirm("이 한줄평을 정말 삭제할까요?")) {
      try {
        await deleteShortReview(movieId, reviewId);
        await loadShortReviews();
        alert("한줄평이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("한줄평 삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (!userProfile) {
    return (
      <PageContainer>
        <VideoBackground />
        <EmptyState>프로필 정보를 로드 중입니다...</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate("/mypage")}>
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
            {targetUserId
              ? `사용자 ${targetUserId}의 `
              : "내가 작성한 "}
            <PinkText>한줄평</PinkText>
          </PageTitle>
        </PageHeader>

        <SortOptions>
          <SortButton
            isActive={sortOrder === "latest"}
            onClick={() => handleSortChange("latest")}
          >
            최신순
          </SortButton>
          <SortButton
            isActive={sortOrder === "rating"}
            onClick={() => handleSortChange("rating")}
          >
            별점순
          </SortButton>
          <SortButton
            isActive={sortOrder === "likes"}
            onClick={() => handleSortChange("likes")}
          >
            좋아요순
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
                  onEdit={handleEditReview}
                  onDelete={() => handleDeleteReview(review.movieId, review.shortReviewId)}
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
            {targetUserId ? "사용자가 작성한 한줄평이 없습니다." : "작성한 한줄평이 없습니다."}
          </EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsShortPage;
