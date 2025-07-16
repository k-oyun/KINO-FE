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

interface Review {
  userId: string;
  nickname: string;
  image: string;
  content: string;
  likes: number;
  createdAt: string;
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

const ReviewItem = styled.li<styleType>`
  background-color: rgba(217, 217, 217, 0.8);
  margin-bottom: 15px;
  border-radius: ${(props) => (props.$ismobile ? "8px" : "12px")};
  box-shadow: ${(props) =>
    props.$ismobile ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)"};
`;

const UserProfile = styled.div<styleType>`
  padding: ${(props) => (props.$ismobile ? "10px" : "20px")};
  padding-bottom: 0;
  display: flex;
`;

const UserImage = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "40px" : "60px")};
  height: ${(props) => (props.$ismobile ? "40px" : "60px")};
  border: 2px solid #fd6782;
  object-fit: cover;
  border-radius: 50%;
  &:hover {
    border: 3px solid #f73c63;
  }
`;

const UserText = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.$ismobile ? "15px" : "20px")};
  margin-top: ${(props) => (props.$ismobile ? "3px" : "6px")};
`;

const UserNickname = styled.div<styleType>`
  font-weight: bold;
  font-size: ${(props) => (props.$ismobile ? "12px" : "18px")};
`;

const UserCreatedAt = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "10px" : "12px")};
  color: #333;
  margin-top: ${(props) => (props.$ismobile ? "2px" : "10px")};
`;

const ReviewText = styled.div<{ $ismobile: boolean }>`
  margin: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
  font-size: ${(props) => (props.$ismobile ? "14px" : "18px")};
  line-height: ${(props) => (props.$ismobile ? "1.4" : "1.6")};
  color: #000;
  padding: ${(props) => (props.$ismobile ? "5px 60px" : "5px 85px")};
  border-bottom: 1px solid #000;
`;

const UnderBar = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
  color: #666;
`;

const ReviewLike = styled.div<styleType>`
  padding: ${(props) => (props.$ismobile ? "10px" : "20px")};
  margin-right: auto;
`;

const Btn = styled.button<styleType>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: ${(props) => (props.$ismobile ? "10px" : "16px")};
  margin-left: ${(props) => (props.$ismobile ? "5px" : "6px")};
  color: #666;
  &:hover {
    color: #333;
  }
`;

const ShortReview = ({ isMobile, movieId }: ShortReviewProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    // Fetch short reviews for the movie
    const fetchedReviews: Review[] = [
      {
        userId: "user_001",
        nickname: "Emily Kim",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        content: "Great movie with stunning visuals!",
        likes: 18,
        createdAt: "2025-07-13T16:23:00+09:00",
      },
      {
        userId: "user_002",
        nickname: "Jinwoo Park",
        image: "https://randomuser.me/api/portraits/men/24.jpg",
        content: "A heartwarming story that resonates.",
        likes: 27,
        createdAt: "2025-07-13T16:23:00+09:00",
      },
      {
        userId: "user_003",
        nickname: "Sophie Lee",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        content: "The acting was top-notch, especially the lead.",
        likes: 14,
        createdAt: "2025-07-13T16:23:00+09:00",
      },
      {
        userId: "user_004",
        nickname: "Minjae Choi",
        image: "https://randomuser.me/api/portraits/men/37.jpg",
        content: "An emotional rollercoaster from start to finish.",
        likes: 33,
        createdAt: "2025-07-13T16:23:00+09:00",
      },
      {
        userId: "user_005",
        nickname: "Eunji Cho",
        image: "https://randomuser.me/api/portraits/women/21.jpg",
        content: "Loved the cinematography and soundtrack!",
        likes: 21,
        createdAt: "2025-07-13T16:23:00+09:00",
      },
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
          <ReviewItem key={id} $ismobile={isMobile}>
            <UserProfile $ismobile={isMobile}>
              <UserImage
                $ismobile={isMobile}
                src={review.image}
                alt={review.nickname}
              />
              <UserText $ismobile={isMobile}>
                <UserNickname $ismobile={isMobile} /> {review.nickname}
                <UserCreatedAt $ismobile={isMobile}>
                  {review.createdAt}
                </UserCreatedAt>
              </UserText>
            </UserProfile>
            <ReviewText $ismobile={isMobile}>{review.content}</ReviewText>
            <UnderBar $ismobile={isMobile}>
              <ReviewLike $ismobile={isMobile}>
                <Btn $ismobile={isMobile}>♥</Btn> {review.likes}
              </ReviewLike>
              <UserCreatedAt
                $ismobile={isMobile}
                style={{ margin: "0 6px 0 0" }}
              >
                {review.createdAt}
              </UserCreatedAt>
              <Btn $ismobile={isMobile}>신고 |</Btn>
              <Btn $ismobile={isMobile}> 수정 |</Btn>
              <Btn $ismobile={isMobile}> 삭제</Btn>
            </UnderBar>
          </ReviewItem>
        ))}
      </ReviewList>
    </ReviewContainer>
  );
};

export default ShortReview;
