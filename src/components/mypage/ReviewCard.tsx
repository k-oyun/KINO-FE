import React from "react";
import styled from "styled-components";

interface ShortReview {
  id: string;
  movieTitle: string;
  content: string;
  rating: number;
  likeCount: number;
  createdAt: string;
  viewCount?: number;
}

interface ShortReviewCardProps {
  review: ShortReview;
  onClick: () => void;
  isMobile?: boolean;
}

// --- 공통 스타일드 컴포넌트 ---
interface styleType {
  $ismobile?: boolean;
}

const CardBase = styled.div<styleType>`
  background-color: #1a1a1a;
  border-radius: 6px;
  padding: ${(props) => (props.$ismobile ? "10px 15px" : "15px 20px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #333;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  color: #f0f0f0;
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ReviewText = styled.p<styleType>`
  margin: 0;
  color: #ddd;
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "0.95em")};
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const MovieTitleText = styled.h3<styleType>`
  font-weight: bold;
  color: #e0e0e0;
  font-size: ${(props) => (props.$ismobile ? "1em" : "1.1em")};
  margin: 0;
`;

const MetaInfo = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "0.8em")};
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

// --- ShortReviewCard 컴포넌트 고유 스타일 ---
const ShortReviewCardContainer = styled(CardBase)`
  /* 특별한 추가 스타일 없음, CardBase를 직접 사용 */
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
  /* 이미 ReviewText에 -webkit-line-clamp: 2 적용됨 */
`;

const ShortReviewMeta = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "0.8em")};
`;

const ShortReviewCard: React.FC<ShortReviewCardProps> = ({
  review,
  onClick,
  isMobile,
}) => {
  // const formattedDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ko });
  // 현재 DUMMY 데이터의 createdAt이 "YYYY.MM.DD HH:MM" 형태이므로 직접 표시하거나 파싱 로직 필요
  const displayDate = review.createdAt; // DUMMY 데이터 형식에 맞춰 일단 문자열 그대로 표시

  return (
    <ShortReviewCardContainer onClick={onClick} $ismobile={isMobile}>
      <ShortReviewHeader>
        <ShortReviewMovieInfo>
          <MovieTitleText $ismobile={isMobile}>
            {review.movieTitle}
          </MovieTitleText>
        </ShortReviewMovieInfo>
        <ThreeDotsMenu>...</ThreeDotsMenu>
      </ShortReviewHeader>
      <ShortReviewContent $ismobile={isMobile}>
        {review.content}
      </ShortReviewContent>
      <ShortReviewMeta $ismobile={isMobile}>
        <MetaInfo $ismobile={isMobile}>
          <RatingDisplay>⭐ {review.rating}</RatingDisplay>
          <LikesDisplay>👍 {review.likeCount}</LikesDisplay>
          {review.viewCount && <span>👁️ {review.viewCount}</span>}
        </MetaInfo>
        <MetaInfo $ismobile={isMobile}>{displayDate}</MetaInfo>
      </ShortReviewMeta>
    </ShortReviewCardContainer>
  );
};

export default ShortReviewCard;