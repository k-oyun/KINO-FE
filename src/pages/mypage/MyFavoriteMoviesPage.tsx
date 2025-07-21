import React, { useEffect, useMemo, useState, useCallback } from "react"; // useCallback 추가
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/mypage/MovieCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from '../../components/VideoBackground';
import Pagination from "../../components/Pagenation";

interface FavoriteMovieType {
    myPickId: string;
    movieTitle: string;
    director: string;
    releaseDate: string;
    posterUrl: string;
}

// UserProfileType 인터페이스 추가 (userInfoGet에서 반환되는 타입)
interface UserProfileType {
    userId: number;
    nickname: string;
    image: string;
    email: string;
    isFirstLogin: boolean;
}

interface MovieCardGridProps {
    isEmpty?: boolean; // isEmpty prop은 boolean 타입이며 선택적입니다.
}

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

interface PageInfo {
    currentPage: number;
    size: number;
    pageContentAmount: number;
}

const ITEMS_PER_PAGE = 12; // 페이지당 영화 수

const MyFavoriteMoviesPage: React.FC = () => {
    const navigate = useNavigate();
    // userInfoGet을 useMypageApi 훅에서 가져옵니다.
    const { mypageMyPickMovie, userInfoGet } = useMypageApi();
    const [sortOrder, setSortOrder] = useState<"latest" | "title">("latest");
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[]>([]);
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
                console.error("[MyFavoriteMoviesPage] 사용자 프로필 로드 실패:", err);
                setUserProfile(null); // 에러 발생 시 프로필 초기화
            }
        };
        fetchUserProfile();
    }, [userInfoGet]); // userInfoGet은 useCallback으로 메모이제이션되어 있으므로 의존성에 추가

    // 찜한 영화를 로드하는 useCallback 함수
    const loadFavoriteMovies = useCallback(async () => {
        if (userProfile && userProfile.userId != null) {
            try {
                const res = await mypageMyPickMovie(userProfile.userId); // userProfile.userId 사용
                const pick = Array.isArray(res.data?.data?.myPickMoives)
                    ? res.data.data.myPickMoives
                    : [];
                setFavoriteMovies(pick);
            } catch (err) {
                console.error("[MyFavoriteMoviesPage] 찜한 영화 로드 실패:", err);
                setFavoriteMovies([]); // 에러 발생 시 빈 배열로 설정
            }
        } else if (userProfile === null) {
            console.log("사용자 프로필 로드 대기 중...");
        } else {
            console.warn("사용자 ID를 찾을 수 없어 찜한 영화를 로드할 수 없습니다.");
            setFavoriteMovies([]);
        }
    }, [mypageMyPickMovie, userProfile]); // mypageMyPickMovie와 userProfile을 의존성에 추가

    // 사용자 프로필이 로드될 때 또는 변경될 때 찜한 영화 로드
    useEffect(() => {
        loadFavoriteMovies();
    }, [loadFavoriteMovies]); // loadFavoriteMovies는 useCallback으로 메모이제이션되어 있으므로 안전

    const sortedMovies = useMemo(() => {
        const arr = [...favoriteMovies];
        if (sortOrder === "latest") {
            return arr.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        } else if (sortOrder === "title") { // 주석 해제하여 사용 가능
            return arr.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
        }
        return arr;
    }, [favoriteMovies, sortOrder]);

    useEffect(() => {
        const totalPages = Math.ceil(sortedMovies.length / ITEMS_PER_PAGE) || 0;
        setPageInfo(prev => ({
            ...prev,
            currentPage: prev.currentPage >= totalPages ? 0 : prev.currentPage,
            pageContentAmount: totalPages,
        }));
    }, [sortedMovies]);

    const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentMovies = sortedMovies.slice(startIdx, endIdx);

    // userProfile이 로드되기 전에는 로딩 상태를 표시
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
                    <PageTitle>내가 <PinkText>찜한 영화</PinkText></PageTitle>
                </PageHeader>
                <SortOptions>
                    <SortButton
                        $isActive={sortOrder === "latest"}
                        onClick={() => setSortOrder("latest")}
                    >
                        최신순
                    </SortButton>
                    {/* 제목순 정렬 버튼을 활성화하려면 아래 주석을 해제하세요 */}
                    <SortButton
                      $isActive={sortOrder === "title"}
                      onClick={() => setSortOrder("title")}
                    >
                      제목순
                    </SortButton>
                </SortOptions>
                {currentMovies && currentMovies.length > 0 ? (
                    <>
                        {/* isEmpty prop을 currentMovies.length === 0으로 전달합니다. */}
                        <MovieCardGrid isEmpty={currentMovies.length === 0}>
                            {currentMovies.map((movie: FavoriteMovieType) => (
                                <MovieCard key={movie.myPickId} movie={movie} />
                            ))}
                        </MovieCardGrid>
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