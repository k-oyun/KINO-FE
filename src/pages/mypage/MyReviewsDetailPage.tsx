import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import useMyPageApi from '../../api/useMyPageApi';
import ReviewCard from "../../components/mypage/ReviewCard";
import VideoBackground from '../../components/VideoBackground';

export interface DetailReviewListApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    reviews: Array<{
      reviewId: number;
      title: string;
      content: string;
      movieTitle: string;
      totalViews: number;
      createdAt: string;
      likes: number;
      comments: number;
    }>;
  };
}

interface DetailReviewType {
  id: string;
  title: string;
  content: string;
  movieTitle: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
}

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

  @media (max-width: 767px) {
    padding: 20px;
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

const SortButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$isActive ? "#e0e0e0" : "#888")};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  cursor: pointer;
  padding: 5px 0;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }

  ${(props) =>
    props.$isActive &&
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
  gap: 15px;

  @media (max-width: 767px) {
    gap: 10px;
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
  const { fetchMyDetailReviews } = useMyPageApi();

  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">(
    "latest"
  );

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: DetailReviewListApiResponse["data"]["reviews"] | null = await fetchMyDetailReviews();
        if (data) {
          const mappedReviews: DetailReviewType[] = data.map(dr => ({
            id: String(dr.reviewId),
            title: dr.title,
            content: dr.content,
            movieTitle: dr.movieTitle,
            likes: dr.likes,
            views: dr.totalViews,
            comments: dr.comments,
            createdAt: dr.createdAt,
          }));
          setDetailReviews(mappedReviews);
        } else {
          setDetailReviews([]);
        }
      } catch (err: any) {
        console.error("상세 리뷰 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        } else {
          setError("상세 리뷰 데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [fetchMyDetailReviews, navigate]);

  const sortedReviews = [...detailReviews].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "views") {
      return (b.views || 0) - (a.views || 0);
    } else if (sortOrder === "likes") {
      return b.likes - a.likes;
    }
    return 0;
  });

  if (loading) {
    return (
      <PageContainer>
        <VideoBackground />
        <EmptyState>상세 리뷰 데이터를 불러오는 중입니다...</EmptyState>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <VideoBackground />
        <EmptyState>{error}</EmptyState>
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
          <PageTitle>내가 작성한 상세 리뷰</PageTitle>
        </PageHeader>
        <SortOptions>
          <SortButton
            $isActive={sortOrder === "latest"}
            onClick={() => setSortOrder("latest")}
          >
            최신순
          </SortButton>
          <SortButton
            $isActive={sortOrder === "likes"}
            onClick={() => setSortOrder("likes")}
          >
            좋아요순
          </SortButton>
          <SortButton
            $isActive={sortOrder === "views"}
            onClick={() => setSortOrder("views")}
          >
            조회순
          </SortButton>
        </SortOptions>
        {sortedReviews && sortedReviews.length > 0 ? (
          <ReviewList>
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                type="detail"
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