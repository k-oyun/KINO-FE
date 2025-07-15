import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ReviewCard from '../../components/mypage/ReviewCard';

interface DetailReviewType {
  id: string;
  movieTitle: string;
  moviePosterUrl: string;
  title: string;
  content: string;
  rating: number;
  likeCount: number;
  createdAt: string;
  viewCount?: number;
}

type ReviewType = DetailReviewType | {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likeCount: number;
  createdAt: string;
  viewCount?: number;
};


const DUMMY_DETAIL_REVIEWS: DetailReviewType[] = [
  {
    id: 'dr1', movieTitle: '엘리오', moviePosterUrl: 'https://via.placeholder.com/100x150/e74c3c/ffffff?text=Poster1',
    title: '엘리오 내용 평가 4.0', content: '엘리오는 영화 (콜 미 바이 유어 네임) 속에서 섬세하고 감성적인 소년으로 그려진다. 그는 이탈리아의 한적한 시골 마을에서 가족과 함께 지내며 지적이고 조용한 삶을 살고 있지만, 여름 방학 동안 올리버를 만나면서 그의 일상은 서서히 변화하기 시작한다. 처음에는 올리버에게 낯섦과 경계심을 느끼지만, 시간이 흐를수록 그들은 서로에게 깊은 감정을 느끼게 된다. 그 감정은 삶에 대한 새로운 통찰과 함께 서로에게 변화를 가져다준다. 시간이 흐를수록 그는 모든 것을 올리버에게 걸게 된다.',
    rating: 4.0, likeCount: 15, createdAt: '2024.07.15 10:00',
    viewCount: 217,
  },
  {
    id: 'dr2', movieTitle: '박시영', moviePosterUrl: 'https://via.placeholder.com/100x150/2ecc71/ffffff?text=Poster2',
    title: '2025년 7/10 박스오피스', content: '매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)',
    rating: 3.5, likeCount: 10, createdAt: '2023.09.01 10:00',
    viewCount: 500,
  },
  {
    id: 'dr3', movieTitle: '인셉션', moviePosterUrl: 'https://via.placeholder.com/100x150/f1c40f/ffffff?text=Poster3',
    title: '꿈 속의 꿈, 인셉션 분석', content: '크리스토퍼 놀란 감독의 명작 인셉션은 복잡한 서사와 시각 효과로 관객을 사로잡습니다. 꿈이라는 비현실적인 공간에서 벌어지는 일들이 현실과 어떻게 연결되는지 탐구하는 재미가 있습니다.',
    rating: 4.8, likeCount: 30, createdAt: '2024.01.20 09:00', viewCount: 750,
  },
  {
    id: 'dr4', movieTitle: '어벤져스: 엔드게임', moviePosterUrl: 'https://via.placeholder.com/100x150/9c27b0/ffffff?text=Poster4',
    title: '히어로들의 대장정, 10년의 마무리', content: '마블 시네마틱 유니버스의 대미를 장식하는 작품. 팬이라면 감동의 눈물을 흘릴 수밖에 없는 완벽한 엔딩이다. 각 캐릭터들의 활약도 눈부셨다.',
    rating: 5.0, likeCount: 80, createdAt: '2023.04.26 15:00', viewCount: 1200,
  },
  {
    id: 'dr5', movieTitle: '듄', moviePosterUrl: 'https://via.placeholder.com/100x150/009688/ffffff?text=Poster5',
    title: '광활한 사막 행성의 장엄한 서사', content: '압도적인 영상미와 사운드로 원작의 세계관을 완벽하게 구현했다. 스토리 전개는 다소 느릴 수 있으나, 그만큼 몰입감을 선사한다. 다음 편이 기대된다.',
    rating: 4.5, likeCount: 60, createdAt: '2024.03.01 11:00', viewCount: 1000,
  },
];

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

const SortButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => (props.isActive ? '#e0e0e0' : '#888')};
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
  cursor: pointer;
  padding: 5px 0;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }

  ${props =>
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
  const [sortOrder, setSortOrder] = useState<'latest' | 'views' | 'likes'>('latest');
  const detailReviews = DUMMY_DETAIL_REVIEWS;

  const sortedReviews = [...detailReviews].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    } else if (sortOrder === 'likes') {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  return (
    <PageContainer>
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate('/mypage')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <PageTitle>내가 작성한 상세 리뷰</PageTitle>
        </PageHeader>
        <SortOptions>
          <SortButton isActive={sortOrder === 'latest'} onClick={() => setSortOrder('latest')}>최신순</SortButton>
          <SortButton isActive={sortOrder === 'views'} onClick={() => setSortOrder('views')}>조회순</SortButton>
          <SortButton isActive={sortOrder === 'likes'} onClick={() => setSortOrder('likes')}>좋아요순</SortButton>
        </SortOptions>
        {sortedReviews && sortedReviews.length > 0 ? (
          <ReviewList>
            {sortedReviews.map((review: DetailReviewType) => (
              <ReviewCard key={review.id} review={review as ReviewType} type="detail" />
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