import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { FaThumbsUp, FaEllipsisV, FaStar, FaRegStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export interface ShortReview {
  movieId: number;
  shortReviewId: string;
  movieTitle: string;
  content: string;
  rating: number;
  likes: number;
  createdAt: string;
}

export interface ShortReviewCardProps {
  review: ShortReview;
  onClick: () => void;
  onEdit?: (updatedReview: ShortReview) => void;
  onDelete?: (movieId: number, reviewId: string) => void;
  isMobile?: boolean;
  isOwner?: boolean;
}

interface StyleType {
  $ismobile?: boolean;
}

const CardBase = styled.div<StyleType>`
  background-color: #1a1a1a;
  border-radius: 6px;
  padding: ${(p) => (p.$ismobile ? "10px 15px" : "15px 20px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #333;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  color: #f0f0f0;
  margin-bottom: 10px;
  // padding-top: 3px;
  &:hover {
    transform: translateY(-3px);
  }
`;

const ShortReviewCardContainer = styled(CardBase)`
  position: relative;
`;

const MenuTrigger = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0 5px;
  position: relative;
  line-height: 1;
  display: flex;
  align-items: center;
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
  white-space: pre-wrap;
  word-break: break-word;
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
const Heart = styled.img<StyleType>`
  width: ${(p) => (p.$ismobile ? "16px" : "16px")};
  height: ${(p) => (p.$ismobile ? "16px" : "16px")};
  object-fit: cover;
`;

// ---------- util --------------
const parseDateString = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(
    parts[0],
    (parts[1] || 1) - 1,
    parts[2] || 1,
    parts[3] ?? 0,
    parts[4] ?? 0
  );
};

const parseShortReviewDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  const isoTry = new Date(dateStr);
  if (!isNaN(isoTry.getTime())) return isoTry;
  return parseDateString(dateStr);
};

const getRelativeTime = (
  dateStr: string,
  t: (key: string, options?: Record<string, unknown>) => string,
  nowDate?: Date
): string => {
  const now = nowDate ?? new Date();
  const past = parseShortReviewDate(dateStr);
  const pastMs = past.getTime();
  if (isNaN(pastMs)) return dateStr;

  const diffSec = (now.getTime() - pastMs) / 1000;

  if (diffSec < 0) {
    const futureSec = Math.abs(diffSec);
    if (futureSec < 60) return t("mypage.relativeTime.soon");
    if (futureSec < 3600)
      return t("mypage.relativeTime.minutesLater", {
        count: Math.floor(futureSec / 60),
      });
    if (futureSec < 86400)
      return t("mypage.relativeTime.hoursLater", {
        count: Math.floor(futureSec / 3600),
      });
    return t("mypage.relativeTime.daysLater", {
      count: Math.floor(futureSec / 86400),
    });
  }

  if (diffSec < 60) return t("mypage.relativeTime.justNow");
  if (diffSec < 3600)
    return t("mypage.relativeTime.minutesAgo", {
      count: Math.floor(diffSec / 60),
    });
  if (diffSec < 86400)
    return t("mypage.relativeTime.hoursAgo", {
      count: Math.floor(diffSec / 3600),
    });

  const diffDay = Math.floor(diffSec / 86400);
  if (diffDay < 30) return t("mypage.relativeTime.daysAgo", { count: diffDay });

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return t("mypage.relativeTime.monthsAgo", { count: diffMonth });

  const diffYear = Math.floor(diffMonth / 12);
  return t("mypage.relativeTime.yearsAgo", { count: diffYear });
};

// ---------- component --------------
const ShortReviewCard: React.FC<ShortReviewCardProps> = ({
  review,
  onClick,
  onEdit,
  onDelete,
  isMobile,
  isOwner,
}) => {
  const { t } = useTranslation();

  const canManage =
    typeof isOwner === "boolean" ? isOwner : Boolean(onEdit && onDelete);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (isMenuOpen) {
        e.stopPropagation();
        setMenuOpen(false);
        return;
      }
      onClick();
    },
    [isMenuOpen, onClick]
  );

  const toggleMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canManage) return;
      setMenuOpen((v) => !v);
    },
    [canManage]
  );

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canManage) return;
      setEditContent(review.content);
      setEditRating(review.rating);
      setEditModalOpen(true);
      setMenuOpen(false);
    },
    [canManage, review.content, review.rating]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canManage) return;
      setMenuOpen(false);
      if (review.movieId == null) {
        alert(t("mypage.shortReviews.delete.noMovieIdError"));
        return;
      }
      // TODO: window.confirm 대신 커스텀 모달 UI 사용
      if (window.confirm(t("mypage.shortReviews.delete.confirm"))) {
        onDelete?.(review.movieId, review.shortReviewId);
      }
    },
    [canManage, onDelete, review.movieId, review.shortReviewId, t]
  );

  const handleEditSubmit = useCallback(() => {
    if (!canManage) return;
    if (review.movieId == null) {
      alert(t("mypage.shortReviews.edit.noMovieIdError"));
      return;
    }
    onEdit?.({
      ...review,
      content: editContent,
      rating: editRating,
    });
    setEditModalOpen(false);
  }, [canManage, onEdit, review, editContent, editRating, t]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i += 1) {
      stars.push(i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />);
    }
    return stars;
  };

  const displayedTime = getRelativeTime(review.createdAt, t);

  return (
    <>
      <ShortReviewCardContainer
        onClick={handleCardClick}
        $ismobile={isMobile}
        role="button"
        tabIndex={0}
      >
        <CardHeader>
          <MovieTitle>{review.movieTitle}</MovieTitle>
          {canManage && (
            <MenuTrigger
              aria-label={t("shortReviewCard.menuTriggerAriaLabel")}
              onClick={toggleMenu}
            >
              <FaEllipsisV />
              {isMenuOpen && (
                <DropdownMenu onClick={(e) => e.stopPropagation()} role="menu">
                  <DropdownItem onClick={handleEdit}>{t("edit")}</DropdownItem>
                  <DropdownItem onClick={handleDelete}>
                    {t("delete")}
                  </DropdownItem>
                </DropdownMenu>
              )}
            </MenuTrigger>
          )}
        </CardHeader>

        <CardContent>{review.content}</CardContent>

        <CardFooter>
          <LikesAndRating>
            <RatingStars>{renderStars(review.rating)}</RatingStars>
            <Heart
              src="https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
              alt={t("detailReviewCard.likesAlt")}
              $ismobile={isMobile}
              style={{ marginRight: "-4px" }}
            />
            <span style={{ marginBottom: "3px", paddingTop: "7px" }}>
              {review.likes}
            </span>
          </LikesAndRating>
          <span>{displayedTime}</span>
        </CardFooter>
      </ShortReviewCardContainer>

      {isEditModalOpen && (
        <ModalBackdrop onClick={() => setEditModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{t("shortReviewCard.editModalTitle")}</h3>
            <input type="text" value={review.movieTitle} readOnly />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="rating-input">
              <span>{t("shortReviewCard.ratingLabel")}</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star-icon"
                  onClick={() => setEditRating(star)}
                  role="button"
                >
                  {star <= editRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div className="actions">
              <CancelButton onClick={() => setEditModalOpen(false)}>
                {t("cancel")}
              </CancelButton>
              <SaveButton onClick={handleEditSubmit}>
                {t("shortReviewCard.saveButton")}
              </SaveButton>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default ShortReviewCard;