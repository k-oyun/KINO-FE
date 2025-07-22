import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import ReportModal from "../ReportModal";
import { useTranslation } from "react-i18next";
import { useReviewsApi } from "../../api/reviews";
import DefaultProfileImg from "../../assets/img/profileIcon.png";

export interface DetailReview {
  reviewId: number;
  image?: string;
  userId: number;
  userImage: string;
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
  showProfile?: boolean;
  movieTitle?: string;
  isMobile?: boolean;
  onClick?: () => void;
  onDelete?: (reviewId: number) => void;
}

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
  color: #333;

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

const MenuItemReport = MenuItem;

const DetailReviewCard: React.FC<DetailReviewCardProps> = ({
  review,
  isMine = false,
  showProfile = false,
  movieTitle,
  isMobile,
  onClick,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { deleteReview, postReviewReport } = useReviewsApi();

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
        //완료 모달
        alert(t("report.success"));
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      // 에러 모달
      alert(t("report.failure"));
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

  const deletePost = async () => {
    // TODO: window.confirm 대신 커스텀 모달 UI 사용
    if (!window.confirm(t("detailReviewCard.deleteConfirm"))) return;
    try {
      const res = await deleteReview(review.reviewId);
      console.log("게시글 삭제 성공:", res.data);
      alert(t("detailReviewCard.deleteSuccess"));
      navigate("/community");
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert(t("detailReviewCard.deleteFailure"));
    }
  };

  const createdLabel = (() => {
    const dt = new Date(review.createdAt);
    if (isNaN(dt.getTime())) return "";
    const dateFnsLocale = i18n.language === "ko" ? ko : enUS;
    return formatDistanceToNow(dt, { addSuffix: true, locale: dateFnsLocale });
  })();

  const posterSrc =
    review.image ||
    `https://placehold.co/160x270/CCCCCC/FFFFFF?text=${t(
      "detailReviewCard.noImageText"
    )}`;
  const profileSrc = review.userImage || DefaultProfileImg;

  return (
    <>
      <DetailReviewCardContainer
        $ismobile={isMobile}
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
                  src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
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
