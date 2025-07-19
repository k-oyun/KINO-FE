import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ShortReviewCard from "../../components/mypage/ShortReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from '../../components/VideoBackground';

interface ShortReviewType {
    shortReviewId: string;
    movieTitle: string;
    content: string;
    rating: number;
    likes: number;
    createdAt: string;
}

const parseDateString = (dateStr: string): Date => {
    const parts = dateStr.split(/[. :]/).map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
};

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
    border-radius: 8px;
    margin-bottom: 25px;

    @media (max-width: 767px) {
        padding: 20px;
        margin-bottom: 15px;
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
    color: ${(props) => (props.isActive ? "#e0e0e0" : "#888")};
    font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
    cursor: pointer;
    padding: 5px 0;
    position: relative;

    &:hover {
        color: #f0f0f0;
    }

    ${(props) =>
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
    /* gap: 15px; -> ShortReviewCard의 margin-bottom으로 간격 조절 */

    @media (max-width: 767px) {
        /* gap: 10px; */
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

const MyReviewsShortPage: React.FC = () => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<"latest" | "likes">("latest");
    const { mypageShortReview } = useMypageApi();

    const [shortReviews, setShortReviews] = useState<ShortReviewType[]>([]);

    useEffect(() => {
        const myShortReviewGet = async () => {
            const res = await mypageShortReview();
            const shortReview = Array.isArray(res.data.data.shortReviews)
                ? res.data.data.shortReviews
                : [];
            console.log(res.data.data.shortReviews);
            setShortReviews(shortReview);
        };

        myShortReviewGet();
    }, []);

    const sortedReviews = [...shortReviews].sort((a, b) => {
        if (sortOrder === "latest") {
            return (
                parseDateString(b.createdAt).getTime() -
                parseDateString(a.createdAt).getTime()
            );
        } else if (sortOrder === "likes") {
            return b.likes - a.likes;
        }
        return 0;
    });

    const handleReviewClick = (reviewId: string) => {
        // 한줄평 상세 페이지로 이동 (필요하다면)
        navigate(`/reviews/short/${reviewId}`);
    };

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
                    <PageTitle>내가 작성한 <PinkText>한줄평</PinkText></PageTitle>
                </PageHeader>
                <SortOptions>
                    <SortButton
                        isActive={sortOrder === "latest"}
                        onClick={() => setSortOrder("latest")}
                    >
                        최신순
                    </SortButton>
                    <SortButton
                        isActive={sortOrder === "likes"}
                        onClick={() => setSortOrder("likes")}
                    >
                        좋아요순
                    </SortButton>
                </SortOptions>
                {sortedReviews && sortedReviews.length > 0 ? (
                    <ReviewList>
                        {sortedReviews.map((review: ShortReviewType) => (
                            <ShortReviewCard
                                key={review.shortReviewId}
                                review={review}
                                onClick={() =>
                                    handleReviewClick(review.shortReviewId)
                                }
                            />
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
