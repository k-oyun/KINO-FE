import styled from "styled-components";
import StarRatings from "react-star-ratings";
import { useEffect, useState } from "react";

interface ShortReviewProps {
  isMobile: boolean;
  movieId: number;
}

interface styleType {
  $ismobile: boolean;
}

const ReviewContainer = styled.div<{ $ismobile: boolean }>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => (props.$ismobile ? "15px" : "30px")};
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
`;

const ShortWrite = styled.div`
  margin: 20px 0;
  border-radius: 8px;
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
`;

const ShortText = styled.textarea`
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 8px;
  padding: 20px;
  resize: none;
  height: 80px;
  outline: none;
`;

const ShortButton = styled.button<styleType>`
  background-color: #fd6782;
  color: white;
  border: none;
  max-width: 150px;
  margin: 0 10px 10px auto;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "10px")};
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f73c63;
  }
`;

const ReviewList = styled.ul<{ $ismobile: boolean }>`
  list-style-type: none;
  margin-top: 10px;
`;

const ReviewItem = styled.li`
  background-color: rgba(217, 217, 217, 0.8);
`;

const ReviewText = styled.li<{ $ismobile: boolean }>`
  margin-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")};
  font-size: ${(props) => (props.$ismobile ? "14px" : "18px")};
  line-height: ${(props) => (props.$ismobile ? "1.4" : "1.6")};
  color: #333;
  padding: ${(props) => (props.$ismobile ? "10px" : "20px")};
  border-radius: ${(props) => (props.$ismobile ? "8px" : "12px")};
  box-shadow: ${(props) =>
    props.$ismobile ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.02);
    box-shadow: ${(props) =>
      props.$ismobile ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  }
  border-bottom: 1px solid #000;
`;

const ReviewLike = styled.div``;

const ShortReview = ({ isMobile, movieId }: ShortReviewProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviews, setReviews] = useState<string[]>([]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    // Fetch short reviews for the movie
    const fetchedReviews = [
      "Great movie with stunning visuals!",
      "A heartwarming story that resonates.",
      "The acting was top-notch, especially the lead.",
      "An emotional rollercoaster from start to finish.",
      "Loved the cinematography and soundtrack!",
    ];
    setReviews(fetchedReviews);
  }, []);

  return (
    <ReviewContainer $ismobile={isMobile}>
      <StarRatings
        rating={rating}
        numberOfStars={5}
        name="rating"
        starDimension={isMobile ? "30px" : "50px"}
        starSpacing={isMobile ? "2px" : "4px"}
        changeRating={handleRatingChange}
        starEmptyColor="#d9d9d9"
        starHoverColor="#F73C63"
        starRatedColor="#FD6782"
      ></StarRatings>
      {rating > 0 && (
        <ShortWrite>
          <ShortText
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="한줄평을 남겨주세요!"
          ></ShortText>
          <ShortButton $ismobile={isMobile}>리뷰 작성</ShortButton>
        </ShortWrite>
      )}
      <ReviewList $ismobile={isMobile}>
        {reviews.map((review, id) => (
          <ReviewItem>
            <ReviewText key={id} $ismobile={isMobile}>
              {review}
            </ReviewText>
            <ReviewLike>좋아요 몇 개?</ReviewLike>
          </ReviewItem>
        ))}
      </ReviewList>
    </ReviewContainer>
  );
};

export default ShortReview;
