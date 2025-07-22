import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { ko, se } from "date-fns/locale";
import ReportModal from "../ReportModal";
import { useTranslation } from "react-i18next";
import { useReviewsApi } from "../../api/reviews";

interface DetailReview {
  reviewId: number;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
}

// --- 공통 스타일드 컴포넌트 ---
interface styleType {
  $ismobile?: boolean;
  $showProfile?: boolean;
}

const CardBase = styled.div<styleType>`
  background-color: #d9d9d9;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "15px" : "25px")};
  padding-right: ${(props) => (props.$ismobile ? "2px" : "20px")};
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* border: 1px solid #333; */
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
  }
`;

const ReviewText = styled.p<styleType>`
  margin: 0;
  /* color: #ddd; */
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  // 3줄까지만 보이도록 설정
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  min-height: ${(props) => (props.$ismobile ? "5vh" : "8vh")};
`;

const MetaInfo = styled.div<styleType>`
  font-size: ${(prints) => (prints.$ismobile ? "0.7em" : "1em")};
  color: #888;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$ismobile ? "3px" : "7px")};
`;

const Heart = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "16px" : "20px")};
  height: ${(props) => (props.$ismobile ? "16px" : "20px")};
  object-fit: cover;
`;

const LikesDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #000;
`;

const CommentImage = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "16px" : "20px")};
  height: ${(props) => (props.$ismobile ? "16px" : "20px")};
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
  &:hover {
    color: #f0f0f0;
  }
`;

// --- DetailReviewCard 컴포넌트 ---
const DetailReviewCardContainer = styled(CardBase)<styleType>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${(props) => (props.$ismobile ? "0px" : "20px")};
`;

// 사용자 프로필 스타일
const UserProfile = styled.div<styleType>`
  margin-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")};
  display: flex;
`;

const UserImage = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "30px" : "60px")};
  height: ${(props) => (props.$ismobile ? "30px" : "60px")};
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
  margin-left: ${(props) => (props.$ismobile ? "5px" : "20px")};
  margin-top: ${(props) => (props.$ismobile ? "5px" : "6px")};
`;

const UserNickname = styled.div<styleType>`
  font-weight: bold;
  font-size: ${(props) => (props.$ismobile ? "12px" : "18px")};
`;

// 리뷰 스타일
const ProfileNReview = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.$ismobile ? "0" : "0 20px")};
  width: 60vw;
  color: #000;
`;

const DetailMoviePoster = styled.img<styleType>`
  width: 20vw;
  height: ${(props) => (props.$ismobile ? "15vh" : "27vh")};
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  margin-right: 15px;
`;

const DetailReviewContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DetailReviewTitleText = styled.h4<styleType>`
  /* color: #f0f0f0; */
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "1.15em")};
  margin-bottom: ${(props) => (props.$ismobile ? "5px" : "15px")};
`;

const DetailReviewMovieTitleText = styled.p`
  color: #bbb;
  font-size: 0.9em;
  margin: 0 0 8px;
`;

const DetailReviewFooter = styled.div<styleType>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: ${(props) => (props.$ismobile ? "10px" : "20px")};
  border-top: 1px solid #444;
  padding-top: 10px;
`;

interface DetailReviewCardProps {
  review: DetailReview;
  isMine?: boolean;
  showProfile?: boolean;
  movieTitle?: string;
  isMobile?: boolean;
  onClick?: () => void;
}

const PopMenu = styled.ul<styleType>`
  position: absolute;
  right: -2px;
  top: 22px;
  background: #fff;
  /* border: 1px solid #ccc; */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 10;
  min-width: 90px;
  list-style: none;
`;

const MenuItem = styled.li<styleType>`
  padding: 4px;
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "1em")};
  color: #222;
  cursor: pointer;

  &:hover {
    background: #f9e5ed;
    color: #fff;
  }
`;

const MenuItemReport = styled.li<styleType>`
  padding: 4px;
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "1em")};
  color: #222;
  cursor: pointer;

  &:hover {
    background: #e7e7e7;
    color: #fd6782;
  }
`;

const DetailReviewCard: React.FC<DetailReviewCardProps> = ({
  review,
  isMine,
  showProfile,
  movieTitle,
  isMobile,
  onClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const popMenuRef = useRef<HTMLUListElement | null>(null);
  const { deleteReview } = useReviewsApi();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const [isReportOpen, setIsReportOpen] = useState(false);
  const handleReportClick = () => {
    setIsReportOpen(true);
    setMenuOpen(false);
  };

  useEffect(() => {
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
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      const res = deleteReview(review.reviewId);
      res.then((data) => {
        console.log("게시글 삭제 성공:", data.data);
        alert("게시글이 삭제되었습니다.");
        navigate("/community"); // 목록 페이지로 이동
      });
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <DetailReviewCardContainer $ismobile={isMobile} onClick={onClick}>
        <DetailMoviePoster
          $ismobile={isMobile}
          $showProfile={showProfile}
          src={review.userProfile}
          alt="리뷰 첨부 이미지"
        />
        <ProfileNReview $ismobile={isMobile}>
          {showProfile && (
            <UserProfile $ismobile={isMobile}>
              <UserImage
                $ismobile={isMobile}
                src={review.userProfile}
                alt={review.userNickname}
              />
              <UserText $ismobile={isMobile}>
                <UserNickname $ismobile={isMobile} /> {review.userNickname}x
              </UserText>
            </UserProfile>
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
              className="review-content"
              dangerouslySetInnerHTML={{ __html: review.content }}
              $ismobile={isMobile}
            ></ReviewText>
            <DetailReviewFooter $ismobile={isMobile}>
              <MetaInfo $ismobile={isMobile}>
                <Heart
                  src="https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                  alt="좋아요"
                  $ismobile={isMobile}
                ></Heart>
                <LikesDisplay>{review.likeCount}</LikesDisplay>
                <CommentImage
                  src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
                  alt="댓글"
                  $ismobile={isMobile}
                ></CommentImage>
                <CommentDisplay>{review.commentCount}</CommentDisplay>
                {formatDistanceToNow(review.createdAt, {
                  addSuffix: true,
                  locale: ko,
                })}
              </MetaInfo>
            </DetailReviewFooter>
          </DetailReviewContentWrapper>
        </ProfileNReview>
        <ThreeDotsMenu
          style={{ alignSelf: "flex-start", position: "relative" }}
          onClick={handleMenuClick}
        >
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
                      if (!e) {
                        alert("undefined 이벤트!");
                        return;
                      }
                      e.stopPropagation();
                      console.log("수정 클릭");
                      navigate(`/community/edit/${review.reviewId}`);
                      console.log("수정 페이지로 이동");
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
                  onClick={() => {
                    handleReportClick(); /* 신고 함수 */
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
        <ReportModal setIsModalOpen={setIsReportOpen}></ReportModal>
      )}
    </>
  );
};

export default DetailReviewCard;
