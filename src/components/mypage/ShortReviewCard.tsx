import React, { useState } from "react";
import styled from "styled-components";
import { FaThumbsUp, FaEllipsisV, FaStar, FaRegStar } from "react-icons/fa";

interface ShortReview {
  movieId: number;            // 부모에서 꼭 전달되도록!
  shortReviewId: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

interface ShortReviewCardProps {
  review: ShortReview;
  onClick: () => void;
  onEdit: (updatedReview: ShortReview) => void;
  onDelete: (movieId: number, reviewId: string) => void;
  isMobile?: boolean;
}

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

const ShortReviewCardContainer = styled(CardBase)`
  position: relative;
`;

/* 버튼 대신 div로 변경해 nested <button> 경고 제거 */
const MenuTrigger = styled.div`
  background: none;
  border: none;
  color: #888;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0 5px;
  position: relative;

  &:hover {
    color: #f0f0f0;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  min-width: 80px;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  color: #f0f0f0;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #444;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalContent = styled.div`
  background: #222;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);

  h3 {
    margin: 0 0 10px 0;
    color: #e0e0e0;
    text-align: center;
  }

  input[type="text"],
  textarea {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: #f0f0f0;
    font-size: 1em;
    &:focus {
      outline: none;
      border-color: #ff69b4;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }

  .rating-input {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .star-icon {
    font-size: 1.5em;
    color: #ffc107;
    cursor: pointer;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;

const SaveButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #ff69b4;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #e05cb0;
  }
`;

const CancelButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #555;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #777;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const MovieTitle = styled.div`
  font-size: 1.1em;
  color: #e0e0e0;
`;

const CardContent = styled.div`
  font-size: 0.9em;
  color: #ccc;
  line-height: 1.4;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
  color: #999;
`;

const LikesAndRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff69b4;
  font-weight: bold;
  svg {
    font-size: 0.9em;
  }
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  color: #ffc107;
  gap: 2px;
  svg {
    font-size: 0.9em;
  }
`;

const ShortReviewCard: React.FC<ShortReviewCardProps> = ({
  review,
  onClick,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);

  /* 카드 클릭 시: 메뉴가 열려 있으면 닫기만, 아니면 부모 onClick */
  const handleCardClick = (e: React.MouseEvent) => {
    if (isMenuOpen) {
      setMenuOpen(false);
      e.stopPropagation();
    } else {
      onClick();
    }
  };

  /* 메뉴 > 수정 */
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  /* 메뉴 > 삭제 */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (review.movieId == null) {
      alert("movieId가 없어 삭제할 수 없습니다.");
      return;
    }
    if (window.confirm("이 한줄평을 정말 삭제할까요?")) {
      onDelete(review.movieId, review.shortReviewId);
    }
  };

  /* 수정 저장 */
  const handleEditSubmit = () => {
    if (review.movieId == null) {
      alert("movieId가 없어 수정할 수 없습니다.");
      return;
    }

    // 부모로 movieId 포함해 전달 (중요!)
    onEdit({
      ...review,
      content: editContent,
      rating: editRating,
      // createdAt 그대로 유지 (서버에서 갱신)
    });

    setEditModalOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />);
    }
    return stars;
  };

  return (
    <>
      <ShortReviewCardContainer onClick={handleCardClick} $ismobile={isMobile}>
        <CardHeader>
          <MovieTitle>{review.movieTitle}</MovieTitle>
          <MenuTrigger
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!isMenuOpen);
            }}
          >
            <FaEllipsisV />
            {isMenuOpen && (
              <DropdownMenu>
                <DropdownItem onClick={handleEdit}>수정</DropdownItem>
                <DropdownItem onClick={handleDelete}>삭제</DropdownItem>
              </DropdownMenu>
            )}
          </MenuTrigger>
        </CardHeader>

        <CardContent>{review.content}</CardContent>

        <CardFooter>
          <LikesAndRating>
            <RatingStars>{renderStars(review.rating)}</RatingStars>
            <Likes>
              <FaThumbsUp /> {review.likes}
            </Likes>
          </LikesAndRating>
          <span>{review.createdAt}</span>
        </CardFooter>
      </ShortReviewCardContainer>

      {isEditModalOpen && (
        <ModalBackdrop onClick={() => setEditModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>한줄평 수정</h3>
            <input
              type="text"
              value={review.movieTitle}
              readOnly
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="rating-input">
              <span>별점:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star-icon"
                  onClick={() => setEditRating(star)}
                >
                  {star <= editRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div className="actions">
              <CancelButton onClick={() => setEditModalOpen(false)}>취소</CancelButton>
              <SaveButton onClick={handleEditSubmit}>저장</SaveButton>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default ShortReviewCard;
