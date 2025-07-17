import { useEffect, useState } from "react";
import { styled } from "styled-components";
import ReportModal from "../ReportModal";

interface DetailReview {
  reviewId: string;
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const MetaInfo = styled.div`
  font-size: 0.8em;
  color: #888;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LikesDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #000;
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
  /* width: ${(props) => (props.$ismobile ? "25vw" : "250px")}; */
  width: 20vw;
  /* height: 22vh; */
  height: ${(props) => (props.$ismobile ? "13vh" : "27vh")};
  height: ${(props) =>
    !props.$ismobile && props.$showProfile ? "27vh" : "18vh"};
  /* height: ${(props) => (props.$ismobile ? "15vw" : "200px")}; */
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
    const handleClickOutside = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
            <ReviewText $ismobile={isMobile}>{review.content}</ReviewText>
            <DetailReviewFooter $ismobile={isMobile}>
              <MetaInfo>
                <LikesDisplay>♥ {review.likeCount}</LikesDisplay>
              </MetaInfo>
              <MetaInfo>{review.createdAt}</MetaInfo>
            </DetailReviewFooter>
          </DetailReviewContentWrapper>
        </ProfileNReview>
        <ThreeDotsMenu
          style={{ alignSelf: "flex-start", position: "relative" }}
          onClick={handleMenuClick}
        >
          ⋮
          {menuOpen && (
            <PopMenu $ismobile={isMobile} onClick={(e) => e.stopPropagation()}>
              {isMine ? (
                <>
                  <MenuItem
                    $ismobile={isMobile}
                    onClick={() => {
                      setMenuOpen(false); /* 수정 함수 */
                    }}
                  >
                    수정
                  </MenuItem>
                  <MenuItem
                    $ismobile={isMobile}
                    onClick={() => {
                      setMenuOpen(false); /* 삭제 함수 */
                    }}
                  >
                    삭제
                  </MenuItem>
                  <MenuItemReport
                    $ismobile={isMobile}
                    onClick={() => {
                      handleReportClick(); /* 신고 함수 */
                    }}
                  >
                    신고
                  </MenuItemReport>
                </>
              ) : (
                <MenuItemReport
                  $ismobile={isMobile}
                  onClick={() => {
                    handleReportClick(); /* 신고 함수 */
                  }}
                >
                  신고
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
