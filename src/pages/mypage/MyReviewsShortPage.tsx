import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import useMyPageApi from '../../api/useMyPageApi'; // ShortReviewListApiResponse 인터페이스는 이제 여기서 임포트하지 않습니다.
import ReviewCard from '../../components/mypage/ReviewCard';
import VideoBackground from '../../components/VideoBackground';

// API 응답 구조를 위한 인터페이스를 여기에 정의합니다.
export interface ShortReviewListApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    shortReviews: Array<{
      shortReviewId: number;
      content: string;
      rating: number;
      movieTitle: string;
      createdAt: string;
      likes: number;
      userNickname: string;
      userProfileUrl: string;
    }>;
  };
}

// ReviewCard에 전달할 데이터 구조를 위한 인터페이스
interface ShortReviewType {
  id: string; // shortReviewId를 매핑하여 사용
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
  // userNickname, userProfileUrl은 필요에 따라 추가
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
  color: ${props => (props.$isActive ? '#e0e0e0' : '#888')};
  font-weight: ${props => (props.$isActive ? 'bold' : 'normal')};
  cursor: pointer;
  padding: 5px 0;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }

  ${props =>
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

const MyReviewsShortPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchMyShortReviews } = useMyPageApi();

  const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'latest' | 'likes' | 'rating'>('latest');

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        // API 훅에서 반환되는 데이터의 타입을 명시적으로 지정
        const data: ShortReviewListApiResponse['data']['shortReviews'] | null = await fetchMyShortReviews();
        if (data) {
          const mappedReviews: ShortReviewType[] = data.map(sr => ({
            id: String(sr.shortReviewId),
            movieTitle: sr.movieTitle,
            content: sr.content,
            rating: sr.rating,
            likes: sr.likes,
            createdAt: sr.createdAt,
          }));
          setShortReviews(mappedReviews);
        } else {
          setShortReviews([]);
        }
      } catch (err: any) {
        console.error("한줄평 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        } else {
          setError("한줄평 데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [fetchMyShortReviews, navigate]);

  const sortedReviews = [...shortReviews].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'likes') {
      return b.likes - a.likes;
    } else if (sortOrder === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate('/mypage')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <PageTitle>내가 작성한 한줄평</PageTitle>
        </PageHeader>
        <SortOptions>
          <SortButton $isActive={sortOrder === 'latest'} onClick={() => setSortOrder('latest')}>최신순</SortButton>
          <SortButton $isActive={sortOrder === 'likes'} onClick={() => setSortOrder('likes')}>좋아요순</SortButton>
          <SortButton $isActive={sortOrder === 'rating'} onClick={() => setSortOrder('rating')}>별점순</SortButton>
        </SortOptions>
        {sortedReviews && sortedReviews.length > 0 ? (
          <ReviewList>
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} type="short" />
            ))}
          </ReviewList>
        ) : (
          <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsShortPage;