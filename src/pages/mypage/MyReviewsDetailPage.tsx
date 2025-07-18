import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";

interface DetailReviewType {
  id: string;
  title: string;
  image: string;
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

const DUMMY_DETAIL_REVIEWS: DetailReviewType[] = [
  {
    id: "dr1",
    title: "엘리오 내용 평가 4.0",
    image: "https://sitem.ssgcdn.com/72/10/00/item/1000569001072_i1_750.jpg",
    content:
      "엘리오는 영화 (콜 미 바이 유어 네임) 속에서 섬세하고 감성적인 소년으로 그려진다. 그는 이탈리아의 한적한 시골 마을에서 가족과 함께 지내며 지적이고 조용한 삶을 살고 있지만, 여름 방학 동안 올리버를 만나면서 그의 일상은 서서히 변화하기 시작한다. 처음에는 올리버에게 낯섦과 경계심을 느끼지만, 시간이 흐를수록 그들은 서로에게 깊은 감정을 느끼게 된다. 그 감정은 삶에 대한 새로운 통찰과 함께 서로에게 변화를 가져다준다. 시간이 흐를수록 그는 모든 것을 올리버에게 걸게 된다.",
    likes: 15,
    createdAt: "2024.07.18 11:00",
    views: 217,
    comments: 3,
    reviewer: {
      id: "user1",
      nickname: "영화평론가1",
      image: "https://via.placeholder.com/50/FF69B4/FFFFFF?text=R1",
    },
  },
  {
    id: "dr2",
    title: "2025년 7/10 박스오피스",
    image: "https://via.placeholder.com/200x300/9b59b6/ffffff?text=BoxOffice",
    content: "매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)",
    likes: 10,
    createdAt: "2023.09.01 10:00",
    views: 500,
    comments: 2,
    reviewer: {
      id: "user2",
      nickname: "영화광2",
      image: "https://via.placeholder.com/50/00CED1/FFFFFF?text=R2",
    },
  },
  {
    id: "dr3",
    title: "2025년 7/10 박스오피스",
    image: "https://via.placeholder.com/200x300/9b59b6/ffffff?text=BoxOffice",
    content: "매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)",
    likes: 10,
    createdAt: "2023.09.01 10:00",
    views: 500,
    comments: 21,
    reviewer: {
      id: "user3",
      nickname: "무비마스터",
      image: "https://via.placeholder.com/50/FFD700/FFFFFF?text=R3",
    },
  },
  {
    id: "dr4",
    title: "2025년 7/10 박스오피스",
    image: "https://via.placeholder.com/200x300/9b59b6/ffffff?text=BoxOffice",
    content: "매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)",
    likes: 10,
    createdAt: "2023.09.01 10:00",
    views: 500,
    comments: 12,
    reviewer: {
      id: "user4",
      nickname: "비평가",
      image: "https://via.placeholder.com/50/3498DB/FFFFFF?text=R4",
    },
  },
];

// Helper function to parse "YYYY.MM.DD HH:MM" string to Date object
// DUMMY_DETAIL_REVIEWS의 createdAt 형식에 맞춰 필요
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
  background-color: #000000;
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

const MyReviewsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">(
    "latest"
  );
  const detailReviews: DetailReviewType[] = DUMMY_DETAIL_REVIEWS;

  const sortedReviews = [...detailReviews].sort((a, b) => {
    if (sortOrder === "latest") {
      return (
        parseDateString(b.createdAt).getTime() -
        parseDateString(a.createdAt).getTime()
      );
    } else if (sortOrder === "views") {
      return (b.views || 0) - (a.views || 0);
    } else if (sortOrder === "likes") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const handleReviewClick = (reviewId: string) => {
    // 상세 리뷰 클릭 시 상세 페이지로 이동
    navigate(`/reviews/detail/${reviewId}`);
  };

  return (
    <PageContainer>
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
          <PageTitle>내가 작성한 상세 리뷰</PageTitle>
        </PageHeader>
        <SortOptions>
          <SortButton
            isActive={sortOrder === "latest"}
            onClick={() => setSortOrder("latest")}
          >
            최신순
          </SortButton>
          <SortButton
            isActive={sortOrder === "views"}
            onClick={() => setSortOrder("views")}
          >
            조회순
          </SortButton>
          <SortButton
            isActive={sortOrder === "likes"}
            onClick={() => setSortOrder("likes")}
          >
            좋아요순
          </SortButton>
        </SortOptions>
        {sortedReviews && sortedReviews.length > 0 ? (
          <ReviewList>
            {sortedReviews.map((review: DetailReviewType) => (
              <DetailReviewCard
                key={review.id}
                review={review}
                isMine={true}
                showProfile={true}
                onClick={() => handleReviewClick(review.id)}
                // isMobile prop은 필요하다면 여기에 추가 (예: useMediaQuery 훅 사용)
              />
            ))}
          </ReviewList>
        ) : (
          <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsDetailPage;
