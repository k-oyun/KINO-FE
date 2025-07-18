import React, { useState, useEffect } from 'react'; // useEffect, useState 추가
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 추가

import MovieCard from '../../components/mypage/MovieCard';
import VideoBackground from '../../components/VideoBackground';
import useMyPageApi from '../../api/useMyPageApi';

// 이 파일에서 FavoriteMovieApiResponse를 정의하고 export 합니다.
export interface FavoriteMovieApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    myPickMoives: Array<{
      myPickId: number;
      movieTitle: string;
      posterUrl: string;
      director: string;
      releaseDate: string; // "YYYY-MM-DD" 형식
    }>;
  };
}

// FavoriteMovieType 인터페이스를 API 응답 구조에 맞게 조정
interface FavoriteMovieType {
  id: string; // myPickId를 매핑하여 사용
  movieTitle: string;
  director: string;
  releaseDate: string;
  posterUrl: string;
}

// DUMMY_FAVORITE_MOVIES는 이제 API 연동을 위해 제거합니다.
// const DUMMY_FAVORITE_MOVIES: FavoriteMovieType[] = [...];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  // min-height: calc(100vh - 60px); // 전체 뷰포트 높이에 맞추되, 실제 콘텐츠에 따라 조절
  min-height: calc(100vh - 60px); /* max-height 대신 min-height로 변경하여 내용에 따라 늘어나게 함 */
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
  flex-grow: 1; /* 콘텐츠가 적어도 배경이 채워지도록 */
  overflow-y: auto; /* 스크롤 가능하게 */

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

// isActive prop을 $isActive로 변경하여 transient prop으로 만듦
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

const MyFavoriteMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchMyFavoriteMovies } = useMyPageApi(); // 새로운 훅 함수 임포트

  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"latest" | "title">(
    "latest"
  ); // 찜한 영화는 보통 최신순, 가나다순 정도

  useEffect(() => {
    const loadFavoriteMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: FavoriteMovieApiResponse["data"]["myPickMoives"] | null = await fetchMyFavoriteMovies();
        if (data) {
          const mappedMovies: FavoriteMovieType[] = data.map(movie => ({
            id: String(movie.myPickId), // myPickId를 id로 매핑
            movieTitle: movie.movieTitle,
            director: movie.director,
            releaseDate: movie.releaseDate,
            posterUrl: movie.posterUrl,
          }));
          setFavoriteMovies(mappedMovies);
        } else {
          setFavoriteMovies([]);
        }
      } catch (err: any) {
        console.error("찜한 영화 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        } else {
          setError("찜한 영화 데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteMovies();
  }, [fetchMyFavoriteMovies, navigate]); // 의존성 배열에 fetchMyFavoriteMovies 추가

  const sortedMovies = [...favoriteMovies].sort((a, b) => {
    if (sortOrder === "latest") {
      // releaseDate가 "YYYY-MM-DD" 형식이므로 직접 비교 가능
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    } else if (sortOrder === "title") {
      return a.movieTitle.localeCompare(b.movieTitle);
    }
    return 0;
  });

  if (loading) {
    return (
      <PageContainer>
        <VideoBackground /> {/* VideoBackground 컴포넌트 사용 유지 */}
        <EmptyState>찜한 영화 데이터를 불러오는 중입니다...</EmptyState>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <VideoBackground /> {/* VideoBackground 컴포넌트 사용 유지 */}
        <EmptyState>{error}</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground /> {/* VideoBackground 컴포넌트 사용 유지 */}
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate('/mypage')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </BackButton>
          <PageTitle>내가 찜한 영화</PageTitle>
        </PageHeader>
        <SortOptions>
          <SortButton
            $isActive={sortOrder === "latest"}
            onClick={() => setSortOrder("latest")}
          >
            최신순
          </SortButton>
          <SortButton
            $isActive={sortOrder === "title"}
            onClick={() => setSortOrder("title")}
          >
            가나다순
          </SortButton>
        </SortOptions>
        {sortedMovies && sortedMovies.length > 0 ? (
          <MovieCardGrid>
            {sortedMovies.map((movie: FavoriteMovieType) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieCardGrid>
        ) : (
          <EmptyState>찜한 영화가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyFavoriteMoviesPage;