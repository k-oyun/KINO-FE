import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import ReportModal from "../ReportModal";
import { useTranslation } from "react-i18next";
import { useReviewsApi } from "../../api/reviews";
import DefaultProfileImg from "../../assets/img/profileIcon.png";
import { useDialog } from "../../context/DialogContext";
import { usePreferMode } from "../../hooks/usePreferMode";

export interface DetailReview {
  reviewId: number;
  image?: string;
  userId: number;
  userImage?: string;
  userNickname: string;
  title: string;
  content: string;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
}

interface DetailReviewCardProps {
  review: DetailReview;
  isMine?: boolean;
  isMypage?: boolean;
  showProfile?: boolean;
  movieTitle?: string;
  isMobile?: boolean;
  onClick?: () => void;
  onDelete?: (reviewId: number) => void;
}

interface StyleType {
  $ismobile?: boolean;
  $showProfile?: boolean;
  $isDarkMode?: boolean;
  $isMypage?: boolean;
}

const CardBase = styled.div<StyleType>`
  background-color: ${(p) =>
    p.$isMypage ? "#1a1a1a" : p.$isDarkMode ? "#222" : "#f6f6f6"};
  color: ${(p) => (p.$isMypage ? "#fff" : "")};
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

const ProfileNReview = styled.div<StyleType>`
  display: flex;
  flex-direction: column;
  padding: ${(p) => (p.$ismobile ? "0" : "0 20px")};
  width: 60vw;
  max-width: 100%;
`;

const UserProfileWrap = styled.div<StyleType>`
  margin-bottom: ${(p) => (p.$ismobile ? "10px" : "20px")};
  display: flex;
  align-items: center;
`;

const UserImage = styled.img<StyleType>`
  width: ${(p) => (p.$ismobile ? "25px" : "40px")};
  height: ${(p) => (p.$ismobile ? "25px" : "40px")};
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
  margin-left: ${(p) => (p.$ismobile ? "8px" : "20px")};
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
`;

const DetailReviewMovieTitleText = styled.p`
  color: #555;
  font-size: 0.9em;
  margin: 0 0 8px;
`;

const ReviewText = styled.p<StyleType>`
  margin: 0;
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  /* min-height: ${(props) => (props.$ismobile ? "5vh" : "2vh")}; */

  img {
    max-width: 100%;
    max-height: ${(props) => (props.$ismobile ? "100px" : "200px")};
    object-fit: cover;
    border-radius: 8px;
    height: auto;
    display: block;
  }
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

const MenuItemReport = MenuItem;

const DetailReviewCard: React.FC<DetailReviewCardProps> = ({
  review,
  isMine = false,
  showProfile = false,
  isMypage = false,
  movieTitle,
  isMobile,
  onClick,
  onDelete,
}) => {
  const isDarkMode = usePreferMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { deleteReview, postReviewReport } = useReviewsApi();
  const { openDialog, closeDialog } = useDialog();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const popMenuRef = useRef<HTMLUListElement | null>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleReportClick = () => {
    setIsReportOpen(true);
    setMenuOpen(false);
  };

  const submitReport = async (type: number, content: string) => {
    try {
      const res = postReviewReport(
        type,
        content,
        review.reviewId,
        review.userId
      );
      res.then((data) => {
        console.log("Report submitted successfully:", data);
        openDialog({
          title: t("report"),
          message: t("reportSuccess"),
          showCancel: false,
          isRedButton: true,
          onConfirm: () => {
            closeDialog();
            setIsReportOpen(false);
          },
        });
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      openDialog({
        title: t("report"),
        message: t("reportFailure"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => {
          closeDialog();
          setIsReportOpen(false);
        },
      });
    }
  };

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

  const deleteConfirm = () => {
    openDialog({
      title: t("deletePost"),
      message: t("deleteConfirm"),
      showCancel: true,
      isRedButton: true,
      onConfirm: () => {
        deletePost();
        closeDialog();
      },
      onCancel: () => closeDialog(),
    });
  };

  const deletePost = async () => {
    try {
      const res = await deleteReview(review.reviewId);
      console.log("게시글 삭제 성공:", res.data);
      openDialog({
        title: t("deletePost"),
        message: t("postDeletedSuccessfully"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => {
          navigate("/community");
          closeDialog();
        },
      });
      onDelete?.(review.reviewId); // Call the onDelete callback if provided
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      openDialog({
        title: t("deletePost"),
        message: t("deletePostFailure"),
        showCancel: false,
        isRedButton: true,
        onConfirm: () => closeDialog(),
      });
    }
  };

  const createdLabel = (() => {
    const dt = new Date(review.createdAt);
    if (isNaN(dt.getTime())) return "";
    const dateFnsLocale = i18n.language === "ko" ? ko : enUS;
    return formatDistanceToNow(dt, { addSuffix: true, locale: dateFnsLocale });
  })();

  const profileSrc = review.userImage || DefaultProfileImg;

  return (
    <>
      <DetailReviewCardContainer
        $isDarkMode={isDarkMode}
        $ismobile={isMobile}
        $isMypage={isMypage}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <ProfileNReview $ismobile={isMobile}>
          {showProfile && (
            <UserProfileWrap $ismobile={isMobile}>
              <UserImage
                $ismobile={isMobile}
                src={profileSrc}
                alt={t("detailReviewCard.userProfileAlt", {
                  nickname: review.userNickname,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: userId를 기반으로 navigate하는 것이 더 안전함.
                  // 현재 review.userNickname을 사용하고 있는데, 닉네임이 변경될 경우 문제가 될 수 있음.
                  // review 객체에 userId가 있다면 review.reviewer.userId를 사용하거나,
                  // 없다면 API 호출을 통해 userId를 가져와야 함.
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
                {t("movieTitle")}: {movieTitle}
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
                  alt={t("detailReviewCard.likesAlt")}
                  $ismobile={isMobile}
                />
                <LikesDisplay>{review.likeCount}</LikesDisplay>
                <CommentImage
                  src={
                    isMypage || isDarkMode
                      ? "https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=FFFFFF"
                      : "https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
                  }
                  alt={t("detailReviewCard.commentsAlt")}
                  $ismobile={isMobile}
                />
                <CommentDisplay>{review.commentCount}</CommentDisplay>
                {createdLabel}
              </MetaInfo>
            </DetailReviewFooter>
          </DetailReviewContentWrapper>
        </ProfileNReview>

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
                      deleteConfirm();
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

export default DetailReviewCard;
