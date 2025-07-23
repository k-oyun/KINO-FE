import styled from "styled-components";
import StarRatings from "react-star-ratings";
import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import useMovieDetailApi from "../api/details";
import useReviewsApi from "../api/reviews";
import { formatDistanceToNow, set } from "date-fns";
import { ko } from "date-fns/locale";
import { formatDate, utcToKstString } from "../utils/date";
import { useTranslation } from "react-i18next";
import DefaultProfileImg from "../assets/img/profileIcon.png";
import { useDialog } from "../context/DialogContext";
import { useNavigate } from "react-router-dom";

interface ShortReviewProps {
  isMobile: boolean;
  movieId: number;
  isUserActive: boolean;
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
  rating: number;
  mine: boolean;
  likeCount: number;
  liked: boolean;
  isReviewActive: boolean;
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

const ShortText = styled.textarea<styleType>`
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 8px;
  padding: 20px;
  resize: none;
  height: ${(props) => (props.$ismobile ? "60px" : "80px")};
  outline: none;
`;

const ShortButton = styled.button<{ $isEdit: boolean } & styleType>`
  background-color: #fd6782;
  color: white;
  border: none;
  max-width: 150px;
  margin: ${(props) => (props.$isEdit ? "0 2px" : "0 10px 10px auto")};
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "5px" : "10px")};
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f73c63;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
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
  padding-top: ${(props) => (props.$ismobile ? "15px" : "20px")};
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
  margin-right: ${(props) => (props.$ismobile ? "10px" : "20px")};
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

const EditBox = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  margin: ${(props) => (props.$ismobile ? "10px" : "20px")};
  padding: ${(props) => (props.$ismobile ? "0 10px" : "0 20px")};
`;

const EditBtns = styled.div<styleType>`
  display: flex;
  margin: ${(props) => (props.$ismobile ? "5px 0 10px 0" : "10px 0 20px 0")};
  margin-left: auto;
`;

const UnderBar = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) =>
    props.$ismobile ? "0 20px 0 10px" : "0 30px 10px 20px"};
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
  color: #666;
`;

const ReviewLike = styled.div<styleType>`
  padding: ${(props) => (props.$ismobile ? "3px 10px" : "5px 20px 3px 20px")};
  margin-right: auto;
  display: flex;
  align-items: center;
`;

const Heart = styled.button<{ $heartUrl: string } & styleType>`
  width: ${(props) => (props.$ismobile ? "17px" : "24px")};
  height: ${(props) => (props.$ismobile ? "20px" : "24px")};
  cursor: pointer;
  background-image: url(${(props) => props.$heartUrl});
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: none;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span<styleType>`
  margin-left: ${(props) => (props.$ismobile ? "3px" : "6px")};
  font-size: ${(props) => (props.$ismobile ? "12px" : "16px")};
`;

const Btn = styled.button<styleType>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: ${(props) => (props.$ismobile ? "10px" : "16px")};
  margin-left: ${(props) => (props.$ismobile ? "5px" : "6px")};
  margin-top: ${(props) => (props.$ismobile ? "1px" : "8px")};

  color: #666;
  &:hover {
    color: #333;
  }
`;

const WarningBoxWrapper = styled.div<styleType>`
  display: flex;
  justify-content: center;
  padding: ${(props) => (props.$ismobile ? "10px" : "20px")};
`;

const WarningBox = styled.div<styleType>`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  font-size: ${(props) => (props.$ismobile ? "10px" : "16px")};
  width: ${(props) => (props.$ismobile ? "" : "80%")};
`;

const ShortReview = ({ isMobile, movieId, isUserActive }: ShortReviewProps) => {
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [editReviewId, setEditReviewId] = useState<number>(0);
  const [editText, setEditText] = useState<string>("");
  const [reportedReviewId, setReportedReviewId] = useState<number>(0);
  const [reporteeId, setReporteeId] = useState<number>(0);
  const { postShortReviewReport } = useReviewsApi();
  const {
    postShortReview,
    updateShortReview,
    deleteShortReview,
    getShortReviews,
    likeShortReview,
  } = useMovieDetailApi();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setEditReviewId(0); // Reset edit mode when rating changes
    setEditText(""); // Clear edit text when rating changes
  };
  const handleEditRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  const handleReviewWrite = () => {
    if (review.trim() === "") {
      // alert("한줄평을 입력해주세요.");
      return;
    }
    try {
      const res = postShortReview(movieId, rating, review);
      res.then((data) => {
        console.log("Review written successfully:", data);
        setReviews((prevReviews) => [{ ...data.data.data }, ...prevReviews]);
        setReview("");
        setRating(0);
      });
    } catch (error: any) {
      console.error("Error writing review:", error);
    }
  };
  const handleLikeClick = (reviewId: number, liked: boolean) => {
    console.log("Like button clicked: ");
    if (!liked) {
      likeShortReview(reviewId).then((data) => {
        console.log("Review liked successfully:", data);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.shortReviewId === reviewId
              ? { ...review, liked: true, likeCount: ++review.likeCount }
              : review
          )
        );
      });
    } else {
      likeShortReview(reviewId).then((data) => {
        console.log("Review unliked successfully:", data);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.shortReviewId === reviewId
              ? { ...review, liked: false, likeCount: --review.likeCount }
              : review
          )
        );
      });
    }
  };
  const handleReportClick = (shortReviewId: number, userId: number) => {
    setReportedReviewId(shortReviewId);
    setReporteeId(userId);
    setIsReportOpen(true);
  };
  const handleReviewEdit = (
    reviewId: number,
    oldContent: string,
    reviewRating: number
  ) => {
    setEditReviewId(reviewId);
    setEditText(oldContent);
    setRating(reviewRating); // Reset rating after editing
    console.log("Editing review:", editReviewId, oldContent);
  };

  const editConfirm = () => {
    openDialog({
      title: t("editTitle"),
      message: t("editConfirmMessage"),
      showCancel: true,
      isRedButton: true,
      onConfirm: () => {
        closeDialog();
        handleReviewUpdate();
      },
      onCancel: () => closeDialog(),
    });
  };
  const handleReviewUpdate = () => {
    if (editText.trim() === "") {
      // alert("한줄평을 입력해주세요.");
      return;
    }
    try {
      const res = updateShortReview(movieId, editReviewId, rating, editText);
      res.then((data) => {
        console.log("Review updated successfully:", data);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.shortReviewId === editReviewId
              ? {
                  ...review,
                  content: editText,
                  createdAt: data.data.data.createdAt,
                }
              : review
          )
        );
        setEditReviewId(0);
        setEditText("");
        setRating(0);
      });
    } catch (error: any) {
      console.error("Error updating review:", error);
      openDialog({
        title: t("editTitle"),
        message: t("writeErrorMessage"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => closeDialog(),
      });
    }
  };

  const handleEditCancel = () => {
    setRating(0);
    setEditReviewId(0);
    setEditText("");
    setReview("");
  };

  const deleteConfirm = (reviewId: number) => {
    openDialog({
      title: t("deletePost"),
      message: t("deleteConfirm"),
      showCancel: true,
      isRedButton: true,
      onConfirm: () => {
        handleReviewDelete(reviewId);
        closeDialog();
      },
      onCancel: () => closeDialog(),
    });
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
      openDialog({
        title: t("deletePost"),
        message: t("deletePostFailure"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => closeDialog(),
      });
    }
  };

  const submitReport = async (type: number, content: string) => {
    try {
      // Report submission logic here
      console.log("Report submitted:", { type, content });
      const res = postShortReviewReport(
        type,
        content,
        reportedReviewId,
        reporteeId
      );
      res.then(() => {
        console.log("Report submitted successfully");
        // 완료 모달
      });
      setIsReportOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  useEffect(() => {
    try {
      const res = getShortReviews(movieId);
      res.then((data) => {
        console.log("Fetched short reviews:", data.data.data.content);
        setReviews(data.data.data.content);
      });
    } catch (error: any) {
      console.error("Error fetching short reviews:", error.message);
    }
  }, []);

  return (
    <>
      <ReviewContainer $ismobile={isMobile}>
        {editReviewId === 0 && (
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
        )}
        <div style={{ marginTop: "10px" }}>
          {rating > 0 && editReviewId === 0 && (
            <ShortWrite>
              <ShortText
                $ismobile={isMobile}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={
                  isUserActive
                    ? t("shortReviewPlaceholder")
                    : t("shortReviewBlockedPlaceholder")
                }
                disabled={!isUserActive}
              ></ShortText>
              <ShortButton
                $ismobile={isMobile}
                $isEdit={false}
                onClick={() => handleReviewWrite()}
                disabled={!isUserActive}
              >
                {t("submit")}
              </ShortButton>
            </ShortWrite>
          )}
        </div>
        <ReviewList $ismobile={isMobile}>
          {reviews &&
            reviews.map((review, id) => (
              <ReviewItem key={id} $ismobile={isMobile}>
                <UserProfile $ismobile={isMobile}>
                  <UserImage
                    $ismobile={isMobile}
                    src={review.userProfile || DefaultProfileImg}
                    alt={review.userNickname}
                    onClick={() => navigate(`/mypage/${review.userId}`)}
                  />
                  <UserText $ismobile={isMobile}>
                    <UserNickname $ismobile={isMobile} /> {review.userNickname}
                    <UserCreatedAt $ismobile={isMobile}>
                      {formatDistanceToNow(review.createdAt, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </UserCreatedAt>
                  </UserText>
                  {editReviewId === review.shortReviewId ? (
                    <StarRatings
                      rating={rating}
                      numberOfStars={5}
                      name="rating"
                      starDimension={isMobile ? "15px" : "30px"}
                      starSpacing={isMobile ? "1px" : "2px"}
                      changeRating={handleEditRatingChange}
                      starEmptyColor="#d9d9d9"
                      starHoverColor="#F73C63"
                      starRatedColor="#FD6782"
                    ></StarRatings>
                  ) : (
                    <StarRatings
                      rating={review.rating}
                      numberOfStars={5}
                      name="rating"
                      starDimension={isMobile ? "15px" : "30px"}
                      starSpacing={isMobile ? "1px" : "2px"}
                      starEmptyColor="#d9d9d9"
                      starRatedColor="#FD6782"
                    ></StarRatings>
                  )}
                </UserProfile>
                {editReviewId === review.shortReviewId ? (
                  <EditBox $ismobile={isMobile}>
                    <ShortText
                      $ismobile={isMobile}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    ></ShortText>
                    <EditBtns $ismobile={isMobile}>
                      <ShortButton
                        $ismobile={isMobile}
                        $isEdit={true}
                        onClick={() => editConfirm()}
                      >
                        {t("edit")}
                      </ShortButton>
                      <ShortButton
                        $ismobile={isMobile}
                        $isEdit={true}
                        onClick={() => handleEditCancel()}
                      >
                        {t("cancel")}
                      </ShortButton>
                    </EditBtns>
                  </EditBox>
                ) : !review.isReviewActive ? (
                  <WarningBoxWrapper $ismobile={isMobile}>
                    {" "}
                    <WarningBox $ismobile={isMobile}>
                      🚫 {t("thisPostWasBlockedByAdmin")}
                    </WarningBox>
                  </WarningBoxWrapper>
                ) : (
                  <>
                    <ReviewText $ismobile={isMobile}>
                      {review.content}
                    </ReviewText>
                    <UnderBar $ismobile={isMobile}>
                      <ReviewLike $ismobile={isMobile}>
                        <Heart
                          $ismobile={isMobile}
                          $heartUrl={
                            review.liked
                              ? "https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                              : "https://img.icons8.com/?size=100&id=12306&format=png&color=000000"
                          }
                          onClick={() =>
                            handleLikeClick(review.shortReviewId, review.liked)
                          }
                        />
                        <LikeCount $ismobile={isMobile} />
                        {review.likeCount}
                      </ReviewLike>
                      <UserCreatedAt $ismobile={isMobile}>
                        {utcToKstString(review.createdAt)}
                      </UserCreatedAt>

                      {review.mine ? (
                        <>
                          <Btn
                            $ismobile={isMobile}
                            onClick={() =>
                              handleReviewEdit(
                                review.shortReviewId,
                                review.content,
                                review.rating
                              )
                            }
                          >
                            {" "}
                            {t("edit")}
                          </Btn>
                          <Btn
                            $ismobile={isMobile}
                            onClick={() => deleteConfirm(review.shortReviewId)}
                          >
                            | {t("delete")}
                          </Btn>
                        </>
                      ) : (
                        <Btn
                          $ismobile={isMobile}
                          onClick={() =>
                            handleReportClick(
                              review.shortReviewId,
                              review.userId
                            )
                          }
                        >
                          {t("report")}
                        </Btn>
                      )}
                    </UnderBar>
                  </>
                )}
              </ReviewItem>
            ))}
        </ReviewList>
      </ReviewContainer>
      {isReportOpen && (
        <ReportModal
          setIsModalOpen={setIsReportOpen}
          onSubmit={({ type, content }) => {
            submitReport(type, content);
          }}
        />
      )}
    </>
  );
};

export default ShortReview;
