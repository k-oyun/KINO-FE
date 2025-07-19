import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import ReportModal from "../ReportModal";

// interface Reviewer {
//   id: string;
//   nickname: string;
//   image: string;
// }
interface UserProfileType {
    userId: number;
    nickname: string;
    image: string;
    email: string;
    isFirstLogin: boolean;
}

interface DetailReview {
    // id: string;
    // title: string;
    // image: string;
    // content: string;
    // likes: number;
    // views: number;
    // comments: number;
    // createdAt: string;
    // reviewer?: Reviewer;

    reviewId: string;
    title: string;
    // image: string;
    content: string;
    likes: number;
    totalViews: number;
    comments: number;
    createdAt: string;
    // reviewer?: {
    //   id: string;
    //   nickname: string;
    //   image: string;
    // };
    reviewer: UserProfileType;
}

interface DetailReviewCardProps {
    review: DetailReview;
    isMine?: boolean;
    showProfile?: boolean;
    movieTitle?: string;
    isMobile?: boolean;
    onClick?: () => void;
}

// --- 공통 스타일드 컴포넌트 ---
interface styleType {
    $ismobile?: boolean;
    $showProfile?: boolean;
}

const CardBase = styled.div<styleType>`
    background-color: #d9d9d9;
    color: #000;
    border-radius: 8px;
    padding: ${(props) => (props.$ismobile ? "15px" : "25px")};
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: translateY(-3px);
    }
`;

const ReviewText = styled.p<styleType>`
    margin: 0;
    font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
    min-height: ${(props) => (props.$ismobile ? "5vh" : "8vh")};
    color: #333;
`;

const MetaInfo = styled.div<styleType>`
    font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
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
        color: #555;
    }
`;

// --- DetailReviewCard 컴포넌트 고유 스타일 ---
const DetailReviewCardContainer = styled(CardBase)<styleType>`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${(props) => (props.$ismobile ? "10px" : "20px")};
    padding-right: ${(props) => (props.$ismobile ? "15px" : "25px")};
`;

// 사용자 프로필 스타일
const UserProfile = styled.div<styleType>`
    margin-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")};
    display: flex;
    align-items: center;
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
    margin-left: ${(props) => (props.$ismobile ? "5px" : "10px")};
`;

const UserNickname = styled.div<styleType>`
    font-weight: bold;
    font-size: ${(props) => (props.$ismobile ? "12px" : "18px")};
    color: #333;
`;

// 리뷰 스타일
const ContentWrapper = styled.div<styleType>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: ${(props) =>
        props.$ismobile
            ? "auto"
            : "calc(100% - 150px - 20px)"}; /* 이미지 너비(150px) + gap(20px) */
`;

// const DetailMoviePoster = styled.img<styleType>`
//     width: ${(props) => (props.$ismobile ? "80px" : "150px")};
//     height: ${(props) => (props.$ismobile ? "110px" : "220px")};
//     object-fit: cover;
//     border-radius: 4px;
//     flex-shrink: 0;
// `;

const DetailReviewContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const DetailReviewTitleText = styled.h4<styleType>`
    color: #222;
    font-size: ${(props) => (props.$ismobile ? "0.9em" : "1.2em")};
    margin-bottom: ${(props) => (props.$ismobile ? "5px" : "10px")};
    margin-top: 0;
    padding: 0 10px;
`;

const DetailReviewMovieTitleText = styled.p`
    color: #555;
    font-size: 0.85em;
    margin: 0 0 8px;
    padding: 0 10px;
`;

const DetailReviewFooter = styled.div<styleType>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: ${(props) => (props.$ismobile ? "10px" : "20px")};
    border-top: 1px solid #cccccc;
    padding: 10px 10px 0 10px;
`;

const PopMenu = styled.ul<styleType>`
    position: absolute;
    right: 0;
    top: 25px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 8px 0;
    z-index: 10;
    min-width: 90px;
    list-style: none;
    margin: 0;
`;

const MenuItem = styled.li<styleType>`
    padding: 8px 12px;
    font-size: ${(props) => (props.$ismobile ? "0.8em" : "0.9em")};
    color: #333;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
        background: #f0f0f0;
        color: #333;
    }
`;

const MenuItemReport = styled(MenuItem)`
    color: #fd6782;
    &:hover {
        background: #fce7ed;
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // createdAt 문자열을 Date 객체로 파싱하여 formatDistanceToNow 사용
    // "YYYY.MM.DD HH:MM" 형태를 Date 객체로 변환
    const parseDateString = (dateStr: string): Date | null => {
        const parts = dateStr.split(/[. :]/); // '.', ' ', ':' 기준으로 분리
        if (parts.length === 5) {
            return new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
                parseInt(parts[3]),
                parseInt(parts[4])
            );
        }
        return null;
    };

    const parsedCreatedAt = parseDateString(review.createdAt);
    const displayDate = parsedCreatedAt
        ? formatDistanceToNow(parsedCreatedAt, { addSuffix: true, locale: ko })
        : review.createdAt;

    return (
        <>
            <DetailReviewCardContainer $ismobile={isMobile} onClick={onClick}>
                {/* <DetailMoviePoster
          $ismobile={isMobile}
          src={review.image}
          alt={review.title || "리뷰 첨부 이미지"}
        /> */}
                <ContentWrapper $ismobile={isMobile}>
                    {showProfile && review.reviewer && (
                        <UserProfile $ismobile={isMobile}>
                            <UserImage
                                $ismobile={isMobile}
                                src={review.reviewer.image}
                                alt={review.reviewer.nickname}
                            />
                            <UserText $ismobile={isMobile}>
                                <UserNickname $ismobile={isMobile}>
                                    {review.reviewer.nickname}
                                </UserNickname>
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
                        <ReviewText $ismobile={isMobile}>
                            {review.content}
                        </ReviewText>
                        <DetailReviewFooter $ismobile={isMobile}>
                            <MetaInfo $ismobile={isMobile}>
                                <Heart
                                    src="https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                                    alt="좋아요"
                                    $ismobile={isMobile}
                                ></Heart>
                                <LikesDisplay>{review.likes}</LikesDisplay>
                                <CommentImage
                                    src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
                                    alt="댓글"
                                    $ismobile={isMobile}
                                ></CommentImage>
                                <CommentDisplay>
                                    {review.comments}
                                </CommentDisplay>
                                <span>👁️ {review.totalViews}</span>
                                <span style={{ marginLeft: "auto" }}>
                                    {displayDate}
                                </span>
                            </MetaInfo>
                        </DetailReviewFooter>
                    </DetailReviewContentWrapper>
                </ContentWrapper>
                <ThreeDotsMenu
                    style={{ alignSelf: "flex-start", position: "relative" }}
                    onClick={handleMenuClick}
                >
                    ⋮
                    {menuOpen && (
                        <PopMenu
                            $ismobile={isMobile}
                            onClick={(e) => e.stopPropagation()}
                        >
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
