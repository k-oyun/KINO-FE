import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import PostCard from '../../components/community/PostCard';
// import axios from 'axios';

// 필요한 PostType 인터페이스를 이 파일 내에 직접 정의합니다.
interface PostType {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  views: number;
  likeCount: number;
  isLiked: boolean;
  tags: string[];
  movieId: string | null;
  movieTitle: string | null;
}

// interface PostsResponse {
//   posts: PostType[];
//   totalCount: number;
//   totalPages: number;
// }

const DUMMY_POSTS: PostType[] = [
  {
    id: "post-1",
    title: "첫 번째 더미 게시글",
    content: "이것은 첫 번째 게시글의 내용입니다. 더미 데이터로 테스트 중입니다.",
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
    content: "두 번째 게시글 내용입니다. 기능 테스트를 위해 작성되었습니다.",
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
    content: "테스트를 위한 세 번째 게시글입니다. 영화 관련 내용입니다.",
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
    content: "네 번째 게시글의 상세 내용입니다. 더미 데이터 추가.",
    username: "더미유저1",
    createdAt: "2024-07-13T11:00:00Z",
    views: 20,
    likeCount: 10,
    isLiked: true,
    tags: ["자유"],
    movieId: null,
    movieTitle: null,
  },
  {
    id: "post-5",
    title: "다섯 번째 더미 게시글",
    content: "다섯 번째 게시글 내용입니다.",
    username: "더미유저5",
    createdAt: "2024-07-12T10:00:00Z",
    views: 5,
    likeCount: 2,
    isLiked: false,
    tags: ["리뷰"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-6",
    title: "여섯 번째 더미 게시글",
    content: "여섯 번째 게시글 내용입니다.",
    username: "더미유저6",
    createdAt: "2024-07-11T14:30:00Z",
    views: 12,
    likeCount: 7,
    isLiked: true,
    tags: ["정보"],
    movieId: "movie-2",
    movieTitle: "인터스텔라",
  },
  {
    id: "post-7",
    title: "일곱 번째 테스트 게시글",
    content: "일곱 번째 게시글 내용입니다.",
    username: "더미유저7",
    createdAt: "2024-07-10T09:15:00Z",
    views: 8,
    likeCount: 3,
    isLiked: false,
    tags: ["리뷰"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-8",
    title: "여덟 번째 게시글 제목",
    content: "여덟 번째 게시글 내용입니다.",
    username: "더미유저8",
    createdAt: "2024-07-09T11:00:00Z",
    views: 20,
    likeCount: 10,
    isLiked: true,
    tags: ["자유"],
    movieId: null,
    movieTitle: null,
  },
  {
    id: "post-9",
    title: "아홉 번째 더미 게시글",
    content: "아홉 번째 게시글 내용입니다.",
    username: "더미유저9",
    createdAt: "2024-07-08T10:00:00Z",
    views: 5,
    likeCount: 2,
    isLiked: false,
    tags: ["리뷰"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-10",
    title: "열 번째 더미 게시글",
    content: "열 번째 게시글 내용입니다.",
    username: "더미유저10",
    createdAt: "2024-07-07T14:30:00Z",
    views: 12,
    likeCount: 7,
    isLiked: true,
    tags: ["정보"],
    movieId: "movie-2",
    movieTitle: "인터스텔라",
  },
  {
    id: "post-11",
    title: "열한 번째 테스트 게시글",
    content: "열한 번째 게시글 내용입니다.",
    username: "더미유저11",
    createdAt: "2024-07-06T09:15:00Z",
    views: 8,
    likeCount: 3,
    isLiked: false,
    tags: ["리뷰"],
    movieId: "movie-1",
    movieTitle: "인셉션",
  },
  {
    id: "post-12",
    title: "열두 번째 게시글 제목",
    content: "열두 번째 게시글 내용입니다.",
    username: "더미유저12",
    createdAt: "2024-07-05T11:00:00Z",
    views: 20,
    likeCount: 10,
    isLiked: true,
    tags: ["자유"],
    movieId: null,
    movieTitle: null,
  },
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 100px;
  background-color: #000000;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;

  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const PageTitle = styled.h2`
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;

  @media (max-width: 767px) {
    font-size: 1.4em;
  }
  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const CreatePostButton = styled.button`
  background-color: #fe5890;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fe5890D0;
  }

  @media (max-width: 767px) {
    padding: 8px 15px;
    font-size: 0.9em;
  }
`;

const PostListWrapper = styled.div`
  background-color: #000000;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;

  @media (max-width: 767px) {
    padding: 20px;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyState = styled.div`
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;

  @media (max-width: 767px) {
    padding: 20px 0;
    font-size: 1em;
  }
`;

const InfoText = styled.div`
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #bbb;
  text-align: right;

  span {
    color: #ff69b4;
    font-weight: bold;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #222222;
  border-radius: 4px;
  color: #f0f0f0;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.isActive && `
    background-color: #fe5890;
    color: black;
    border-color: #fe5890;
  `}

  &:hover {
    background-color: #333333;
    border-color: #f0f0f0;
  }

  ${props => props.isActive && `
    &:hover {
      background-color: #fe5890D0;
      border-color: #fe5890;
    }
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// 검색 바 관련 스타일 (추가)
// const InputGroup = styled.div`
//   display: flex;
//   width: 100%;
//   border-radius: 8px;
//   overflow: hidden;
//   background-color: #333333;
//   border: 1px solid #222222;
// `;

// const SearchInput = styled.input`
//   flex-grow: 1;
//   padding: 12px 15px;
//   border: none;
//   background-color: transparent;
//   color: #f0f0f0;
//   font-size: 1em;

//   &:focus {
//     outline: none;
//     box-shadow: none;
//   }

//   &::placeholder {
//     color: #bbb;
//   }
// `;

// const SearchButton = styled.button`
//   padding: 12px 20px;
//   background-color: #fe5890;
//   color: black;
//   border: none;
//   cursor: pointer;
//   transition: background-color 0.2s ease;

//   &:hover {
//     background-color: #fe5890D0;
//   }
// `;


const CommunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const [currentSearchInput, setCurrentSearchInput] = useState('');

  const pageSize = 10;

  const currentPage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get('page') || '1', 10);
    return isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('search') || '';
    setSearchQuery(initialQuery);
    // setCurrentSearchInput(initialQuery);
  }, [location.search]);

  const getCommunityList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filteredPosts = DUMMY_POSTS.filter(post =>
        post.title.includes(searchQuery) ||
        post.content.includes(searchQuery) ||
        post.username.includes(searchQuery) ||
        post.tags.some(tag => tag.includes(searchQuery))
      );

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      setPosts(paginatedPosts);
      setTotalCount(filteredPosts.length);
      setTotalPages(Math.ceil(filteredPosts.length / pageSize));

    } catch (e) {
      console.error("Failed to fetch community list (dummy data simulation):", e);
      setError("게시글 목록을 불러오는데 실패했습니다. (더미 데이터 처리 오류)");
      setPosts([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    getCommunityList();
  }, [getCommunityList]);

  // const handleSearch = () => {
  //   navigate(`/community?page=1&search=${currentSearchInput}`);
  // };

  const handlePageChange = (page: number) => {
    navigate(`/community?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`);
  };

  const handleCreatePost = () => {
    navigate("/community/new");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/posts/${postId}`);
  };

  const currentGroupStart = useMemo(() => {
    const groupSize = 5;
    return Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  }, [currentPage]);

  const pageGroup = useMemo(() => {
    const groupSize = 5;
    const pages = [];
    for (let i = 0; i < groupSize; i++) {
      const page = currentGroupStart + i;
      if (page <= totalPages) {
        pages.push(page);
      }
    }
    return pages;
  }, [currentGroupStart, totalPages]);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>영화 이야기</PageTitle>
        <CreatePostButton onClick={handleCreatePost}>글쓰기</CreatePostButton>
      </PageHeader>

      {/* <div style={{ marginBottom: '20px' }}>
        <InputGroup>
          <SearchInput
            type="text"
            placeholder="제목, 내용, 작성자, 태그로 검색..."
            value={currentSearchInput}
            onChange={(e) => setCurrentSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </InputGroup>
      </div> */}

      <PostListWrapper>
        <InfoText>
          총 <span>{totalCount}</span>개의 게시글이 있습니다
        </InfoText>
        {isLoading ? (
          <EmptyState>게시글을 불러오는 중입니다...</EmptyState>
        ) : error ? (
          <EmptyState style={{ color: 'red' }}>{error}</EmptyState>
        ) : posts.length > 0 ? (
          <ListContainer>
            {posts.map(post => (
              <PostCard key={post.id} post={post} onClick={handlePostClick} />
            ))}
          </ListContainer>
        ) : (
          <EmptyState>아직 게시글이 없습니다.</EmptyState>
        )}
      </PostListWrapper>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton
            onClick={() => handlePageChange(currentGroupStart - 1)}
            disabled={currentGroupStart === 1}
          >
            이전
          </PageButton>

          {pageGroup.map((page) => (
            <PageButton
              key={page}
              onClick={() => handlePageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            onClick={() => handlePageChange(currentGroupStart + pageGroup.length)}
            disabled={currentGroupStart + pageGroup.length > totalPages}
          >
            다음
          </PageButton>
        </PaginationContainer>
      )}
    </PageContainer>
  );
};

export default CommunityListPage;