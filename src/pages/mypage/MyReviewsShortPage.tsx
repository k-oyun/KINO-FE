import React, { useEffect, useMemo, useState, useCallback } from "react"; // useCallback 추가
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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

// UserProfileType 인터페이스 추가 (userInfoGet에서 반환되는 타입)
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

// --- styled-components (변경 없음) ---
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
// --- styled-components 끝 ---

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const ITEMS_PER_PAGE = 10;

const MyReviewsShortPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"latest" | "likes" | "rating">(
    "latest"
  );
  const { mypageShortReview, updateShortReview, deleteShortReview, userInfoGet } = useMypageApi(); // userInfoGet 추가

  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null); // userProfile 상태 추가

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  // 사용자 프로필 정보를 가져오는 useEffect
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await userInfoGet();
        setUserProfile(res.data?.data || null);
      } catch (err) {
        console.error("[MyReviewsShortPage] 사용자 프로필 로드 실패:", err);
        setUserProfile(null); // 에러 발생 시 프로필 초기화
      }
    };
    fetchUserProfile();
  }, [userInfoGet]); // userInfoGet은 useCallback으로 메모이제이션되어 있으므로 의존성에 추가

  // 한줄평을 로드하는 useEffect (userProfile.userId에 의존)
  const loadShortReviews = useCallback(async () => {
    if (userProfile && userProfile.userId != null) {
      try {
        const res = await mypageShortReview(userProfile.userId); // userProfile.userId 사용
        const shortReview = Array.isArray(res.data?.data?.shortReviews)
          ? res.data.data.shortReviews
          : [];
        setShortReviews(shortReview);
      } catch (err) {
        console.error("[MyReviewsShortPage] 한줄평 로드 실패:", err);
        setShortReviews([]); // 에러 발생 시 빈 배열로 설정
      }
    } else if (userProfile === null) {
      console.log("사용자 프로필 로드 대기 중...");
    } else {
      console.warn("사용자 ID를 찾을 수 없어 한줄평을 로드할 수 없습니다.");
      setShortReviews([]);
    }
  }, [mypageShortReview, userProfile]); // mypageShortReview와 userProfile을 의존성에 추가

  // 사용자 프로필이 로드될 때 또는 변경될 때 한줄평 로드
  useEffect(() => {
    loadShortReviews();
  }, [loadShortReviews]); // loadShortReviews는 useCallback으로 메모이제이션되어 있으므로 안전

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
      const currentPage = prev.currentPage >= totalPages ? Math.max(0, totalPages - 1) : prev.currentPage;
      return {
        ...prev,
        currentPage,
        size: ITEMS_PER_PAGE,
        pageContentAmount: totalPages,
      };
    });
  }, [sortedReviews]); // 정렬된 리뷰 목록이 변경될 때마다 페이지네이션 정보 업데이트

  const handleSortChange = (order: "latest" | "likes" | "rating") => {
    setSortOrder(order);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 })); // 정렬 변경 시 첫 페이지로
  };

  const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, endIdx);

  const handleReviewClick = (reviewId: string) => {
    navigate(`/reviews/short/${reviewId}`);
  };

  const handleEditReview = async (updatedReview: ShortReviewType) => {
    // 유효성 검사 추가 (movieId와 shortReviewId는 필수)
    if (updatedReview.movieId == null) {
      alert("영화 ID가 없어 한줄평 수정 요청을 보낼 수 없습니다.");
      console.error("movieId is null for short review update:", updatedReview);
      return;
    }
    if (updatedReview.shortReviewId == null || updatedReview.shortReviewId === '') {
      alert("한줄평 ID가 없어 수정 요청을 보낼 수 없습니다.");
      console.error("shortReviewId is null/empty for short review update:", updatedReview);
      return;
    }

    try {
      await updateShortReview(updatedReview.movieId, updatedReview.shortReviewId, {
        // movieTitle은 일반적으로 수정 시 포함되지 않으므로 주석 처리
        // content와 rating만 보내는 경우가 많음
        content: updatedReview.content,
        rating: updatedReview.rating,
      });

      // 성공적으로 수정되면 서버에서 다시 데이터를 가져와 최신 상태로 업데이트
      await loadShortReviews();
      alert("한줄평이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("한줄평 수정 실패:", error);
      alert("한줄평 수정에 실패했습니다. 콘솔을 확인해주세요.");
    }
  };

  const handleDeleteReview = async (movieId: number, reviewId: string) => {
    // 유효성 검사 추가
    if (movieId == null) {
      alert("영화 ID가 없어 한줄평 삭제 요청을 보낼 수 없습니다.");
      console.error("movieId is null for short review delete:", { movieId, reviewId });
      return;
    }
    if (reviewId == null || reviewId === '') {
      alert("한줄평 ID가 없어 삭제 요청을 보낼 수 없습니다.");
      console.error("reviewId is null/empty for short review delete:", { movieId, reviewId });
      return;
    }

    if (window.confirm("이 한줄평을 정말 삭제할까요?")) {
      try {
        await deleteShortReview(movieId, reviewId);
        // 성공적으로 삭제되면 서버에서 다시 데이터를 가져와 최신 상태로 업데이트
        await loadShortReviews();
        alert("한줄평이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("한줄평 삭제 실패:", error);
        alert("삭제에 실패했습니다. 콘솔을 확인해주세요.");
      }
    }
  };

  // userProfile이 로드되기 전에는 로딩 상태를 표시
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
            내가 작성한 <PinkText>한줄평</PinkText>
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
                  // onDelete 콜백 함수 수정: movieId와 reviewId를 올바르게 전달
                  // onDelete={(reviewIdToDelete) => handleDeleteReview(review.movieId, reviewIdToDelete)}
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
          <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsShortPage;