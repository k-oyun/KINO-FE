import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import UserProfileSection from '../../components/mypage/UserProfileSection';
import ReviewCard from '../../components/mypage/ReviewCard';
import MovieCard from '../../components/mypage/MovieCard';

const MyPageContainer = styled.div`
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

const SectionWrapper = styled.section`
  background-color: #000000;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    padding: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    margin-left: 10px;
    font-size: 1.5em;
    color: #f0f0f0;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateX(5px);
    }
  }
  
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

  @media (max-width: 767px) {
    font-size: 0.8em;
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

const PreviewContent = styled.div`
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

const MovieCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding-top: 10px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

interface ShortReviewType {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likeCount: number;
  createdAt: string;
  viewCount?: number;
}

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

type ReviewType = ShortReviewType | DetailReviewType;

interface FavoriteMovieType {
  id: string;
  title: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}


const DUMMY_USER_PROFILE: UserProfileType = {
  nickname: 'Nick_name',
  profileImageUrl: 'https://via.placeholder.com/100/3498db/ffffff?text=User',
  followerCount: 123,
  followingCount: 45,
};

const DUMMY_SHORT_REVIEWS: ShortReviewType[] = [
  { id: 'sr1', movieTitle: '노이즈', content: '무서워요 무서워요무서워요무서워요무서워요무서워요', rating: 4.5, likeCount: 7, createdAt: '2023.08.15 11:00', viewCount: 150 },
  { id: 'sr2', movieTitle: '타이타닉', content: '잭과 로즈의 아름다운 사랑 이야기. OST가 정말 좋아요!', rating: 5.0, likeCount: 25, createdAt: '2023.07.20 14:30', viewCount: 300 },
  { id: 'sr3', movieTitle: '아바타', content: '아바타 진짜 재밌어요 너무 재밌어요 또 보러갈 거예요', rating: 4.0, likeCount: 10, createdAt: '2024.01.10 10:00', viewCount: 200 },
  { id: 'sr4', movieTitle: '아바타', content: '아바타 진짜 재밌어요 너무 재밌어요 또 보러갈 거예요', rating: 4.0, likeCount: 10, createdAt: '2024.01.10 10:00', viewCount: 200 },
  { id: 'sr5', movieTitle: '아바타', content: '아바타 진짜 재밌어요 너무 재밌어요 또 보러갈 거예요', rating: 4.0, likeCount: 10, createdAt: '2024.01.10 10:00', viewCount: 200 },
];

const DUMMY_DETAIL_REVIEWS: DetailReviewType[] = [
  {
    id: 'dr1',
    movieTitle: '엘리오',
    moviePosterUrl: 'https://via.placeholder.com/100x150/e74c3c/ffffff?text=Poster1',
    title: '엘리오 내용 평가 4.0',
    content: '엘리오는 영화 (콜 미 바이 유어 네임) 속에서 섬세하고 감성적인 소년으로 그려진다. 그는 이탈리아의 한적한 시골 마을에서 가족과 함께 지내며 지적이고 조용한 삶을 살고 있지만, 여름 방학 동안 올리버를 만나면서 그의 일상은 서서히 변화하기 시작한다. 처음에는 올리버에게 낯섦과 경계심을 느끼지만, 시간이 흐를수록 그들은 서로에게 깊은 감정을 느끼게 된다. 그 감정은 삶에 대한 새로운 통찰과 함께 서로에게 변화를 가져다준다. 시간이 흐를수록 그는 모든 것을 올리버에게 걸게 된다.',
    rating: 4.0,
    likeCount: 15,
    createdAt: '14시간 전',
    viewCount: 217,
  },
  {
    id: 'dr2',
    movieTitle: '박시영',
    moviePosterUrl: 'https://via.placeholder.com/100x150/2ecc71/ffffff?text=Poster2',
    title: '2025년 7/10 박스오피스',
    content: '매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)',
    rating: 3.5,
    likeCount: 10,
    createdAt: '2023.09.01 10:00',
    viewCount: 500,
  },
    {
    id: 'dr3',
    movieTitle: '박시영',
    moviePosterUrl: 'https://via.placeholder.com/100x150/2ecc71/ffffff?text=Poster2',
    title: '2025년 7/10 박스오피스',
    content: '매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)',
    rating: 3.5,
    likeCount: 10,
    createdAt: '2023.09.01 10:00',
    viewCount: 500,
  },
    {
    id: 'dr4',
    movieTitle: '박시영',
    moviePosterUrl: 'https://via.placeholder.com/100x150/2ecc71/ffffff?text=Poster2',
    title: '2025년 7/10 박스오피스',
    content: '매트릭스를 보고, 나라면 빨간약과 파란약 중에... (중략)',
    rating: 3.5,
    likeCount: 10,
    createdAt: '2023.09.01 10:00',
    viewCount: 500,
  },
];

const DUMMY_FAVORITE_MOVIES: FavoriteMovieType[] = [
  { id: 'fm1', title: '인터스텔라', director: '크리스토퍼 놀란', releaseDate: '2014', posterUrl: 'https://via.placeholder.com/200x300/3498db/ffffff?text=Interstellar' },
  { id: 'fm2', title: '아바타: 물의 길', director: '제임스 카메론', releaseDate: '2022', posterUrl: 'https://via.placeholder.com/200x300/9b59b6/ffffff?text=Avatar2' },
  { id: 'fm3', title: '스파이더맨: 노 웨이 홈', director: '존 왓츠', releaseDate: '2021', posterUrl: 'https://via.placeholder.com/200x300/e67e22/ffffff?text=Spiderman' },
  { id: 'fm4', title: '기생충', director: '봉준호', releaseDate: '2019', posterUrl: 'https://via.placeholder.com/200x300/27ae60/ffffff?text=Parasite' },
  { id: 'fm6', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm7', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm8', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm9', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm10', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm11', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm12', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm13', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm14', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm15', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
  { id: 'fm16', title: '범죄도시 3', director: '이상용', releaseDate: '2023', posterUrl: 'https://via.placeholder.com/200x300/c0392b/ffffff?text=The+Outlaws3' },
];


const MyPageMain: React.FC = () => {
  const navigate = useNavigate();
  const [shortReviewSort, setShortReviewSort] = useState<'latest' | 'views' | 'likes'>('latest');
  const [detailReviewSort, setDetailReviewSort] = useState<'latest' | 'views' | 'likes'>('latest');

  const userProfile = DUMMY_USER_PROFILE; // useQuery로 대체 예정
  const shortReviews = DUMMY_SHORT_REVIEWS; // useQuery로 대체 예정
  const detailReviews = DUMMY_DETAIL_REVIEWS; // useQuery로 대체 예정
  const favoriteMovies = DUMMY_FAVORITE_MOVIES; // useQuery로 대체 예정

  const sortedShortReviews = [...shortReviews].sort((a, b) => {
    if (shortReviewSort === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (shortReviewSort === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    } else if (shortReviewSort === 'likes') {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  const sortedDetailReviews = [...detailReviews].sort((a, b) => {
    if (detailReviewSort === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (detailReviewSort === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    } else if (detailReviewSort === 'likes') {
      return b.likeCount - a.likeCount;
    }
    return 0;
  });

  return (
    <MyPageContainer>
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper style={{ gridArea: 'shortReview' }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate('/mypage/reviews/short')}>
            내가 작성한<PinkText>한줄평</PinkText>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SectionTitle>
          <SortOptions>
            <SortButton isActive={shortReviewSort === 'latest'} onClick={() => setShortReviewSort('latest')}>최신순</SortButton>
            <SortButton isActive={shortReviewSort === 'views'} onClick={() => setShortReviewSort('views')}>조회순</SortButton>
            <SortButton isActive={shortReviewSort === 'likes'} onClick={() => setShortReviewSort('likes')}>좋아요순</SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedShortReviews && sortedShortReviews.length > 0 ? (
            sortedShortReviews.slice(0,3).map((review: ShortReviewType) => (
              <ReviewCard key={review.id} review={review as ReviewType} type="short" />
            ))
          ) : (
            <EmptyState>작성한 한줄평이 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: 'detailReview' }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate('/mypage/reviews/detail')}>
            내가 작성한<PinkText>상세 리뷰</PinkText>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SectionTitle>
          <SortOptions>
            <SortButton isActive={detailReviewSort === 'latest'} onClick={() => setDetailReviewSort('latest')}>최신순</SortButton>
            <SortButton isActive={detailReviewSort === 'views'} onClick={() => setDetailReviewSort('views')}>조회순</SortButton>
            <SortButton isActive={detailReviewSort === 'likes'} onClick={() => setDetailReviewSort('likes')}>좋아요순</SortButton>
          </SortOptions>
        </SectionHeader>
        <PreviewContent>
          {sortedDetailReviews && sortedDetailReviews.length > 0 ? (
            sortedDetailReviews.slice(0,3).map((review: DetailReviewType) => (
              <ReviewCard key={review.id} review={review as ReviewType} type="detail" />
            ))
          ) : (
            <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
          )}
        </PreviewContent>
      </SectionWrapper>

      <SectionWrapper style={{ gridArea: 'favoriteMovies' }}>
        <SectionHeader>
          <SectionTitle onClick={() => navigate('/mypage/movies/favorite')}>
            내가<PinkText>찜한 영화</PinkText> 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SectionTitle>
        </SectionHeader>
        <MovieCardGrid>
          {favoriteMovies && favoriteMovies.length > 0 ? (
            favoriteMovies.slice(0, 12).map((movie: FavoriteMovieType) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <EmptyState>찜한 영화가 없습니다.</EmptyState>
          )}
        </MovieCardGrid>
      </SectionWrapper>
    </MyPageContainer>
  );
};

export default MyPageMain;