import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom"; // useParams 임포트 추가

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

// --- 스타일드 컴포넌트 (변경 없음) ---
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
    // URL 파라미터에서 targetId를 가져옵니다. (다른 사용자의 userId)
    const { targetId: rawTargetId } = useParams<{ targetId?: string }>();

    // 안전하게 targetId를 숫자로 파싱합니다.
    const parsed = rawTargetId !== undefined ? Number(rawTargetId) : undefined;
    const targetUserId = rawTargetId && !Number.isNaN(parsed) ? parsed : undefined;

    const { mypageMyPickMovie, userInfoGet, mypageMain } = useMypageApi(); // mypageMain API 훅 추가
    
    // 상태 정의
    const [sortOrder, setSortOrder] = useState<"latest" | "title">("latest");
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[] | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(null); // 로그인한 사용자 정보
    const [targetUserNickname, setTargetUserNickname] = useState<string | null>(null); // 보고 있는 페이지 주인의 닉네임

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        currentPage: 0,
        size: ITEMS_PER_PAGE,
        pageContentAmount: 0,
    });

    // 1. 로그인한 사용자 프로필을 비동기로 가져오는 함수
    const fetchLoggedInUserProfile = useCallback(async () => {
        try {
            const res = await userInfoGet();
            setLoggedInUser(res.data?.data || null);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 로그인 사용자 프로필 로드 실패:", err);
            setLoggedInUser(null);
        }
    }, [userInfoGet]);

    // 2. 보고 있는 페이지 주인의 닉네임을 가져오는 함수 (useCallback으로 메모이제이션)
    const fetchTargetUserNickname = useCallback(async (uid: number) => {
        try {
            const res = await mypageMain(uid);
            const profile: UserProfileType | undefined = res.data?.data;
            setTargetUserNickname(profile?.nickname ?? `사용자 ${uid}`);
        } catch {
            setTargetUserNickname(`사용자 ${uid}`); // 로드 실패 시 대체 닉네임
        }
    }, [mypageMain]);

    // 3. 찜한 영화 목록을 비동기로 가져오는 함수 (useCallback으로 메모이제이션)
    const loadFavoriteMovies = useCallback(async (userIdToLoad: number) => {
        try {
            const res = await mypageMyPickMovie(userIdToLoad);
            const pick = Array.isArray(res.data?.data?.myPickMovies)
                ? res.data.data.myPickMovies
                : [];
            setFavoriteMovies(pick);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 찜한 영화 로드 실패:", err);
            setFavoriteMovies([]); // 에러 발생 시 빈 배열로 설정
        }
    }, [mypageMyPickMovie]);

    // 4. 컴포넌트 마운트 시 로그인 사용자 프로필 로드 시작
    useEffect(() => {
        fetchLoggedInUserProfile();
    }, [fetchLoggedInUserProfile]);

    // 5. 로그인 사용자 정보 및 targetId에 따라 데이터 로드
    useEffect(() => {
        // 로드할 사용자 ID를 결정합니다.
        // URL에 targetId가 있으면 그것을 사용하고, 없으면 로그인한 사용자 ID를 사용합니다.
        const userIdToLoad = targetUserId ?? loggedInUser?.userId;

        if (userIdToLoad == null || Number.isNaN(userIdToLoad)) {
            // 로드할 userId가 아직 결정되지 않았거나 유효하지 않은 경우
            if (loggedInUser === null && targetUserId === undefined) {
                // 로그인 사용자 정보도 없고 targetId도 없는 초기 로딩 상태
                // 아무것도 하지 않아 Spinner나 로딩 메시지를 계속 표시할 수 있습니다.
            } else {
                // 로그인 사용자 정보 로드 실패 또는 잘못된 targetId로 인해 데이터를 불러올 수 없는 경우
                setFavoriteMovies([]); // 빈 배열로 설정하여 "찜한 영화 없음"을 표시
            }
            return;
        }

        // 찜한 영화 로드
        loadFavoriteMovies(userIdToLoad);

        // 타인 페이지일 경우 닉네임 로드
        if (targetUserId != null && targetUserId !== loggedInUser?.userId) {
            fetchTargetUserNickname(targetUserId);
        } else {
            setTargetUserNickname(loggedInUser?.nickname ?? null); // 내 페이지면 내 닉네임 사용
        }
    }, [loggedInUser, targetUserId, loadFavoriteMovies, fetchTargetUserNickname]);

    // 찜한 영화 정렬 로직 (useMemo로 성능 최적화)
    const sortedMovies = useMemo(() => {
        const arr = favoriteMovies ? [...favoriteMovies] : [];
        if (sortOrder === "latest") {
            return arr.sort((a, b) => {
                const dateA = new Date(a.releaseDate);
                const dateB = new Date(b.releaseDate);
                return dateB.getTime() - dateA.getTime();
            });
        } else if (sortOrder === "title") {
            return arr.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
        }
        return arr;
    }, [favoriteMovies, sortOrder]);

    // 페이지네이션 정보 업데이트 (sortedMovies 변경 시마다)
    useEffect(() => {
        const totalPages = Math.ceil(sortedMovies.length / ITEMS_PER_PAGE);
        setPageInfo(prev => ({
            ...prev,
            currentPage: prev.currentPage >= totalPages && totalPages > 0 ? totalPages - 1 : prev.currentPage,
            pageContentAmount: totalPages,
        }));
    }, [sortedMovies]);

    // 현재 페이지에 해당하는 영화 목록 계산
    const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentMovies = sortedMovies.slice(startIdx, endIdx);

    // 내가 보고 있는 페이지가 본인의 마이페이지인지 여부 판단
    const isOwner = useMemo(() => {
        if (!loggedInUser) return false; // 로그인 정보 없으면 판단 불가
        if (targetUserId == null) return true; // targetId 없으면 본인 페이지
        return targetUserId === loggedInUser.userId; // targetId가 내 userId와 같으면 본인 페이지
    }, [loggedInUser, targetUserId]);


    // ✨ 로딩 상태 처리
    // loggedInUser와 favoriteMovies가 모두 로드될 때까지 기다립니다.
    // targetId가 있을 경우 targetUserNickname도 로드되어야 합니다.
    const isLoading = 
        loggedInUser === null || 
        favoriteMovies === null ||
        (targetUserId != null && targetUserId !== loggedInUser.userId && targetUserNickname === null); // 타인 페이지면 닉네임 로드도 기다림

    if (isLoading) {
        return (
            <PageContainer>
                <VideoBackground />
                <EmptyState>데이터를 로드 중입니다...</EmptyState>
            </PageContainer>
        );
    }
    
    // 페이지 제목 접두사 설정
    const pageTitlePrefix = isOwner 
        ? "내가" 
        : targetUserNickname 
            ? `${targetUserNickname} 님이` 
            : "사용자가"; // 닉네임 로드 실패 시 대체

    return (
        <PageContainer>
            <VideoBackground />
            <SectionWrapper>
                <PageHeader>
                    {/* 뒤로 가기 버튼: isOwner 여부에 따라 경로 조정 */}
                    <BackButton 
                        onClick={() => 
                            navigate(isOwner ? "/mypage" : `/mypage/${targetUserId}`)
                        }
                    >
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
                    <PageTitle>{pageTitlePrefix} <PinkText>찜한 영화</PinkText></PageTitle>
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