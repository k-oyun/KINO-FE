import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/PageNation"; // ✅ 동일 Pagination 재사용

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

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

const MyReviewsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { mypageReview } = useMypageApi();

  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">("latest");
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  useEffect(() => {
    const myReviewGet = async () => {
      try {
        const res = await mypageReview();
        const review = Array.isArray(res?.data?.data?.reviews)
          ? res.data.data.reviews
          : [];
        console.log("[MyReviewsDetailPage] reviews", review);
        setDetailReviews(review);
      } catch (err) {
        console.error("[MyReviewsDetailPage] fetch error", err);
        setDetailReviews([]);
      }
    };
    myReviewGet();
  }, [mypageReview]);

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

  const handleReviewClick = (reviewId: string) => {
    navigate(`/reviews/detail/${reviewId}`);
  };

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
