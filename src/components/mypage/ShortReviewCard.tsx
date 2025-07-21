import React, { useState } from "react";
import styled from "styled-components";
import { FaThumbsUp, FaEllipsisV, FaStar, FaRegStar } from "react-icons/fa";

interface ShortReview {
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
  onDelete: (reviewId: string) => void; 
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

const ThreeDotsMenu = styled.button`
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

  button {
    background: none;
    border: none;
    color: #f0f0f0;
    padding: 8px 12px;
    text-align: left;
    cursor: pointer;
    white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */
    &:hover {
      background: #444;
    }
  }
`;

const ShortReviewCardContainer = styled(CardBase)`
  position: relative;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
    margin-top: 0;
    margin-bottom: 10px;
    color: #e0e0e0;
    text-align: center;
  }

  input[type="text"],
  textarea,
  input[type="number"] {
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

  button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s ease;
  }

  .save-button {
    background-color: #ff69b4;
    color: white;
    &:hover {
      background-color: #e05cb0;
    }
  }
  .cancel-button {
    background-color: #555;
    color: white;
    &:hover {
      background-color: #777;
    }
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
  color: #ffc107; /* 별 색상 */
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
  const [editData, setEditData] = useState<ShortReview>(review); 

  const handleCardClick = (e: React.MouseEvent) => {
    if (isMenuOpen) {
      setMenuOpen(false);
      e.stopPropagation(); 
    } else {
      onClick();
    }
  };

  const handleEdit = () => {
    setEditData(review);
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (window.confirm("이 한줄평을 정말 삭제할까요?")) {
      onDelete(review.shortReviewId);
    }
  };

  const handleEditSubmit = () => {
    onEdit({ ...editData, createdAt: new Date().toLocaleString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    }).replace(/\. /g, '.').replace(/\.$/, '')});
    setEditModalOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} />);
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push(<FaStar key={i} />); 
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const handleRatingChange = (newRating: number) => {
    setEditData((prev) => ({ ...prev, rating: newRating }));
  };


  return (
    <>
      <ShortReviewCardContainer onClick={handleCardClick} $ismobile={isMobile}>
        <CardHeader>
          <MovieTitle>{review.movieTitle}</MovieTitle>
          <ThreeDotsMenu
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!isMenuOpen);
            }}
          >
            <FaEllipsisV />
            {isMenuOpen && (
              <DropdownMenu>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete}>삭제</button>
              </DropdownMenu>
            )}
          </ThreeDotsMenu>
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
              placeholder="영화 제목"
              value={editData.movieTitle}
              onChange={(e) =>
                setEditData({ ...editData, movieTitle: e.target.value })
              }
              readOnly
            />
            <textarea
              placeholder="내용"
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
            />
            <div className="rating-input">
              <span>별점:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star-icon"
                  onClick={() => handleRatingChange(star)}
                >
                  {star <= editData.rating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="cancel-button" onClick={() => setEditModalOpen(false)}>취소</button>
                <button className="save-button" onClick={handleEditSubmit}>저장</button>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default ShortReviewCard;