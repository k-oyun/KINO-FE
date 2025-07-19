import styled from "styled-components";
import { useEffect, useState } from "react";
import DetailReviewCard from "./mypage/DetailReviewCard";
import { useNavigate } from "react-router-dom";
import useMovieDetailApi from "../api/details";

interface ReviewProps {
  isMobile: boolean;
  movieId: number;
}

interface StyleType {
  $ismobile: boolean;
}

interface Review {
  reviewId: string;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  mine: boolean;
  liked: boolean;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
}

const ReviewContainer = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => (props.$ismobile ? "15px" : "30px")};
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
`;

const Head = styled.div<StyleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${(props) => (props.$ismobile ? "10px" : "10px")};
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1.1em")};
  margin-bottom: ${(props) => (props.$ismobile ? "6px" : "10px")};
`;

const WriteBtn = styled.button<StyleType>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fd6782;
  color: white;
  border: none;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "6px 12px")};
  font-size: ${(props) => (props.$ismobile ? "10px" : "20px")};
  cursor: pointer;
  &:hover {
    background-color: #f73c63;
  }
`;

const Review = ({ isMobile, movieId }: ReviewProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();
  const { getReviews } = useMovieDetailApi();

  useEffect(() => {
    try {
      const res = getReviews(movieId);
      res.then((data) => {
        console.log("Fetched reviews:", data.data.data.content);
        setReviews(data.data.data.content);
      });
    } catch (error: any) {
      console.error("Error fetching reviews:", error.message);
    }
  }, []);

  return (
    <ReviewContainer $ismobile={isMobile}>
      <Head $ismobile={isMobile}>
        <div>리뷰가 총 {reviews ? reviews.length : 0} 개 등록되어 있어요!</div>
        <WriteBtn $ismobile={isMobile}>작성하기</WriteBtn>
      </Head>
      {reviews &&
        reviews.map((review) => (
          <DetailReviewCard
            key={review.reviewId}
            review={review}
            isMine={review.mine} // 임시로 첫 번째 리뷰어가 작성한 것으로 간주
            showProfile={true}
            isMobile={isMobile}
            onClick={() => navigate(`/community/${review.reviewId}`)}
          />
        ))}
    </ReviewContainer>
  );
};

export default Review;
