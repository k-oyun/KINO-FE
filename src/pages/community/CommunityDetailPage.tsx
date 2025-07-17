import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from '../../components/community/Comment';
// import axios from 'axios';

// 필요한 타입은 이 파일 내에서 직접 정의합니다.
interface PostType {
  id: string;
  title: string;
  username: string;
  createdAt: string;
  views: number;
  likeCount: number;
  tags: string[];
  movieId: string | null;
  movieTitle: string | null;
}

interface PostDetailType extends PostType {
  content: string;
  isLiked: boolean;
}

const DUMMY_POSTS: PostDetailType[] = [
  {
    id: "post-1",
    title: "첫 번째 더미 게시글",
    content: "이것은 첫 번째 게시글의 내용입니다. 더미 데이터로 테스트 중입니다. 게시글의 내용은 충분히 길어서 여러 줄로 표시될 수 있습니다. 여기에는 영화에 대한 상세한 리뷰나 개인적인 감상, 혹은 영화와 관련된 흥미로운 정보들이 포함될 수 있습니다. 사용자 경험을 위해 가독성 좋게 작성되어야 합니다.",
    username: "더미유저1",
    createdAt: "2024-07-16T10:00:00Z",
    views: 5,
    likeCount: 2,
    isLiked: false,
    tags: ["리뷰", "영화"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-2",
    title: "두 번째 더미 게시글",
    content: "두 번째 게시글 내용입니다. 기능 테스트를 위해 작성되었습니다. 이 게시글은 특정 영화에 대한 팁이나 숨겨진 이스터 에그에 대한 내용일 수 있습니다. 정보 전달을 목적으로 하며, 독자들이 쉽게 이해할 수 있도록 구성됩니다.",
    username: "더미유저2",
    createdAt: "2024-07-15T14:30:00Z",
    views: 12,
    likeCount: 7,
    isLiked: true,
    tags: ["정보", "뉴스"],
    movieId: "movie-2",
    movieTitle: "인터스텔라",
  },
  {
    id: "post-3",
    title: "세 번째 테스트 게시글",
    content: "테스트를 위한 세 번째 게시글입니다. 영화 관련 내용입니다. 이 게시글은 특정 장르의 영화 추천이나, 최근 개봉작에 대한 간략한 평가를 담을 수 있습니다. 사용자들이 다양한 관점에서 영화를 즐길 수 있도록 돕습니다.",
    username: "더미유저3",
    createdAt: "2024-07-14T09:15:00Z",
    views: 8,
    likeCount: 3,
    isLiked: false,
    tags: ["리뷰"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-4",
    title: "네 번째 게시글 제목",
    content: "네 번째 게시글의 상세 내용입니다. 더미 데이터 추가. 이 게시글은 자유 게시판 성격으로, 영화와 관련 없는 일상 이야기나 질문, 혹은 다른 사용자들과의 소통을 위한 공간으로 활용될 수 있습니다.",
    username: "더미유저1",
    createdAt: "2024-07-13T11:00:00Z",
    views: 20,
    likeCount: 10,
    isLiked: true,
    tags: ["자유"],
    movieId: null,
    movieTitle: null,
  },
];


const PostDetailContainer = styled.div`
  max-width: 1200px;
  margin: 100px auto 24px;
  padding: 25px;
  color: #f0f0f0;
  background-color: #000000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

// --- 게시글 내용 UI ---
const ContentWrapper = styled.div`
  color: #f0f0f0;
  margin-bottom: 24px;
`;

const PostHeader = styled.div`
  border-bottom: 1px solid #222222;
  padding-bottom: 16px;
  margin-bottom: 24px;
`;

const PostTitle = styled.h1`
  font-size: 2em;
  font-weight: bold;
  color: #fe5890;
  margin-bottom: 8px;
`;

const PostMeta = styled.div`
  font-size: 0.9em;
  color: #bbb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentArea = styled.div`
  font-size: 1em;
  line-height: 1.6;
  color: #f0f0f0;
  min-height: 200px;
  white-space: pre-wrap;
`;

// --- 버튼 그룹 및 스타일 ---
const ActionGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  border-top: 1px solid #222222;
  padding-top: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledButton = styled.button`
  background-color: #333333;
  color: #f0f0f0;
  border: 1px solid #222222;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #555555;
    border-color: #fe5890;
    color: #fe5890;
  }
`;

const LikeButton = styled(StyledButton)<{ isLiked: boolean }>`
  background-color: ${props => props.isLiked ? '#fe5890' : '#333333'};
  color: ${props => props.isLiked ? 'black' : '#f0f0f0'};
  border-color: ${props => props.isLiked ? '#fe5890' : '#222222'};

  &:hover {
    background-color: ${props => props.isLiked ? '#fe5890D0' : '#555555'};
    border-color: ${props => props.isLiked ? '#fe5890' : '#fe5890'};
    color: ${props => props.isLiked ? 'black' : '#fe5890'};
  }
`;

const DeleteButton = styled(StyledButton)`
  background-color: #d32f2f;
  border-color: #d32f2f;
  color: white;
  &:hover {
    background-color: #c62828;
    border-color: #c62828;
    color: white;
  }
`;

const BackButton = styled(StyledButton)`
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
  padding: 50px 0;
  font-size: 1.1em;
`;

const ErrorState = styled(LoadingState)``;


const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: 실제 로그인 사용자 정보 가져오는 로직 필요 (예: Context API, Redux 등)
  const currentLoggedInUser = { username: "더미유저1" }; // 임시 더미 데이터: '더미유저1'이 로그인했다고 가정


  const getPost = async (loading: boolean = true) => {
    if (loading) setIsLoading(true);
    setError(null);
    try {
      if (!id) {
        setError("게시글 ID가 없습니다.");
        return;
      }
      // 🚨 실제 API 호출 부분 대신 더미 데이터를 사용합니다 🚨
      const foundPost = DUMMY_POSTS.find(p => p.id === id);

      if (foundPost) {
        setPost({ ...foundPost, isLiked: foundPost.isLiked }); // isLiked 필드 유지
      } else {
        setError("해당 게시글을 찾을 수 없습니다.");
      }
    } catch (e) {
      console.error("Failed to fetch post (dummy data simulation):", e);
      setError("게시글을 불러오는데 실패했습니다. (더미 데이터 처리 오류)");
    } finally {
      // 실제 네트워크 지연을 시뮬레이션하기 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 300));
      if (loading) setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [id]); // id가 변경될 때마다 게시글 다시 로드

  const likePost = async () => {
    if (!post) return;
    // 좋아요 상태를 토글하는 더미 로직
    setPost(prevPost => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        isLiked: !prevPost.isLiked,
        likeCount: prevPost.isLiked ? prevPost.likeCount - 1 : prevPost.likeCount + 1
      };
    });
    alert("좋아요 상태 변경 (더미)");
  };

  const deletePost = async () => {
    if (!post) return;
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까? (더미)")) {
      // 더미 데이터에서는 실제 삭제는 일어나지 않음
      alert("게시글이 삭제되었습니다. (더미)");
      navigate("/community"); // 목록 페이지로 이동
    }
  };

  if (isLoading) {
    return <LoadingState>게시글을 불러오는 중입니다...</LoadingState>;
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (!post) {
    return <ErrorState>게시글을 찾을 수 없습니다.</ErrorState>;
  }

  const createdAtDate = new Date(post.createdAt);
  const formattedDate = !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleDateString('ko-KR')
    : '날짜 정보 없음';

  // 본인 글인지 확인하는 로직 (더미유저1과 게시글 작성자 비교)
  const isMyPost = post.username === currentLoggedInUser.username;

  return (
    <PostDetailContainer>
      {/* 게시글 상세 내용 */}
      <ContentWrapper>
        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <span>작성자: {post.username}</span>
            <span>날짜: {formattedDate}</span>
          </PostMeta>
        </PostHeader>
        <ContentArea>{post.content}</ContentArea>
      </ContentWrapper>

      {/* 좋아요 및 액션 버튼 */}
      <ActionGroup>
        <LikeButton isLiked={post.isLiked} onClick={likePost}>
          {post.isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'} ({post.likeCount})
        </LikeButton>
        <ButtonGroup>
          {isMyPost && ( // 본인 게시글일 경우에만 수정/삭제 버튼 표시
            <>
              <StyledButton onClick={() => navigate(`/community/edit/${post.id}`)}>수정</StyledButton>
              <DeleteButton onClick={deletePost}>삭제</DeleteButton>
            </>
          )}
          <BackButton onClick={() => navigate("/community")}>목록으로</BackButton>
        </ButtonGroup>
      </ActionGroup>

      {/* 댓글 섹션 (Comment 컴포넌트 사용) */}
      <Comment
        postId={post.id}
        isLoggedIn={!!currentLoggedInUser.username} // 로그인 여부 (더미 유저네임 존재 여부로 판단)
        currentUsername={currentLoggedInUser.username} // 현재 로그인한 사용자 닉네임 전달
      />
    </PostDetailContainer>
  );
};

export default CommunityDetailPage;
