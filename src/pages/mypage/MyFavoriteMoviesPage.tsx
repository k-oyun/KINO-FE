import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import MovieCard from "../../components/mypage/MovieCard";
import VideoBackground from '../../components/VideoBackground';
import Pagination from "../../components/Pagenation";
import useMypageApi from "../../api/mypage";
import { useTranslation } from "react-i18next";

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

const ITEMS_PER_PAGE = 12;

const MyFavoriteMoviesPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { targetId: rawTargetId } = useParams<{ targetId?: string }>();

    const parsed = rawTargetId !== undefined ? Number(rawTargetId) : undefined;
    const targetUserId = rawTargetId && !Number.isNaN(parsed) ? parsed : undefined;
    const { mypageMyPickMovie, userInfoGet, mypageMain } = useMypageApi();

    const [sortOrder, setSortOrder] = useState<"latest" | "title">("latest");
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovieType[] | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(null);
    const [targetUserNickname, setTargetUserNickname] = useState<string | null>(null);

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        currentPage: 0,
        size: ITEMS_PER_PAGE,
        pageContentAmount: 0,
    });

    const fetchLoggedInUserProfile = useCallback(async () => {
        try {
            const res = await userInfoGet();
            setLoggedInUser(res.data?.data || null);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 로그인 사용자 프로필 로드 실패:", err);
            setLoggedInUser(null);
        }
    }, [userInfoGet]);

    const fetchTargetUserNickname = useCallback(async (uid: number) => {
        try {
            const res = await mypageMain(uid);
            const profile: UserProfileType | undefined = res.data?.data;
            setTargetUserNickname(profile?.nickname ?? t('mypage.userFallbackNickname', { userId: uid }));
        } catch {
            setTargetUserNickname(t('mypage.userFallbackNickname', { userId: uid }));
        }
    }, [mypageMain, t]);

    const loadFavoriteMovies = useCallback(async (userIdToLoad: number) => {
        try {
            const res = await mypageMyPickMovie(userIdToLoad);
            const pick = Array.isArray(res.data?.data?.myPickMovies)
                ? res.data.data.myPickMovies
                : [];
            setFavoriteMovies(pick);
        } catch (err) {
            console.error("[MyFavoriteMoviesPage] 찜한 영화 로드 실패:", err);
            setFavoriteMovies([]);
        }
    }, [mypageMyPickMovie]);

    useEffect(() => {
        fetchLoggedInUserProfile();
    }, [fetchLoggedInUserProfile]);

    useEffect(() => {
        const userIdToLoad = targetUserId ?? loggedInUser?.userId;

        if (userIdToLoad == null || Number.isNaN(userIdToLoad)) {
            if (loggedInUser === null && targetUserId === undefined) {
                // empty
            } else {
                setFavoriteMovies([]);
            }
            return;
        }

        loadFavoriteMovies(userIdToLoad);

        if (targetUserId != null && targetUserId !== loggedInUser?.userId) {
            fetchTargetUserNickname(targetUserId);
        } else {
            setTargetUserNickname(loggedInUser?.nickname ?? null);
        }
    }, [loggedInUser, targetUserId, loadFavoriteMovies, fetchTargetUserNickname]);

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

    useEffect(() => {
        const totalPages = Math.ceil(sortedMovies.length / ITEMS_PER_PAGE);
        setPageInfo(prev => ({
            ...prev,
            currentPage: prev.currentPage >= totalPages && totalPages > 0 ? totalPages - 1 : prev.currentPage,
            pageContentAmount: totalPages,
        }));
    }, [sortedMovies]);

    const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentMovies = sortedMovies.slice(startIdx, endIdx);

    const isOwner = useMemo(() => {
        if (!loggedInUser) return false;
        if (targetUserId == null) return true;
        return targetUserId === loggedInUser.userId;
    }, [loggedInUser, targetUserId]);

    const isLoading =
        loggedInUser === null ||
        favoriteMovies === null ||
        (targetUserId != null && targetUserId !== loggedInUser.userId && targetUserNickname === null);

    if (isLoading) {
        return (
            <PageContainer>
                <VideoBackground />
                <EmptyState>{t('mypage.favoriteMovies.loadingData')}</EmptyState>
            </PageContainer>
        );
    }

    const pageTitlePrefix = isOwner
        ? t('mypage.favoriteMovies.titlePrefix.my')
        : targetUserNickname
            ? t('mypage.favoriteMovies.titlePrefix.other', { nickname: targetUserNickname })
            : t('mypage.favoriteMovies.titlePrefix.user');

    return (
        <PageContainer>
            <VideoBackground />
            <SectionWrapper>
                <PageHeader>
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
                    <PageTitle>{pageTitlePrefix} <PinkText>{t('myPickMovies')}</PinkText></PageTitle>
                </PageHeader>
                <SortOptions>
                    <SortButton
                        $isActive={sortOrder === "latest"}
                        onClick={() => setSortOrder("latest")}
                    >
                        {t('Bylatest')}
                    </SortButton>
                </SortOptions>
                {currentMovies && currentMovies.length > 0 ? (
                    <>
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
                    <EmptyState>{t('mypage.favoriteMovies.emptyState')}</EmptyState>
                )}
            </SectionWrapper>
        </PageContainer>
    );
};

export default MyFavoriteMoviesPage;