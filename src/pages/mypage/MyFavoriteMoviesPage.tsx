import React, { useState, useEffect } from 'react'; // useEffect 임포트
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 임포트
import MovieCard from '../../components/mypage/MovieCard';

// --- 백엔드 API 응답 구조에 맞는 타입 정의 ---
// 이 타입은 백엔드 응답의 'myPickMovies' 배열 내 개별 객체와 일치해야 합니다.
interface ApiFavoriteMovie {
    myPickId: number; // myPickId 대신 id로 통일 가정
    movieTitle: string;
    posterUrl: string;
    director: string;
    releaseDate: string;
}

// 전체 API 응답 구조를 정의합니다.
interface FavoriteMoviesApiResponseData {
    // 페이지네이션이 없으므로 totalCount, currentPage, pageSize는 제거합니다.
    myPickMovies: ApiFavoriteMovie[];
}

interface FavoriteMoviesApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: FavoriteMoviesApiResponseData;
}

// --- 컴포넌트들이 사용하는 타입 정의 (매핑 후의 최종 형태) ---
// MovieCard에 전달되는 FavoriteMovieType
interface FavoriteMovieType {
    id: string; // API의 number id를 string으로 변환
    title: string; // movieTitle을 title로 매핑
    director: string;
    releaseDate: string;
    posterUrl: string;
}

// --- 스타일 컴포넌트들은 변경 없음 (생략) ---
const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 300px;
    background-color: transparent;
    // min-height: calc(100vh - 60px); // 이 부분은 주석 처리된 채로 유지
    max-height: 100vh;
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
    justify-content: flex-end; /* 오른쪽 정렬 */

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
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // 찜한 영화는 현재 '최신순'만 있으므로, 정렬 상태는 고정하거나 제거할 수 있습니다.
    // 여기서는 API 호출에 'sort=latest'를 명시적으로 보내기 위해 남겨둡니다.
    const [sortOrder] = useState<'latest'>('latest'); // 정렬 옵션이 하나뿐이므로 setSortOrder는 필요 없음

    const fetchFavoriteMovies = async (sort: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // API 경로 및 쿼리 파라미터 (정렬만 포함)
            // 백엔드 API가 이 요청에 모든 데이터를 정렬하여 반환한다고 가정합니다.
            const response = await axios.get<FavoriteMoviesApiResponse>(
                `http://43.203.218.183:8080/api/mypage/myPickMovie?sort=${sort}` // 찜한 영화 API 엔드포인트: /api/mypage/myPickMovie
            );
            const apiData = response.data.data;

            setFavoriteMovies(
                apiData.myPickMovies.map((movie) => ({
                    id: movie.myPickId.toString(), // API id는 number, 컴포넌트 id는 string
                    title: movie.movieTitle, // movieTitle을 title로 매핑
                    director: movie.director,
                    releaseDate: movie.releaseDate,
                    posterUrl: movie.posterUrl,
                }))
            );
        } catch (err) {
            console.error("찜한 영화 데이터를 불러오는 데 실패했습니다:", err);
            setError("찜한 영화를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 데이터 호출
        fetchFavoriteMovies(sortOrder); // sortOrder가 변경될 때마다 데이터를 다시 불러옵니다.
    }, [sortOrder]); // sortOrder가 변경될 때마다 데이터를 다시 불러옵니다.

    if (isLoading) {
        return <EmptyState>찜한 영화 데이터를 불러오는 중입니다...</EmptyState>;
    }

    if (error) {
        return <EmptyState style={{ color: 'red' }}>{error}</EmptyState>;
    }

    return (
        <PageContainer>
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
                    {/* 찜한 영화는 현재 '최신순'만 있으므로, 버튼은 하나만 표시하고 항상 활성화 */}
                    <SortButton isActive={true} disabled={favoriteMovies.length === 0}>최신순</SortButton>
                </SortOptions>
                {/* 데이터가 비어있지 않고, 불러온 favoriteMovies를 보여줍니다. */}
                {favoriteMovies && favoriteMovies.length > 0 ? (
                    <MovieCardGrid>
                        {favoriteMovies.map((movie: FavoriteMovieType) => (
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