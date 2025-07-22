import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 컴포넌트 임포트 (경로 확인 필요)
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from '../../components/VideoBackground';
import Pagination from "../../components/Pagenation";

// API 훅 임포트
import useMypageApi from "../../api/mypage";

// --- 인터페이스 정의 ---
interface FavoriteMovieType {
    myPickId: string;
    movieTitle: string;
    director: string;
    releaseDate: string;
    posterUrl: string;
}

interface UserProfileType {
    userId: number;
    nickname: string;
    image: string;
    email: string;
    isFirstLogin: boolean;
}

interface MovieCardGridProps {
    isEmpty?: boolean;
}

interface PageInfo {
    currentPage: number;
    size: number;
    pageContentAmount: number;
}

// --- 스타일드 컴포넌트 ---
const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 300px;
    background-color: transparent;
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

const MovieCardGrid = styled.div<MovieCardGridProps>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding-top: 10px;

    ${(props) =>
        props.isEmpty &&
        `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 200px;
        padding: 0;
    `}

    @media (max-width: 767px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
        ${(props) =>
            props.isEmpty &&
            `
            min-height: 150px;
        `}
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

const PinkText = styled.span`
    color: #ff69b4;
    font-weight: bold;
    margin-left: 0.25em;
`;

// --- 컴포넌트 로직 ---
const ITEMS_PER_PAGE = 12; // 페이지당 영화 수

const MyFavoriteMoviesPage: React.FC = () => {
    const navigate = useNavigate();
    const { mypageMyPickMovie, userInfoGet } = useMypageApi(); // API 훅
    
    // 상태 정의
    const [sortOrder, setSortOrder] = useState<"latest" | "title">("latest");
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[] | null>(null); // ✨ 변경: 초기값을 null로 설정하여 로딩 전 상태를 표현
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null); // ✨ 변경: 초기값을 null로 설정

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        currentPage: 0,
        size: ITEMS_PER_PAGE,
        pageContentAmount: 0,
    });

    // 1. 사용자 프로필을 비동기로 가져오는 함수 (useCallback으로 메모이제이션)
    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await userInfoGet();
            setUserProfile(res.data?.data || null);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 사용자 프로필 로드 실패:", err);
            setUserProfile(null); // 에러 발생 시 프로필 초기화
        }
    }, [userInfoGet]);

    // 2. 찜한 영화 목록을 비동기로 가져오는 함수 (useCallback으로 메모이제이션)
    const loadFavoriteMovies = useCallback(async (userId: number) => {
        try {
            const res = await mypageMyPickMovie(userId);
            const pick = Array.isArray(res.data?.data?.myPickMovies)
                ? res.data.data.myPickMovies
                : [];
            setFavoriteMovies(pick);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 찜한 영화 로드 실패:", err);
            setFavoriteMovies([]); // 에러 발생 시 빈 배열로 설정
        }
    }, [mypageMyPickMovie]);

    // 3. 컴포넌트 마운트 시 사용자 프로필 로드 시작
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    // 4. userProfile이 로드되거나 변경될 때 찜한 영화 로드
    // userProfile이 유효한 userId를 가지고 있을 때만 loadFavoriteMovies 호출
    useEffect(() => {
        if (userProfile?.userId != null) {
            loadFavoriteMovies(userProfile.userId);
        } else if (userProfile === null) {
            // 사용자 프로필 로드에 실패했거나 (null) 로그인되지 않은 경우
            // favoriteMovies를 빈 배열로 설정하여 "찜한 영화 없음" 표시
            setFavoriteMovies([]);
        }
        // userProfile이 아직 null이 아닌 경우 (로딩 중)에는 아무것도 하지 않음
    }, [userProfile, loadFavoriteMovies]);

    // 찜한 영화 정렬 로직 (useMemo로 성능 최적화)
    const sortedMovies = useMemo(() => {
        // favoriteMovies가 null이면 빈 배열 반환하여 오류 방지
        const arr = favoriteMovies ? [...favoriteMovies] : [];
        if (sortOrder === "latest") {
            // releaseDate를 Date 객체로 변환하여 최신순으로 정렬
            return arr.sort((a, b) => {
                const dateA = new Date(a.releaseDate);
                const dateB = new Date(b.releaseDate);
                return dateB.getTime() - dateA.getTime();
            });
        } else if (sortOrder === "title") {
            // movieTitle을 기준으로 문자열 정렬
            return arr.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
        }
        return arr;
    }, [favoriteMovies, sortOrder]);

    // 페이지 정보 업데이트 (sortedMovies 변경 시마다)
    useEffect(() => {
        const totalPages = Math.ceil(sortedMovies.length / ITEMS_PER_PAGE);
        setPageInfo(prev => ({
            ...prev,
            // 현재 페이지가 총 페이지를 초과하면 마지막 페이지로 조정 (단, 총 페이지가 0보다 클 때만)
            currentPage: prev.currentPage >= totalPages && totalPages > 0 ? totalPages - 1 : prev.currentPage,
            pageContentAmount: totalPages,
        }));
    }, [sortedMovies]);

    // 현재 페이지에 해당하는 영화 목록 계산
    const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentMovies = sortedMovies.slice(startIdx, endIdx);

    // ✨ 변경: userProfile 또는 favoriteMovies가 null (초기 로딩 중)일 경우 아무것도 렌더링하지 않음
    // 이렇게 하면 데이터가 준비될 때까지 빈 화면 깜빡임 없이 대기합니다.
    if (userProfile === null && favoriteMovies === null) {
        return (
            <PageContainer>
                <VideoBackground />
                {/* 데이터 로딩 중임을 사용자에게 알리는 메시지를 여기에 추가할 수도 있습니다. */}
                {/* <EmptyState>데이터를 준비 중입니다...</EmptyState> */}
            </PageContainer>
        );
    }

    // 최종 렌더링
    return (
        <PageContainer>
            <VideoBackground />
            <SectionWrapper>
                <PageHeader>
                    {/* 뒤로 가기 버튼 */}
                    <BackButton onClick={() => navigate("/mypage")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 5L9 12L15 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </BackButton>
                    <PageTitle>내가 <PinkText>찜한 영화</PinkText></PageTitle>
                </PageHeader>
                {/* 정렬 옵션 */}
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
                        제목순
                    </SortButton>
                </SortOptions>
                {/* 영화 목록 또는 빈 상태 메시지 */}
                {currentMovies && currentMovies.length > 0 ? (
                    <>
                        <MovieCardGrid isEmpty={currentMovies.length === 0}>
                            {currentMovies.map((movie: FavoriteMovieType) => (
                                <MovieCard key={movie.myPickId} movie={movie} />
                            ))}
                        </MovieCardGrid>
                        {/* 페이지네이션 컴포넌트 (총 페이지가 1보다 클 때만 표시) */}
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
                    <EmptyState>찜한 영화가 없습니다.</EmptyState>
                )}
            </SectionWrapper>
        </PageContainer>
    );
};

export default MyFavoriteMoviesPage;