import React, { useState, useEffect, use } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Comment from "../../components/community/Comment";
import { useMediaQuery } from "react-responsive";
import useReviewsApi from "../../api/reviews";
import { utcToKstString } from "../../utils/date";
import { useTranslation } from "react-i18next";

// 필요한 타입은 이 파일 내에서 직접 정의합니다.
interface DetailReview {
  movieId: number;
  movieTitle: string;
  moviePosterUrl: string;

  reviewId: number;
  reviewTitle: string;
  reviewContent: string;

  reviewLikeCount: number;
  reviewViewCount: number;
  reviewCommentCount: number;
  reviewCreatedAt: string;
  isActive: boolean;
  isHeart: boolean;
  isMine: boolean;

  writerId: number;
  writerUserImage: string;
  writerUserNickname: string;
}

interface styleType {
  $ismobile?: boolean;
}

const OutContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 65px;
`;

const PostDetailContainer = styled.div<styleType>`
  width: ${(props) => (props.$ismobile ? "90vw" : "60vw")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: ${(props) => (props.$ismobile ? "20px" : "50px")};
  border-radius: 8px;
  box-sizing: border-box;
`;

// --- 게시글 내용 UI ---
const ContentWrapper = styled.div``;

const HeadWrapper = styled.div<styleType>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #222222;
  padding-bottom: ${(props) => (props.$ismobile ? "10px" : "20px")};
`;

const MoviePoster = styled.img<styleType>`
  cursor: pointer;
  width: ${(props) => (props.$ismobile ? "70px" : "120px")};
  height: ${(props) => (props.$ismobile ? "90px" : "140px")};
  object-fit: cover;
  border-radius: 8px;
  margin-right: ${(props) => (props.$ismobile ? "20px" : "80px")};
`;

const PostHeader = styled.div<styleType>`
  padding-bottom: 10px;
  margin-bottom: ${(props) => (props.$ismobile ? "0px" : "10px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PostTitle = styled.h1<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1.3em" : "2em")};
  font-weight: bold;
  color: #fe5890;
  margin-bottom: 8px;
`;

const MovieInfo = styled.div<styleType>`
  display: flex;
`;

const MovieTitle = styled.span<styleType>`
  font-size: ${(props) => (props.$ismobile ? "1em" : "1.2em")};
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #fe5890;
  }
`;

const PostMeta = styled.div<styleType>`
  font-size: ${(props) => (props.$ismobile ? "0.8em" : "1em")};
  display: flex;
  flex-direction: ${(props) => (props.$ismobile ? "column" : "row")};
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  gap: ${(props) => (props.$ismobile ? "5px" : "10px")};
`;

const ContentArea = styled.div`
  font-size: 1em;
  line-height: 1.6;
  min-height: 200px;
  white-space: pre-wrap;
  padding: 20px;
  img {
    max-width: 100%;
    object-fit: cover;
    height: auto;
    display: block;
  }
`;

// --- 버튼 그룹 및 스타일 ---
const ActionGroup = styled.div<styleType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #222222;
  padding-top: 12x;
  padding: ${(props) => (props.$ismobile ? "8px" : "10px 20px")};
  padding-bottom: 0;
`;

const ReviewLike = styled.div<styleType>`
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

const CommentImage = styled.img<styleType>`
  width: ${(props) => (props.$ismobile ? "18px" : "20px")};
  height: ${(props) => (props.$ismobile ? "18px" : "20px")};
  object-fit: cover;
  margin-left: 6px;
`;

const CommentDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #000;
  margin-left: 3px;
  margin-right: auto;
`;

const ButtonGroup = styled.div<styleType>`
  display: flex;
  gap: ${(props) => (props.$ismobile ? "4px" : "8px")};
`;

const StyledButton = styled.button<styleType>`
  background-color: #333333;
  color: #f0f0f0;
  border: none;
  border-radius: 8px;
  padding: ${(props) => (props.$ismobile ? "3px 8px" : "7px 15px")};
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: #555555;
    border-color: #fe5890;
    color: #fe5890;
  }
`;

const DeleteButton = styled(StyledButton)<styleType>`
  background-color: #d32f2f;
  border-color: #d32f2f;
  color: white;
  &:hover {
    background-color: #c62828;
    border-color: #c62828;
    color: white;
  }
`;

const BackButton = styled(StyledButton)<styleType>`
  background-color: #bbb;
  color: black;
  border-color: #bbb;
  &:hover {
    background-color: #aaa;
    border-color: #aaa;
  }
`;

const LoadingState = styled.div`
  color: #aaa;
  text-align: center;
  padding: 100px 0;
  font-size: 1.1em;
`;

const ErrorState = styled(LoadingState)``;

const CommunityDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<DetailReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { getReviewById, likeReview, deleteReview } = useReviewsApi();

  const getPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) {
        setError("게시글 ID가 없습니다.");
        return;
      }
      const res = getReviewById(id);
      res.then((data) => {
        console.log("불러온 게시글 데이터:", data.data);
        setPost(data.data.data);
        setIsLoading(false);
      });
    } catch (e) {
      console.error("Failed to fetch post (dummy data simulation):", e);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []); // id가 변경될 때마다 게시글 다시 로드

  const handleLikeClick = (reviewId: number) => {
    likeReview(reviewId).then((data) => {
      console.log("좋아요 상태 변경:", data.data);
      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          isHeart: data.data.data,
          reviewLikeCount: data.data.data
            ? ++prevPost.reviewLikeCount
            : --prevPost.reviewLikeCount,
        };
      });
    });
  };

  const deletePost = async () => {
    if (!post) return;
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      const res = deleteReview(post.reviewId);
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

  const increaseCommentCount = () => {
    setPost((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        reviewCommentCount: prev.reviewCommentCount + 1,
      };
    });
  };
  const decreaseCommentCount = () => {
    setPost((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        reviewCommentCount: prev.reviewCommentCount - 1,
      };
    });
  };

  if (isLoading) {
    return <LoadingState>{t("loadingPost")}</LoadingState>;
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (!post) {
    return <ErrorState>{t("loadingPost")}</ErrorState>;
  }

  return (
    <OutContainer>
      <PostDetailContainer $ismobile={isMobile}>
        {/* 게시글 상세 내용 */}
        <ContentWrapper>
          <HeadWrapper $ismobile={isMobile}>
            <MoviePoster
              $ismobile={isMobile}
              src={post.moviePosterUrl}
              alt="영화 포스터"
              onClick={() => navigate(`/movie/${post.movieId}`)}
            ></MoviePoster>
            <PostHeader $ismobile={isMobile}>
              <PostTitle $ismobile={isMobile}>{post.reviewTitle}</PostTitle>
              <MovieInfo
                $ismobile={isMobile}
                onClick={() => navigate(`/movie/${post.movieId}`)}
              >
                <MovieTitle $ismobile={isMobile}>{post.movieTitle}</MovieTitle>
              </MovieInfo>
              <PostMeta $ismobile={isMobile}>
                <span>
                  {t("writer")}: {post.writerUserNickname}
                </span>
                <span style={{ fontSize: "0.8em" }}>
                  {t("date")}: {utcToKstString(post.reviewCreatedAt)}
                </span>
              </PostMeta>
            </PostHeader>
          </HeadWrapper>
          <ContentArea
            className="review-content"
            dangerouslySetInnerHTML={{ __html: post.reviewContent }}
          />
        </ContentWrapper>
        {/* 좋아요 및 액션 버튼 */}
        <ActionGroup $ismobile={isMobile}>
          <ReviewLike $ismobile={isMobile}>
            <Heart
              $ismobile={isMobile}
              $heartUrl={
                post.isHeart
                  ? "https://img.icons8.com/?size=100&id=V4c6yYlvXtzy&format=png&color=000000"
                  : "https://img.icons8.com/?size=100&id=12306&format=png&color=000000"
              }
              onClick={() => handleLikeClick(post.reviewId)}
            />
            <LikeCount $ismobile={isMobile} />
            {post.reviewLikeCount}
          </ReviewLike>
          <CommentImage
            src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000"
            alt="댓글"
            $ismobile={isMobile}
          ></CommentImage>
          <CommentDisplay>{post.reviewCommentCount}</CommentDisplay>
          <ButtonGroup $ismobile={isMobile}>
            {post.isMine && ( // 본인 게시글일 경우에만 수정/삭제 버튼 표시
              <>
                <StyledButton
                  $ismobile={isMobile}
                  onClick={() => navigate(`/community/edit/${post.reviewId}`)}
                >
                  {t("edit")}
                </StyledButton>
                <DeleteButton $ismobile={isMobile} onClick={deletePost}>
                  {t("delete")}
                </DeleteButton>
              </>
            )}
            <BackButton
              $ismobile={isMobile}
              onClick={() => navigate("/community")}
            >
              {t("toList")}
            </BackButton>
          </ButtonGroup>
        </ActionGroup>
        {/* 댓글 섹션 (Comment 컴포넌트 사용) */}
        <Comment
          postId={post.reviewId}
          onCommentAdded={increaseCommentCount}
          onCommentDeleted={decreaseCommentCount}
        />
      </PostDetailContainer>
    </OutContainer>
  );
};

export default CommunityDetailPage;
