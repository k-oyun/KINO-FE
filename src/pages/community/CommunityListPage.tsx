import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import { useMediaQuery } from "react-responsive";
import useReviewsApi from "../../api/reviews";

interface DetailReview {
  reviewId: string;
  userProfile: string;
  userNickname: string;
  title: string;
  content: string;
  mine: boolean;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
}

// interface PostsResponse {
//   posts: PostType[];
//   totalCount: number;
//   totalPages: number;
// }

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px;
  padding-top: 65px;
  min-height: calc(100vh - 60px);
  /* color: #f0f0f0; */
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
    background-color: #fe5890d0;
  }

  @media (max-width: 767px) {
    padding: 8px 15px;
    font-size: 0.9em;
  }
`;

const PostListWrapper = styled.div`
  padding: 25px;
  border-radius: 8px;
  background-color: #eee;
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
  /* color: #aaa; */
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
  text-align: right;

  span {
    color: #ff69b4;
    font-weight: bold;
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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();
  const location = useLocation();
  const { getReviews } = useReviewsApi();

  const [posts, setPosts] = useState<DetailReview[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [currentSearchInput, setCurrentSearchInput] = useState('');
  const pageSize = 10;

  // const currentPage = useMemo(() => {
  //   const params = new URLSearchParams(location.search);
  //   const pageParam = parseInt(params.get("page") || "1", 10);
  //   return isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  // }, [location.search]);

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const initialQuery = params.get("search") || "";
  //   setSearchQuery(initialQuery);
  //   // setCurrentSearchInput(initialQuery);
  // }, [location.search]);

  const loadMoreReviews = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = await getReviews(page, pageSize);
      const content = res.data.data.content;

      console.log("불러온 리뷰 데이터:", content);
      setPosts((prev) => [...prev, ...content]);
      setPage((prev) => prev + 1);
      setTotalCount(res.data.data.totalElements);
      setError(null);

      if (res.data.data.last) {
        setHasMore(false);
      }
    } catch (e) {
      console.error("리뷰 데이터를 불러오지 못했습니다", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreReviews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreReviews();
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

  // const handleSearch = () => {
  //   navigate(`/community?page=1&search=${currentSearchInput}`);
  // };

  const handleCreatePost = () => {
    navigate("/community/new");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/${postId}`);
  };

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
          <EmptyState style={{ color: "red" }}>{error}</EmptyState>
        ) : posts.length > 0 ? (
          <ListContainer>
            {posts.map((post) => (
              <DetailReviewCard
                key={post.reviewId}
                review={post}
                isMine={post.mine}
                isMobile={isMobile}
                showProfile={true}
                onClick={() => handlePostClick(post.reviewId)}
              />
            ))}
            <div ref={observerRef} style={{ height: 1 }} />{" "}
            {/* 감지용 sentinel */}
            {isLoading && <EmptyState>불러오는 중...</EmptyState>}
            {!hasMore && <EmptyState>더 이상 게시글이 없습니다.</EmptyState>}
          </ListContainer>
        ) : (
          <EmptyState>첫 게시글을 작성해 주세요. ^^</EmptyState>
        )}
      </PostListWrapper>
    </PageContainer>
  );
};

export default CommunityListPage;
