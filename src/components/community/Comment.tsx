import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import useReviewsApi from "../../api/reviews";

export type CommentType = {
  commentId: number;
  commentContent: string;
  commentCreatedAt: string;
  isActive: boolean;
  isMine: boolean;
  writerId: number;
  writerUserImage: string | null;
  writerUserNickname: string;
};

const SectionWrapper = styled.div`
  margin-top: 18px;
  background-color: #d9d9d9;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h4`
  font-size: 1.8em;
  margin-bottom: 24px;
  border-bottom: 1px solid #222222;
  padding-bottom: 16px;
`;

// --- 댓글 입력 UI ---
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const StyledTextArea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  font-size: 1em;
  min-height: 80px;
  resize: vertical;
  border: none;
  outline: none;
  resize: noen;
  &:focus {
    border: 1.5px solid #fe5890;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  background-color: #fd6782;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f73c63;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MaxLengthText = styled.p`
  font-size: 0.8em;
  color: #bbb;
  text-align: right;
  margin-top: 4px;
`;

// --- 댓글 목록 UI ---
const CommentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
`;

const EmptyComments = styled.div`
  color: #aaa;
  text-align: center;
  padding: 16px 0;
  font-size: 1em;
`;

const LoadMoreButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 24px;
  background-color: #333333;
  color: #f0f0f0;
  border: 1px solid #222222;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: #333333e0;
    border-color: #bbb;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// --- 개별 댓글 아이템 UI ---
const ItemContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  background-color: #bbb;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  border-bottom: 1px solid #222222;
  padding-bottom: 4px;
  margin-bottom: 4px;
`;

const CommentContent = styled.p`
  font-size: 1em;
  line-height: 1.5;
  white-space: pre-wrap;
  padding: 0 12px;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const DeleteButton = styled.img<{ $ismobile?: boolean }>`
  width: ${(props) => (props.$ismobile ? "10px" : "15px")};
  height: ${(props) => (props.$ismobile ? "10px" : "12px")};
  border: none;
  border-radius: 4px;
  margin-left: 8px;
  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: #aaa;
  }
`;

interface CommentProps {
  postId: number;
  onCommentAdded?: (comment: CommentType) => void;
  onCommentDeleted?: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10; // 댓글 목록 페이지당 표시할 댓글 수
  const observerRef = React.useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { getComments, postComment, deleteComment } = useReviewsApi();

  const loadMoreComments = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = getComments(postId, page, pageSize);
      res.then((data) => {
        console.log("Fetched comments:", data.data);
        const newComments = data.data.data.content as CommentType[];
        setComments((prev) => [...prev, ...newComments]);
        setPage((prev) => prev + 1);
        if (data.data.last) {
          setHasMore(false);
        }
        setError(null);
      });
    } catch (err) {
      console.error("댓글 로드 실패:", err);
      setError("댓글을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreComments();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreComments();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading]);

  const handleCommentSubmit = async () => {
    if (commentContent.trim().length === 0) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const res = postComment({
        reviewId: postId,
        commentContent: commentContent,
      });
      res.then((data) => {
        console.log("댓글 등록 성공:", data.data);
        setComments((prev) => [data.data.data, ...prev]);
        onCommentAdded?.(data.data.data);
      });
      setCommentContent("");
    } catch (err) {
      console.error("Failed to submit comment (dummy data simulation):", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      const res = deleteComment(commentId);
      res.then((data) => {
        console.log("댓글 삭제 성공:", data.data);
      });
      setComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId)
      ); // 현재 화면에서 바로 삭제
      alert("댓글이 삭제되었습니다. ");
      onCommentDeleted?.(commentId);
    } catch (err) {
      console.error("Failed to delete comment (dummy data simulation):", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const renderCommentItem = (comment: CommentType) => {
    const createdAtDate = new Date(comment.commentCreatedAt);
    const formattedDate = !isNaN(createdAtDate.getTime())
      ? createdAtDate.toLocaleDateString("ko-KR")
      : "날짜 정보 없음";

    return (
      <ItemContainer key={comment.commentId}>
        <CommentMeta>
          <h4>{comment.writerUserNickname}</h4>
          <div>
            <span>{formattedDate}</span>
            {comment.isMine && (
              <DeleteButton
                $ismobile={isMobile}
                onClick={() => handleCommentDelete(comment.commentId)}
                src="https://img.icons8.com/?size=100&id=k4OFGTt90Wxa&format=png&color=000000"
                alt="삭제"
              />
            )}
          </div>
        </CommentMeta>
        <CommentContent>{comment.commentContent}</CommentContent>
      </ItemContainer>
    );
  };

  return (
    <SectionWrapper>
      <SectionTitle>댓글</SectionTitle>
      {/* 댓글 입력 섹션 */}
      <InputWrapper>
        <StyledTextArea
          placeholder="댓글을 입력하세요..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          maxLength={200}
        />
        <MaxLengthText>{commentContent.length} / 200</MaxLengthText>
        <SubmitButton onClick={handleCommentSubmit}>댓글 등록</SubmitButton>
      </InputWrapper>

      {error && <EmptyComments style={{ color: "red" }}>{error}</EmptyComments>}
      {isLoading && comments.length === 0 && (
        <EmptyComments>댓글을 불러오는 중입니다...</EmptyComments>
      )}

      {/* 댓글 목록 섹션 */}
      <CommentListContainer>
        {comments.length > 0
          ? comments.map(renderCommentItem)
          : !isLoading &&
            !error && <EmptyComments>아직 댓글이 없습니다.</EmptyComments>}
      </CommentListContainer>

      {hasMore && (
        <LoadMoreButton onClick={() => loadMoreComments()} disabled={isLoading}>
          {isLoading ? "댓글 불러오는 중..." : "댓글 더 보기"}
        </LoadMoreButton>
      )}
    </SectionWrapper>
  );
};

export default Comment;
