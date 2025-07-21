import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/Pagenation"; // Pagenation 컴포넌트 import 확인

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
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

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

/** 한 페이지에 보여줄 상세 리뷰 수. 상세카드는 길이가 길 수 있으니 필요 시 조정하세요. */
const ITEMS_PER_PAGE = 5; // ← 카드 길이를 감안해 5 추천; 짧게 보이려면 10 등으로 변경

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
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
  const { mypageReview, userInfoGet } = useMypageApi(); // userInfoGet 추가

  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">("latest");
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
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
        console.error("[MyReviewsDetailPage] 사용자 프로필 로드 실패:", err);
        setUserProfile(null); // 에러 발생 시 프로필 초기화
      }
    };
    fetchUserProfile();
  }, [userInfoGet]); // userInfoGet은 useCallback으로 메모이제이션되어 있으므로 의존성에 추가

  // 상세 리뷰를 로드하는 useEffect (userProfile.userId에 의존)
  useEffect(() => {
    const loadDetailReviews = async () => {
      // userProfile이 존재하고 userId가 유효할 때만 API 호출
      if (userProfile && userProfile.userId != null) {
        try {
          const res = await mypageReview(userProfile.userId); // userProfile.userId 사용
          const review = Array.isArray(res?.data?.data?.reviews)
            ? res.data.data.reviews
            : [];
          setDetailReviews(review);
        } catch (err) {
          console.error("[MyReviewsDetailPage] 상세 리뷰 로드 실패:", err);
          setDetailReviews([]); // 에러 발생 시 빈 배열로 설정
        }
      } else if (userProfile === null) {
        // userProfile이 아직 로드되지 않았거나 로드 중일 때
        // (로딩 상태를 보여주거나 아무것도 하지 않을 수 있습니다)
        console.log("사용자 프로필 로드 대기 중...");
      } else {
        // userProfile은 로드되었지만 userId가 null인 경우 (예: 로그인 안됨)
        console.warn("사용자 ID를 찾을 수 없어 상세 리뷰를 로드할 수 없습니다.");
        setDetailReviews([]);
      }
    };

    loadDetailReviews();
  }, [mypageReview, userProfile]); // mypageReview와 userProfile을 의존성에 추가

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
      // 현재 페이지가 총 페이지 수를 초과하면 첫 페이지로 이동
      const currentPage = prev.currentPage >= totalPages ? 0 : prev.currentPage;
      return {
        ...prev,
        currentPage,
        size: ITEMS_PER_PAGE,
        pageContentAmount: totalPages, // 총 페이지 수로 변경
      };
    });
  }, [sortedReviews]); // 정렬된 리뷰 목록이 변경될 때마다 페이지네이션 정보 업데이트

  const handleSortChange = (order: "latest" | "views" | "likes") => {
    setSortOrder(order);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 })); // 정렬 변경 시 첫 페이지로
  };

  const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, endIdx);

  const handleReviewClick = (reviewId: number) => {
    navigate(`/reviews/detail/${reviewId}`);
  };

  // 프로필 정보 로딩 중일 때 로딩 스피너 등을 보여줄 수 있습니다.
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
                  isMine={true}
                  showProfile={true}
                  onClick={() => handleReviewClick(review.reviewId)}
                />
              ))}
            </ReviewList>

            {pageInfo.pageContentAmount > 1 && ( // 총 페이지가 1보다 클 때만 Pagination 표시
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