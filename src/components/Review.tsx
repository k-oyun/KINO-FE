import styled from "styled-components";
import { useEffect, useState } from "react";
import DetailReviewCard from "./mypage/DetailReviewCard";
import { useNavigate } from "react-router-dom";
import useMovieDetailApi from "../api/details";
import { useTranslation } from "react-i18next";

interface ReviewProps {
  isMobile: boolean;
  movieTitle: string;
  movieId: number;
  isUserActive: boolean;
}

interface StyleType {
  $ismobile: boolean;
}

interface Review {
  reviewId: number;
  image: string;
  userId: number;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  isMine: boolean;
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
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Review = ({
  isMobile,
  movieId,
  movieTitle,
  isUserActive,
}: ReviewProps) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();
  const { getReviews } = useMovieDetailApi();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviews(movieId);
        console.log("Fetched reviews:", res.data.data);
        setReviews(res.data.data.content);
      } catch (error: unknown) {
        // 'any' 대신 'unknown' 사용
        if (error instanceof Error) {
          // 에러가 Error 타입인지 확인
          console.error("Error fetching reviews:", error.message);
        } else {
          console.error("Unknown error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, []); // 'getReviews'와 'movieId'를 의존성 배열에 추가

  return (
    <ReviewContainer $ismobile={isMobile}>
      <Head $ismobile={isMobile}>
        <div>{t("reviewCount", { count: reviews ? reviews.length : 0 })}</div>
        <WriteBtn
          $ismobile={isMobile}
          onClick={() => navigate(`/movie/${movieTitle}/new`)}
          disabled={!isUserActive}
        >
          {t("write")}
        </WriteBtn>
      </Head>
      {reviews &&
        reviews.map((review) => (
          <DetailReviewCard
            key={review.reviewId}
            review={review}
            isMine={review.isMine}
            showProfile={true}
            isMobile={isMobile}
            onClick={() => navigate(`/community/${review.reviewId}`)}
          />
        ))}
    </ReviewContainer>
  );
};

export default Review;
