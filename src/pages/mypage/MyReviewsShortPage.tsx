import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 임포트
import ReviewCard from '../../components/mypage/ReviewCard';

// --- 백엔드 API 응답 구조에 맞는 타입 정의 ---
// 이 타입은 백엔드 응답의 'shortReviews' 배열 내 개별 객체와 일치해야 합니다.
interface ApiShortReview {
    shortReviewId: number; // shortReviewId 대신 id로 통일 가정
    content: string;
    movieTitle: string;
    createdAt: string;
    rating: number;
    likes: number; // likeCount 대신 likes로 통일
    views: number; // viewCount 대신 views로 통일
    userNickname?: string; // 이 페이지에서는 사용되지 않을 수 있지만, API에 있다면 유지.
    userProfileImage?: string; // 이 페이지에서는 사용되지 않을 수 있지만, API에 있다면 유지.
}

// 전체 API 응답 구조를 정의합니다.
interface ShortReviewsApiResponseData {
    // totalCount, currentPage, pageSize는 페이지네이션이 없으므로 제거합니다.
    shortReviews: ApiShortReview[];
}

interface ShortReviewsApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: ShortReviewsApiResponseData;
}

// --- 컴포넌트들이 사용하는 타입 정의 (매핑 후의 최종 형태) ---
// ReviewCard에 전달되는 ShortReviewType
interface ShortReviewType {
    id: string; // API의 number id를 string으로 변환
    movieTitle: string;
    content: string;
    rating: number;
    likes: number;
    createdAt: string;
    views: number;
}

// --- 스타일 컴포넌트들은 변경 없음 ---
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

const MyReviewsShortPage: React.FC = () => {
    const navigate = useNavigate();
    const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'latest' | 'views' | 'likes' | 'rating'>('latest');

    // fetchShortReviews 함수는 현재 정렬 순서에 맞춰 데이터를 불러옵니다.
    // 페이지네이션은 없으므로 page, size 파라미터는 제거하거나,
    // 백엔드에서 모든 데이터를 반환하도록 가정하고 API 호출합니다.
    const fetchShortReviews = async (sort: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // API 경로 및 쿼리 파라미터 (정렬만 포함)
            // 백엔드 API가 이 요청에 모든 데이터를 정렬하여 반환한다고 가정합니다.
            const response = await axios.get<ShortReviewsApiResponse>(
                `http://43.203.218.183:8080/api/mypage/shortReview?sort=${sort}`
            );
            const apiData = response.data.data;

            setShortReviews(
                apiData.shortReviews.map((review) => ({
                    id: review.shortReviewId.toString(), // API id는 number, 컴포넌트 id는 string
                    movieTitle: review.movieTitle,
                    content: review.content,
                    rating: review.rating,
                    likes: review.likes,
                    createdAt: review.createdAt,
                    views: review.views,
                }))
            );
        } catch (err) {
            console.error("한줄평 데이터를 불러오는 데 실패했습니다:", err);
            setError("한줄평을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시, 또는 정렬 순서 변경 시 데이터 호출
        fetchShortReviews(sortOrder);
    }, [sortOrder]); // sortOrder가 변경될 때마다 데이터를 다시 불러옵니다.

    // 클라이언트 측 정렬 (API에서 이미 정렬된 데이터를 받는다면 불필요할 수 있으나, 혹시 모를 상황 대비하여 유지)
    const sortedReviews = [...shortReviews].sort((a, b) => {
        if (sortOrder === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOrder === 'views') {
            return b.views - a.views; // 조회순은 보통 내림차순 (높은 조회수가 위로)
        } else if (sortOrder === 'likes') {
            return b.likes - a.likes; // 좋아요순은 보통 내림차순
        } else if (sortOrder === 'rating') {
            return b.rating - a.rating; // 별점순은 보통 내림차순
        }
        return 0;
    });

    if (isLoading) {
        return <EmptyState>한줄평 데이터를 불러오는 중입니다...</EmptyState>;
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
                            <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </BackButton>
                    <PageTitle>내가 작성한 한줄평</PageTitle>
                </PageHeader>
                <SortOptions>
                    <SortButton isActive={sortOrder === 'latest'} onClick={() => setSortOrder('latest')}>최신순</SortButton>
                    <SortButton isActive={sortOrder === 'views'} onClick={() => setSortOrder('views')}>조회순</SortButton>
                    <SortButton isActive={sortOrder === 'likes'} onClick={() => setSortOrder('likes')}>좋아요순</SortButton>
                    <SortButton isActive={sortOrder === 'rating'} onClick={() => setSortOrder('rating')}>별점순</SortButton>
                </SortOptions>
                {/* 데이터가 비어있지 않고, 불러온 shortReviews를 기반으로 정렬된 데이터를 보여줍니다. */}
                {shortReviews && shortReviews.length > 0 ? (
                    <ReviewList>
                        {sortedReviews.map((review: ShortReviewType) => (
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