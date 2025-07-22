import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import ReportModal from "../ReportModal";
import { useTranslation } from "react-i18next";
import { useReviewsApi } from "../../api/reviews";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */
export interface DetailReview {
  reviewId: number;
  image?: string;          // 썸네일/포스터 URL (옵션)
  userProfile: string;     // 작성자 프로필 이미지 URL
  userNickname: string;
  title: string;
  content: string;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;       // ISO string or yyyy.MM.dd HH:mm 등
}

interface DetailReviewCardProps {
  review: DetailReview;
  isMine?: boolean;
  showProfile?: boolean;
  movieTitle?: string;
  isMobile?: boolean;
  onClick?: () => void;
}

/* ------------------------------------------------------------------ *
 * Styled
 * ------------------------------------------------------------------ */
interface StyleType {
  $ismobile?: boolean;
  $showProfile?: boolean;
}

const CardBase = styled.div<StyleType>`
  background-color: #d9d9d9;
  border-radius: 8px;
  padding: ${(p) => (p.$ismobile ? "15px" : "25px 20px")};
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
  }
`;

const DetailReviewCardContainer = styled(CardBase)<StyleType>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${(p) => (p.$ismobile ? "0px" : "20px")};
`;

const DetailMoviePoster = styled.img<StyleType>`
  width: 20vw;
  max-width: 160px;
  height: ${(p) => (p.$ismobile ? "15vh" : "27vh")};
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  margin-right: 15px;
`;

const ProfileNReview = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  padding: ${(p) => (p.$ismobile ? "0" : "0 20px")};
  width: 60vw;
  max-width: 100%;
  color: #000;
`;

const UserProfileWrap = styled.div<StyleType>`
  margin-bottom: ${(p) => (p.$ismobile ? "10px" : "20px")};
  display: flex;
  align-items: center;
`;

const UserImage = styled.img<StyleType>`
  width: ${(p) => (p.$ismobile ? "30px" : "60px")};
  height: ${(p) => (p.$ismobile ? "30px" : "60px")};
  border: 2px solid #fd6782;
  object-fit: cover;
  border-radius: 50%;
  &:hover {
    border: 3px solid #f73c63;
  }
`;

const UserText = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  margin-left: ${(p) => (p.$ismobile ? "5px" : "20px")};
  margin-top: ${(p) => (p.$ismobile ? "5px" : "6px")};
`;

const UserNickname = styled.div<StyleType>`
  font-weight: bold;
  font-size: ${(p) => (p.$ismobile ? "12px" : "18px")};
`;

const DetailReviewContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DetailReviewTitleText = styled.h4<StyleType>`
  font-size: ${(p) => (p.$ismobile ? "0.8em" : "1.15em")};
  margin-bottom: ${(p) => (p.$ismobile ? "5px" : "15px")};
  margin-top: 0;
  color: #000;
`;

const DetailReviewMovieTitleText = styled.p`
  color: #555;
  font-size: 0.9em;
  margin: 0 0 8px;
`;

const ReviewText = styled.p<StyleType>`
  margin: 0;
  font-size: ${(p) => (p.$ismobile ? "0.7em" : "1em")};
  white-space: pre-wrap;
  word-break: break-word;
  color: #000;
  /* 최대 3줄 프리뷰 */
  display: -webkit-box;
  -webkit-line-clamp: 3;   /* 기존 1줄 → 3줄 프리뷰가 더 자연스럽다면 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: ${(p) => (p.$ismobile ? "5vh" : "8vh")};
  padding: 0 10px;
`;

const DetailReviewFooter = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: ${(p) => (p.$ismobile ? "10px" : "20px")};
  border-top: 1px solid #444;
  padding-top: 10px;
`;

const MetaInfo = styled.div<StyleType>`
  font-size: ${(p) => (p.$ismobile ? "0.7em" : "0.9em")};
  color: #888;
  display: flex;
  align-items: center;
  gap: ${(p) => (p.$ismobile ? "3px" : "7px")};
`;

const Heart = styled.img<StyleType>`
  width: ${(p) => (p.$ismobile ? "16px" : "20px")};
  height: ${(p) => (p.$ismobile ? "16px" : "20px")};
  object-fit: cover;
`;

const LikesDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #000;
`;

const CommentImage = styled.img<StyleType>`
  width: ${(p) => (p.$ismobile ? "16px" : "20px")};
  height: ${(p) => (p.$ismobile ? "16px" : "20px")};
  object-fit: cover;
  margin-left: 5px;
`;

const CommentDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #000;
  margin-right: 5px;
`;

const ThreeDotsMenu = styled.button`
  background: none;
  margin-left: auto;
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

const PopMenu = styled.ul<StyleType>`
  position: absolute;
  right: -2px;
  top: 22px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 10;
  min-width: 90px;
  list-style: none;
  margin: 0;
`;

const MenuItem = styled.li<StyleType>`
  padding: 4px 8px;
  font-size: ${(p) => (p.$ismobile ? "0.8em" : "1em")};
  color: #222;
  cursor: pointer;
  &:hover {
    background: #f9e5ed;
    color: #fd6782;
  }
`;

/* 별도 스타일 필요 없으면 합쳐도 됨 */
const MenuItemReport = MenuItem;

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */
const DetailReviewCard: React.FC<DetailReviewCardProps> = ({
  review,
  isMine = false,
  showProfile = false,
  movieTitle,
  isMobile,
  onClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteReview } = useReviewsApi();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const popMenuRef = useRef<HTMLUListElement | null>(null);

  /* 메뉴 토글 (카드 클릭 전파 막기) */
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleReportClick = () => {
    setIsReportOpen(true);
    setMenuOpen(false);
  };

  /* 바깥 클릭시 메뉴 닫기 */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popMenuRef.current &&
        !popMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /* 삭제 */
  const deletePost = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      const res = await deleteReview(review.reviewId);
      console.log("게시글 삭제 성공:", res.data);
      alert("게시글이 삭제되었습니다.");
      navigate("/community");
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /* createdAt 포맷 */
  const createdLabel = (() => {
    const dt = new Date(review.createdAt);
    if (isNaN(dt.getTime())) return ""; // invalid date 방어
    return formatDistanceToNow(dt, { addSuffix: true, locale: ko });
  })();

  /* 포스터/프로필 이미지 결정 */
  const posterSrc = review.image || review.userProfile; // fallback
  const profileSrc = review.userProfile;

  return (
    <>
      <DetailReviewCardContainer
        $ismobile={isMobile}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        {/* 포스터 / 썸네일 */}
        <DetailMoviePoster
          $ismobile={isMobile}
          $showProfile={showProfile}
          src={posterSrc}
          alt="리뷰 이미지"
        />

        <ProfileNReview $ismobile={isMobile}>
          {showProfile && (
            <UserProfileWrap $ismobile={isMobile}>
              <UserImage
                $ismobile={isMobile}
                src={profileSrc}
                alt={`${review.userNickname} 프로필`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mypage/${review.userNickname}`); // 필요시 userId 경로로 수정
                }}
              />
              <UserText $ismobile={isMobile}>
                <UserNickname $ismobile={isMobile}>
                  {review.userNickname}
                </UserNickname>
              </UserText>
            </UserProfileWrap>
          )}

          <DetailReviewContentWrapper>
            <DetailReviewTitleText $ismobile={isMobile}>
              {review.title}
            </DetailReviewTitleText>

            {movieTitle && (
              <DetailReviewMovieTitleText>
                영화: {movieTitle}
              </DetailReviewMovieTitleText>
            )}

            <ReviewText
              $ismobile={isMobile}
              className="review-content"
              // NOTE: content가 이미 HTML sanitizing 되었는지 확인 필요
              dangerouslySetInnerHTML={{ __html: review.content }}
            />

            <DetailReviewFooter $ismobile={isMobile}>
              <MetaInfo $ismobile={isMobile}>
                <Heart
                  src="https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                  alt="좋아요"
                  $ismobile={isMobile}
                />
                <LikesDisplay>{review.likeCount}</LikesDisplay>
                <CommentImage
                  src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
                  alt="댓글"
                  $ismobile={isMobile}
                />
                <CommentDisplay>{review.commentCount}</CommentDisplay>
                {createdLabel}
              </MetaInfo>
            </DetailReviewFooter>
          </DetailReviewContentWrapper>
        </ProfileNReview>

        {/* 점 3개 메뉴 */}
        <ThreeDotsMenu onClick={handleMenuClick}>
          ⋮
          {menuOpen && (
            <PopMenu
              ref={popMenuRef}
              $ismobile={isMobile}
              onClick={(e) => e.stopPropagation()}
            >
              {isMine ? (
                <>
                  <MenuItem
                    $ismobile={isMobile}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/community/edit/${review.reviewId}`);
                      setMenuOpen(false);
                    }}
                  >
                    {t("edit")}
                  </MenuItem>
                  <MenuItem
                    $ismobile={isMobile}
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost();
                      setMenuOpen(false);
                    }}
                  >
                    {t("delete")}
                  </MenuItem>
                </>
              ) : (
                <MenuItemReport
                  $ismobile={isMobile}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportClick();
                  }}
                >
                  {t("report")}
                </MenuItemReport>
              )}
            </PopMenu>
          )}
        </ThreeDotsMenu>
      </DetailReviewCardContainer>

      {isReportOpen && (
        <ReportModal setIsModalOpen={setIsReportOpen} />
      )}
    </>
  );
};

export default DetailReviewCard;
