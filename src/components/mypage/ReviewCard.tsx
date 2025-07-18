import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DetailReviewCard from "./DetailReviewCard";

interface ShortReview {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
  reviewer?: Reviewer;
  title: string;
  views: number;
  comments: number;
}

interface DetailReview {
  id: string;
  title: string;
  content: string;
  likes: number;
  views: number; 
  comments: number;
  createdAt: string;
  reviewer?: { 
    id: string;
    nickname: string;
    image: string;
  };
}

// --- 공통 스타일드 컴포넌트 ---
const CardBase = styled.div`
  background-color: #1a1a1a;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #333;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ReviewText = styled.p`
  margin: 0;
  color: #ddd;
  font-size: 0.95em;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieTitleText = styled.h3`
  font-weight: bold;
  color: #e0e0e0;
  font-size: 1.1em;
  margin: 0;
`;

const MetaInfo = styled.div`
  font-size: 0.8em;
  color: #888;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RatingDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #ffd700;
`;

const LikesDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #f0f0f0;
`;

const ThreeDotsMenu = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0 5px;
  &:hover {
    color: #f0f0f0;
  }
`;

// --- ShortReviewCard 컴포넌트 ---
const ShortReviewCardContainer = styled(CardBase)`
  /* 추가적인 ShortReviewCard 고유 스타일 (현재는 없음) */
`;

const ShortReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const ShortReviewMovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ShortReviewContent = styled(ReviewText)`
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
`;

const ShortReviewMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

interface ShortReviewCardProps {
  review: ShortReview;
  onClick: () => void;
}

const ShortReviewCard: React.FC<ShortReviewCardProps> = ({
  review,
  onClick,
}) => (
  <ShortReviewCardContainer onClick={onClick}>
    <ShortReviewHeader>
      <ShortReviewMovieInfo>
        <MovieTitleText>{review.movieTitle}</MovieTitleText>
      </ShortReviewMovieInfo>
      <ThreeDotsMenu>...</ThreeDotsMenu>
    </ShortReviewHeader>
    <ShortReviewContent>{review.content}</ShortReviewContent>
    <ShortReviewMeta>
      <MetaInfo>
        <RatingDisplay>⭐ {review.rating}</RatingDisplay>
        <LikesDisplay>👍 {review.likes}</LikesDisplay>
      </MetaInfo>
      <MetaInfo>{review.createdAt}</MetaInfo>
    </ShortReviewMeta>
  </ShortReviewCardContainer>
);

// --- ReviewCard (메인 진입점) ---
interface ReviewCardProps {
  review: ShortReview | DetailReview;
  type: "short" | "detail";
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (type === "short") {
      navigate(`/reviews/short/${review.id}`);
    } else {
      navigate(`/reviews/detail/${review.id}`);
    }
  };

  return (
    <>
      {type === "short" && (
        <ShortReviewCard
          review={review as ShortReview}
          onClick={handleCardClick}
        />
      )}
      {type === "detail" &&
        review.title &&
        review.likes &&
        review.comments &&
        review.views && (
          <DetailReviewCard
            review={{
              reviewId: review.id,
              userProfile: reviewer.image,
              userNickname: reviewer.nickname,
              title: review.title,
              content: review.content,
              likeCount: review.likes,
              totalViews: review.views,
              commentCount: review.comments,
              createdAt: review.createdAt,
            }}
            isMine={true}
            showProfile={false}
            onClick={handleCardClick}
          />
        )}
    </>
  );
};

export default ReviewCard;