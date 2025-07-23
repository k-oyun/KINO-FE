import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import { useMediaQuery } from "react-responsive";
import useReviewsApi from "../../api/reviews";
import { useTranslation } from "react-i18next";
import { useMypageApi } from "../../api/mypage";

interface DetailReview {
  reviewId: number;
  image: string;
  userId: number;
  userImage: string;
  userNickname: string;
  title: string;
  content: string;
  isMine: boolean;
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
  margin-bottom: 15px;
`;

const PageTitle = styled.h2`
  font-size: 1.8em;
  font-weight: bold;
  margin-left: 30px;
  @media (max-width: 767px) {
    font-size: 1.4em;
    margin-left: 15px;
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

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  @media (max-width: 767px) {
    padding: 8px 15px;
    font-size: 0.9em;
  }
`;

const PostListWrapper = styled.div`
  padding: 25px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme.backgroundColor === "#ffffff" ? "#f0f0f0" : "#222222"};
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
  const { i18n, t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();
  const location = useLocation();
  const { getReviews } = useReviewsApi();
  const { userInfoGet } = useMypageApi();
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
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

      console.log("불러온 리뷰 데이터:", res.data.data);
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

  const loadMyInfo = async () => {
    try {
      const res = userInfoGet();
      res.then((data) => {
        console.log("내 정보 불러오기 성공:", data.data.data);
        if (!data.data.data.isUserActive) {
          setIsUserActive(false);
        }
      });
    } catch (e) {
      console.error("내 정보를 불러오지 못했습니다", e);
    }
  };

  useEffect(() => {
    loadMyInfo();
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

  const handlePostClick = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t("movieStory")}</PageTitle>
        <CreatePostButton onClick={handleCreatePost} disabled={!isUserActive}>
          {t("write")}
        </CreatePostButton>
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
        <InfoText>{t("reviewCount", { count: totalCount })}</InfoText>
        {isLoading ? (
          <EmptyState>{t("loadingReviews")}</EmptyState>
        ) : error ? (
          <EmptyState style={{ color: "red" }}>{error}</EmptyState>
        ) : posts.length > 0 ? (
          <ListContainer>
            {posts.map((post) => (
              <DetailReviewCard
                key={post.reviewId}
                review={post}
                isMine={post.isMine}
                isMobile={isMobile}
                showProfile={true}
                onClick={() => handlePostClick(post.reviewId)}
                onDelete={(reviewId) => {
                  setPosts((prev) =>
                    prev.filter((p) => p.reviewId !== reviewId)
                  );
                  setTotalCount((prev) => prev - 1);
                }}
              />
            ))}
            <div ref={observerRef} style={{ height: 1 }} />{" "}
            {/* 감지용 sentinel */}
            {isLoading && <EmptyState>{t("loading")}</EmptyState>}
            {!hasMore && <EmptyState>{t("noMoreReviews")}</EmptyState>}
          </ListContainer>
        ) : (
          <EmptyState>{t("noReview")}</EmptyState>
        )}
      </PostListWrapper>
    </PageContainer>
  );
};

export default CommunityListPage;
