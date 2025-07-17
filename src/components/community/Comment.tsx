import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
// import axios from 'axios'; // 실제 API 호출 시 필요

export type CommentType = {
  id: string;
  postId: string;
  username: string;
  content: string;
  createdAt: string;
};

let DUMMY_COMMENTS: CommentType[] = [
  { id: 'comment-1', postId: 'post-1', username: '댓글러1', content: '첫 게시글에 대한 댓글입니다.', createdAt: '2024-07-16T10:05:00Z' },
  { id: 'comment-2', postId: 'post-1', username: '댓글러2', content: '흥미로운 내용이네요!', createdAt: '2024-07-16T10:10:00Z' },
  { id: 'comment-3', postId: 'post-2', username: '댓글러1', content: '두 번째 게시글에도 댓글을 남깁니다.', createdAt: '2024-07-15T14:35:00Z' },
  { id: 'comment-4', postId: 'post-1', username: '댓글러3', content: '좋은 정보 감사합니다!', createdAt: '2024-07-16T11:00:00Z' },
  { id: 'comment-5', postId: 'post-1', username: '댓글러4', content: '궁금한 점이 있어요.', createdAt: '2024-07-16T11:10:00Z' },
  { id: 'comment-6', postId: 'post-1', username: '댓글러5', content: '나중에 다시 와서 읽어봐야겠어요.', createdAt: '2024-07-16T11:20:00Z' },
  { id: 'comment-7', postId: 'post-1', username: '댓글러6', content: '이런 내용 정말 좋아요!', createdAt: '2024-07-16T11:30:00Z' },
  { id: 'comment-8', postId: 'post-1', username: '댓글러7', content: '댓글이 많네요.', createdAt: '2024-07-16T11:40:00Z' },
  { id: 'comment-9', postId: 'post-1', username: '댓글러8', content: '아주 유익한 글입니다.', createdAt: '2024-07-16T11:50:00Z' },
  { id: 'comment-10', postId: 'post-1', username: '댓글러9', content: '저도 동감합니다.', createdAt: '2024-07-16T12:00:00Z' },
];

const SectionWrapper = styled.div`
  margin-top: 24px;
  background-color: #000000;
  padding: 25px; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #f0f0f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  color: #e0e0e0;
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
  width: 100%;
  padding: 8px;
  background-color: #333333;
  border: 1px solid #222222;
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 1em;
  min-height: 80px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #fe5890;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  background-color: #747474ff;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #353535d0;
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

const LoginPrompt = styled.div`
  font-size: 1em;
  color: #aaa;
  text-align: center;
  padding: 16px;
  border: 1px dashed #222222;
  border-radius: 8px;
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
    background-color: #333333E0;
    border-color: #bbb;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// --- 개별 댓글 아이템 UI ---
const ItemContainer = styled.div`
  border: 1px solid #222222;
  border-radius: 8px;
  padding: 16px;
  background-color: #333333;
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #bbb;
  border-bottom: 1px solid #222222;
  padding-bottom: 4px;
  margin-bottom: 4px;
`;

const CommentContent = styled.p`
  font-size: 1em;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const DeleteButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c62828;
  }
`;

interface CommentProps {
  postId: string;
  isLoggedIn: boolean;
  currentUsername: string;
}

const Comment: React.FC<CommentProps> = ({ postId, isLoggedIn, currentUsername }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5; // 댓글 목록 페이지당 표시할 댓글 수

  const fetchComments = useCallback(async (page: number) => {
    setIsLoadingComments(true);
    try {
      // 현재 실제 API 호출 부분 대신 더미 데이터를 사용
      const filteredComments = DUMMY_COMMENTS.filter(c => c.postId === postId);
      const sortedComments = filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // 최신순 정렬

      const startIndex = page * pageSize;
      const paginatedComments = sortedComments.slice(startIndex, startIndex + pageSize);

      setComments(prev => (page === 0 ? paginatedComments : [...prev, ...paginatedComments]));
      setHasMore(paginatedComments.length === pageSize);
      setCurrentPage(page);

    } catch (err) {
      console.error("Failed to fetch comments (dummy data simulation):", err);
      setError("댓글을 불러오는데 실패했습니다. (더미 데이터 처리 오류)");
    } finally {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoadingComments(false);
    }
  }, [postId, pageSize]);

  useEffect(() => {
    setComments([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchComments(0);
  }, [postId, fetchComments]);

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      // TODO: 로그인 페이지로 리다이렉트
      return;
    }
    if (commentContent.trim().length === 0) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const commentMaxLength = 200;
    if (commentContent.length > commentMaxLength) {
      alert(`댓글은 ${commentMaxLength}자를 초과할 수 없습니다.`);
      return;
    }

    setIsSubmittingComment(true);
    try {
      // 현재 실제 API 호출 부분 대신 더미 데이터를 사용
      const newComment: CommentType = {
        id: `comment-${DUMMY_COMMENTS.length + 1}-${Date.now()}`,
        postId,
        username: currentUsername,
        content: commentContent,
        createdAt: new Date().toISOString(),
      };
      DUMMY_COMMENTS.unshift(newComment); // 새 댓글을 목록 맨 앞에 추가

      setCommentContent('');
      await fetchComments(0); // 첫 페이지 댓글을 새로고침하여 새 댓글 포함
      alert("댓글이 등록되었습니다. (더미)");
    } catch (err) {
      console.error("Failed to submit comment (dummy data simulation):", err);
      alert("댓글 등록에 실패했습니다. (더미 오류)");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까? (더미)")) {
      return;
    }
    try {
      // 현재 실제 API 호출 부분 대신 더미 데이터를 사용
      DUMMY_COMMENTS = DUMMY_COMMENTS.filter(comment => comment.id !== commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId)); // 현재 화면에서 바로 삭제
      alert("댓글이 삭제되었습니다. (더미)");
    } catch (err) {
      console.error("Failed to delete comment (dummy data simulation):", err);
      alert("댓글 삭제에 실패했습니다. (더미 오류)");
    }
  };

  const renderCommentItem = (comment: CommentType) => {
    const createdAtDate = new Date(comment.createdAt);
    const formattedDate = !isNaN(createdAtDate.getTime())
      ? createdAtDate.toLocaleDateString('ko-KR')
      : '날짜 정보 없음';

    const isMine = comment.username === currentUsername; // 로그인한 사용자와 댓글 작성자 비교

    return (
      <ItemContainer key={comment.id}>
        <CommentMeta>
          <span>{comment.username}</span>
          <div>
            <span>{formattedDate}</span>
            {isMine && (
              <DeleteButton onClick={() => handleCommentDelete(comment.id)} style={{ marginLeft: '8px' /* spacing.sm */ }}>
                삭제
              </DeleteButton>
            )}
          </div>
        </CommentMeta>
        <CommentContent>{comment.content}</CommentContent>
      </ItemContainer>
    );
  };

  return (
    <SectionWrapper>
      <SectionTitle>댓글</SectionTitle>
      {/* 댓글 입력 섹션 */}
      {isLoggedIn ? (
        <InputWrapper>
          <StyledTextArea
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            maxLength={200}
            disabled={isSubmittingComment}
          />
          <MaxLengthText>
            {commentContent.length} / 200
          </MaxLengthText>
          <SubmitButton onClick={handleCommentSubmit} disabled={isSubmittingComment}>
            댓글 등록
          </SubmitButton>
        </InputWrapper>
      ) : (
        <LoginPrompt>댓글을 작성하려면 로그인해주세요.</LoginPrompt>
      )}

      {error && <EmptyComments style={{ color: 'red' }}>{error}</EmptyComments>}
      {isLoadingComments && comments.length === 0 && <EmptyComments>댓글을 불러오는 중입니다...</EmptyComments>}

      {/* 댓글 목록 섹션 */}
      <CommentListContainer>
        {comments.length > 0 ? (
          comments.map(renderCommentItem)
        ) : (
          !isLoadingComments && !error && !isSubmittingComment && <EmptyComments>아직 댓글이 없습니다.</EmptyComments>
        )}
      </CommentListContainer>

      {hasMore && (
        <LoadMoreButton onClick={() => fetchComments(currentPage + 1)} disabled={isLoadingComments}>
          {isLoadingComments ? '댓글 불러오는 중...' : '댓글 더 보기'}
        </LoadMoreButton>
      )}
    </SectionWrapper>
  );
};

export default Comment;
