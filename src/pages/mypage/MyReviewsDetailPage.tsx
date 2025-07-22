import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // useParams는 사용하지 않으므로 제거
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/Pagenation";

interface UserProfileType {
  userId: number; // API에서 이 필드를 받아올 예정이라고 하셨으므로 유지
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface DetailReviewType {
  reviewId: number;
  image: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  userProfile: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  userNickname: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  title: string;
  content: string;
  mine: boolean; // 로그인한 사용자 본인의 리뷰인지 여부
  liked: boolean;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
  reviewer: UserProfileType; // 리뷰를 작성한 유저의 프로필 정보
}

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

/** 한 페이지에 보여줄 상세 리뷰 수. 상세카드는 길이가 길 수 있으니 필요 시 조정하세요. */
const ITEMS_PER_PAGE = 5; // ← 카드 길이를 감안해 5 추천; 짧게 보이려면 10 등으로 변경

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  // Date 생성자에 월은 0부터 시작하므로 -1 해줍니다. 시/분은 선택적으로 처리
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3] ?? 0, parts[4] ?? 0);
};

// --- styled-components (이 부분은 변경 없음) ---
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
  /* gap: 15px; -> DetailReviewCard의 margin-bottom으로 간격 조절 */
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

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;
// --- styled-components 끝 ---

const MyReviewsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { mypageReview, userInfoGet } = useMypageApi();

  // 로그인 사용자 정보를 위한 상태 추가
  const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(null);

  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">("latest");
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  // ---------------- Load Logged-in User (userInfoGet) ----------------
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await userInfoGet();
        // userId를 포함한 전체 사용자 프로필을 저장합니다.
        setLoggedInUser(res.data?.data || null);
      } catch (err) {
        console.error("[MyReviewsDetailPage] 로그인 사용자 프로필 로드 실패:", err);
        setLoggedInUser(null);
      }
    };
    fetchLoggedInUser();
  }, [userInfoGet]);

  // ---------------- Load Detail Reviews ----------------
  // loadDetailReviews 함수를 useCallback으로 메모이제이션합니다.
  const loadDetailReviews = useCallback(async () => {
    // loggedInUser가 존재하고 userId가 유효할 때만 API 호출
    if (loggedInUser?.userId != null) {
      try {
        const res = await mypageReview(loggedInUser.userId); // loggedInUser.userId 사용
        const arr = Array.isArray(res?.data?.data?.reviews)
          ? res.data.data.reviews
          : [];
        setDetailReviews(arr);
      } catch (err) {
        console.error("[MyReviewsDetailPage] 상세 리뷰 로드 실패:", err);
        setDetailReviews([]);
      }
    } else if (loggedInUser === null) {
      // loggedInUser가 아직 로드되지 않았거나 로드 중일 때
      console.log("[MyReviewsDetailPage] 사용자 프로필 로드 대기 중...");
      // 이 경우, 아직 ID를 알 수 없으므로 데이터를 로드하지 않고 대기합니다.
    } else {
      // loggedInUser는 로드되었지만 userId가 null인 경우 (예: 로그인 안됨)
      console.warn("[MyReviewsDetailPage] 사용자 ID를 찾을 수 없어 상세 리뷰를 로드할 수 없습니다.");
      setDetailReviews([]);
    }
  }, [mypageReview, loggedInUser]); // loggedInUser가 변경될 때마다 함수 재생성

  // loggedInUser가 로드되거나 변경될 때마다 리뷰 로드 함수 호출
  useEffect(() => {
    loadDetailReviews();
  }, [loadDetailReviews]); // loadDetailReviews 함수가 변경될 때마다 실행

  const sortedReviews = useMemo(() => {
    const arr = [...detailReviews];
    if (sortOrder === "latest") {
      arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() -
          parseDateString(a.createdAt).getTime()
      );
    } else if (sortOrder === "views") {
      arr.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    } else if (sortOrder === "likes") {
      arr.sort((a, b) => b.likeCount - a.likeCount);
    }
    return arr;
  }, [detailReviews, sortOrder]);

  // 페이지네이션 정보 업데이트
  useEffect(() => {
    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE) || 0;
    setPageInfo((prev) => {
      const currentPage = prev.currentPage >= totalPages ? 0 : prev.currentPage;
      return {
        ...prev,
        currentPage,
        size: ITEMS_PER_PAGE,
        pageContentAmount: totalPages,
      };
    });
  }, [sortedReviews]);

  const handleSortChange = (order: "latest" | "views" | "likes") => {
    setSortOrder(order);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, endIdx);

  const handleReviewClick = (reviewId: number) => {
    navigate(`/reviews/detail/${reviewId}`);
  };

  // 프로필 정보 로딩 중일 때 로딩 스피너 등을 보여줍니다.
  // MyReviewsShortPage와 동일하게 loggedInUser가 null일 때 로딩 메시지 표시
  if (loggedInUser === null) {
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
            내가 작성한 <PinkText>상세 리뷰</PinkText>
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
            isActive={sortOrder === "views"}
            onClick={() => handleSortChange("views")}
          >
            조회순
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
                <DetailReviewCard
                  key={review.reviewId}
                  review={review}
                  isMine={true} // 이 페이지는 본인 리뷰만 다루므로 항상 true
                  showProfile={true}
                  onClick={() => handleReviewClick(review.reviewId)}
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
          <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsDetailPage;