import styled from "styled-components";
import StarRatings from "react-star-ratings";
import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import useMovieDetailApi from "../api/details";

interface ShortReviewProps {
  isMobile: boolean;
  movieId: number;
}

interface styleType {
  $ismobile: boolean;
}

interface Review {
  shortReviewId: number;
  userId: number;
  userNickname: string;
  userProfile: string;
  content: string;
  createdAt: string;
  mine: boolean;
  likeCount: number;
  liked: boolean;
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

const Heart = styled.button<{ $heartUrl: string }>`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-image: url(${(props) => props.$heartUrl});
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;

  background-size: 24px 24px;
  border: none;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
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
  const [liked, setLiked] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [editReviewId, setEditReviewId] = useState<number>(0);
  const [editText, setEditText] = useState<string>("");
  const {
    postShortReview,
    updateShortReview,
    deleteShortReview,
    getShortReviews,
    likeShortReview,
    unlikeShortReview,
  } = useMovieDetailApi();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  const handleReviewWrite = () => {
    if (review.trim() === "") {
      // alert("한줄평을 입력해주세요.");
      return;
    }
    try {
      const res = postShortReview(movieId, review);
      res.then((data: { data: Review }) => {
        console.log("Review written successfully:", data);
        setReviews((prevReviews) => [
          ...prevReviews,
          { ...data.data, mine: true },
        ]);
        setReview("");
      });
    } catch (error: any) {
      console.error("Error writing review:", error);
      // alert("리뷰 작성에 실패했습니다.");
    }
  };
  const handleLikeClick = (reviewId: number) => {
    console.log("Like button clicked: ");
    setLiked(!liked);
    if (!liked) {
      likeShortReview(reviewId);
    } else {
      unlikeShortReview(reviewId);
    }
  };
  const handleReportClick = () => {
    setIsReportOpen(true);
  };
  const handleReviewEdit = (reviewId: number, oldContent: string) => {
    setEditReviewId(reviewId);
    setEditText(oldContent);
  };
  const handleReviewUpdate = () => {
    if (editText.trim() === "") {
      // alert("한줄평을 입력해주세요.");
      return;
    }
    try {
      const res = updateShortReview(movieId, editReviewId, editText);
      res.then((data) => {
        console.log("Review updated successfully:", data);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.shortReviewId === editReviewId
              ? { ...review, content: editText }
              : review
          )
        );
        setEditReviewId(0);
        setEditText("");
      });
    } catch (error: any) {
      console.error("Error updating review:", error);
      // alert("리뷰 수정에 실패했습니다.");
    }
  };

  const handleEditCancel = () => {
    setEditReviewId(0);
    setEditText("");
  };
  const handleReviewDelete = (reviewId: number) => {
    try {
      const res = deleteShortReview(movieId, reviewId);
      res.then(() => {
        console.log("Review deleted successfully");
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.shortReviewId !== reviewId)
        );
      });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      // alert("리뷰 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    try {
      const res = getShortReviews(movieId);
      res.then((data) => {
        console.log("Fetched short reviews:", data.data.content);
        setReviews(data.data.content);
      });
    } catch (error: any) {
      console.error("Error fetching short reviews:", error.message);
    }
  }, []);

  return (
    <>
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
            <ShortButton
              $ismobile={isMobile}
              onClick={() => handleReviewWrite()}
            >
              리뷰 작성
            </ShortButton>
          </ShortWrite>
        )}
        <ReviewList $ismobile={isMobile}>
          {reviews.map((review, id) => (
            <ReviewItem key={id} $ismobile={isMobile}>
              <UserProfile $ismobile={isMobile}>
                <UserImage
                  $ismobile={isMobile}
                  src={review.userProfile}
                  alt={review.userNickname}
                />
                <UserText $ismobile={isMobile}>
                  <UserNickname $ismobile={isMobile} /> {review.userNickname}
                  <UserCreatedAt $ismobile={isMobile}>
                    {review.createdAt}
                  </UserCreatedAt>
                </UserText>
              </UserProfile>
              {editReviewId === review.shortReviewId ? (
                <>
                  <ShortText
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="한줄평을 남겨주세요!"
                  ></ShortText>
                  <ShortButton
                    $ismobile={isMobile}
                    onClick={() => handleReviewUpdate()}
                  >
                    수정
                  </ShortButton>
                  <ShortButton
                    $ismobile={isMobile}
                    onClick={() => handleEditCancel()}
                  >
                    취소
                  </ShortButton>
                </>
              ) : (
                <ReviewText $ismobile={isMobile}>{review.content}</ReviewText>
              )}
              <UnderBar $ismobile={isMobile}>
                <ReviewLike $ismobile={isMobile}>
                  <Heart
                    $heartUrl={
                      liked
                        ? "https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                        : "https://img.icons8.com/?size=100&id=12306&format=png&color=000000"
                    }
                    onClick={() => handleLikeClick(review.shortReviewId)}
                  ></Heart>
                  {review.likeCount}
                </ReviewLike>
                <UserCreatedAt
                  $ismobile={isMobile}
                  style={{ margin: "0 6px 0 0" }}
                >
                  {review.createdAt}
                </UserCreatedAt>
                <Btn $ismobile={isMobile} onClick={() => handleReportClick()}>
                  신고
                </Btn>
                {review.mine && (
                  <>
                    <Btn
                      $ismobile={isMobile}
                      onClick={() =>
                        handleReviewEdit(review.shortReviewId, review.content)
                      }
                    >
                      {" "}
                      | 수정
                    </Btn>
                    <Btn
                      $ismobile={isMobile}
                      onClick={() => handleReviewDelete(review.shortReviewId)}
                    >
                      | 삭제
                    </Btn>
                  </>
                )}
              </UnderBar>
            </ReviewItem>
          ))}
        </ReviewList>
      </ReviewContainer>
      {isReportOpen && <ReportModal setIsModalOpen={setIsReportOpen} />}
    </>
  );
};

export default ShortReview;
