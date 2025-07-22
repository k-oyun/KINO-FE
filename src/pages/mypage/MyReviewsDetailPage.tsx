import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom"; // useParams 다시 추가

import DetailReviewCard from "../../components/mypage/DetailReviewCard";
import useMypageApi from "../../api/mypage";
import VideoBackground from "../../components/VideoBackground";
import Pagination from "../../components/Pagenation";

// ---------------- Types ----------------
interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface DetailReviewType {
  reviewId: number;
  image: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  userId: number; // 리뷰 작성자의 ID
  userProfile: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  userNickname: string; // 이 필드는 사용되지 않는 것으로 보여 주석 처리 또는 제거 고려
  title: string;
  content: string;
  isMine: boolean; // 로그인한 사용자 본인의 리뷰인지 여부
  liked: boolean;
  likeCount: number;
  totalViews: number;
  commentCount: number;
  createdAt: string;
  reviewer: UserProfileType; // 리뷰를 작성한 유저의 프로필 정보
}

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const ITEMS_PER_PAGE = 5;

const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[. :]/).map(Number);
  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
    parts[3] ?? 0,
    parts[4] ?? 0
  );
};

// --- styled-components (변경 없음) ---
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
`;

const SectionWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 25px;
  @media (max-width: 767px) {
    padding: 20px;
    margin-bottom: 15px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #f0f0f0;
  font-size: 2em;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateX(-5px);
  }
  svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 10px;
    align-self: flex-start;
  }
`;

const PageTitle = styled.h1`
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

const SortOptions = styled.div`
  display: flex;
  gap: 10px;
  font-size: 0.9em;
  margin-bottom: 20px;
  justify-content: flex-end;
  @media (max-width: 767px) {
    font-size: 0.8em;
    justify-content: flex-start;
  }
`;

const SortButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.isActive ? "#e0e0e0" : "#888")};
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  cursor: pointer;
  padding: 5px 0;
  position: relative;
  &:hover {
    color: #f0f0f0;
  }
  ${(props) =>
    props.isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #e0e0e0;
    }
  `}
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
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

const PinkText = styled.span`
  color: #ff69b4;
  font-weight: bold;
  margin-left: 0.25em;
`;
// --- styled-components 끝 ---

const MyReviewsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  // useParams를 사용하여 targetId를 다시 받습니다.
  const { targetId: rawTargetId } = useParams<{ targetId?: string }>();

  // 안전 파싱: 숫자가 아니면 undefined 처리
  const parsed = rawTargetId !== undefined ? Number(rawTargetId) : undefined;
  const targetUserId =
    rawTargetId && !Number.isNaN(parsed) ? parsed : undefined;

  const { mypageReview, userInfoGet, mypageMain } = useMypageApi(); // mypageMain 추가

  const [loggedInUser, setLoggedInUser] = useState<UserProfileType | null>(
    null
  );
  const [targetUserNickname, setTargetUserNickname] = useState<string | null>(
    null
  );

  const [sortOrder, setSortOrder] = useState<"latest" | "views" | "likes">(
    "latest"
  );
  const [detailReviews, setDetailReviews] = useState<DetailReviewType[]>([]);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  // ---------------- Load Logged-in User ----------------
  useEffect(() => {
    (async () => {
      try {
        const res = await userInfoGet();
        setLoggedInUser(res.data?.data || null);
      } catch (err) {
        console.error("[MyReviewsDetailPage] 로그인 사용자 로드 실패:", err);
        setLoggedInUser(null);
      }
    })();
  }, [userInfoGet]);

  // ---------------- Load Target Nickname (if viewing someone else) ----------------
  useEffect(() => {
    if (targetUserId == null) {
      setTargetUserNickname(null); // 내 페이지일 경우 닉네임 설정 안 함
      return;
    }
    (async () => {
      try {
        const res = await mypageMain(targetUserId);
        const profile: UserProfileType | undefined = res.data?.data;
        setTargetUserNickname(profile?.nickname ?? `사용자 ${targetUserId}`);
      } catch {
        setTargetUserNickname(`사용자 ${targetUserId}`); // 로드 실패 시 대체 닉네임
      }
    })();
  }, [targetUserId, mypageMain]);

  // ---------------- Load Detail Reviews ----------------
  const loadDetailReviews = useCallback(async () => {
    // 어떤 유저의 리뷰를 볼지 결정
    const idToLoad =
      targetUserId ?? // URL에 명시된 타겟 (타인의 페이지)
      loggedInUser?.userId; // 없으면 내 것

    if (idToLoad == null || Number.isNaN(idToLoad)) {
      console.warn("[MyReviewsDetailPage] 로드할 사용자 ID가 없습니다.");
      setDetailReviews([]);
      return;
    }

    try {
      const res = await mypageReview(idToLoad); // 결정된 ID로 API 호출
      const arr = Array.isArray(res?.data?.data?.reviews)
        ? res.data.data.reviews
        : [];
      setDetailReviews(arr);
    } catch (err) {
      console.error("[MyReviewsDetailPage] 상세 리뷰 로드 실패:", err);
      setDetailReviews([]);
    }
  }, [mypageReview, targetUserId, loggedInUser]); // loggedInUser와 targetUserId를 의존성에 추가

  useEffect(() => {
    // 로그인 사용자 정보가 준비된 후에 데이터 로드 (내 페이지일 때 필요)
    // rawTargetId가 있으면 (타인 페이지) 바로 로드 시도, 없으면 loggedInUser 대기
    if (!rawTargetId && !loggedInUser) return;
    loadDetailReviews();
  }, [rawTargetId, loggedInUser, loadDetailReviews]);

  // ---------------- Owner 판단 ----------------
  const isOwner =
    targetUserId == null || // 파라미터가 없으면 내 페이지
    (loggedInUser?.userId != null && targetUserId === loggedInUser.userId);

  const sortedReviews = useMemo(() => {
    const arr = [...detailReviews];
    if (sortOrder === "latest") {
      arr.sort(
        (a, b) =>
          parseDateString(b.createdAt).getTime() -
          parseDateString(a.createdAt).getTime()
      );
    } else if (sortOrder === "views") {
      arr.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    } else if (sortOrder === "likes") {
      arr.sort((a, b) => b.likeCount - a.likeCount);
    }
    return arr;
  }, [detailReviews, sortOrder]);

  // 페이지네이션 정보 업데이트
  useEffect(() => {
    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE) || 0;
    setPageInfo((prev) => {
      const currentPage = prev.currentPage >= totalPages ? 0 : prev.currentPage;
      return {
        ...prev,
        currentPage,
        size: ITEMS_PER_PAGE,
        pageContentAmount: totalPages,
      };
    });
  }, [sortedReviews]);

  const handleSortChange = (order: "latest" | "views" | "likes") => {
    setSortOrder(order);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  const startIdx = pageInfo.currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageReviews = sortedReviews.slice(startIdx, endIdx);

  const handleReviewClick = (reviewId: number) => {
    // 여기서는 특정 리뷰 ID를 클릭했을 때 해당 상세 리뷰 페이지로 이동합니다.
    navigate(`/reviews/detail/${reviewId}`);
  };

  // ---------------- Render ----------------
  const titlePrefix = isOwner
    ? "내가 작성한"
    : targetUserNickname
    ? `${targetUserNickname} 님이 작성한`
    : "사용자가 작성한"; // 닉네임 로드 전/실패 시 대체 문구

  // 로그인 사용자 정보가 아직 없고 내 페이지인지 판별 안 된 경우 로딩
  if (!loggedInUser && targetUserId == null) {
    return (
      <PageContainer>
        <VideoBackground />
        <EmptyState>프로필 정보를 로드 중입니다...</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton
            onClick={() =>
              navigate(isOwner ? "/mypage" : `/mypage/${targetUserId}`)
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L9 12L15 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackButton>
          <PageTitle>
            {titlePrefix} <PinkText>상세 리뷰</PinkText>
          </PageTitle>
        </PageHeader>

        <SortOptions>
          <SortButton
            isActive={sortOrder === "latest"}
            onClick={() => handleSortChange("latest")}
          >
            최신순
          </SortButton>
          <SortButton
            isActive={sortOrder === "views"}
            onClick={() => handleSortChange("views")}
          >
            조회순
          </SortButton>
          <SortButton
            isActive={sortOrder === "likes"}
            onClick={() => handleSortChange("likes")}
          >
            좋아요순
          </SortButton>
        </SortOptions>

        {sortedReviews.length > 0 ? (
          <>
            <ReviewList>
              {currentPageReviews.map((review) => (
                <DetailReviewCard
                  key={review.reviewId}
                  review={review}
                  // isMine은 현재 보고 있는 유저의 ID와 로그인한 유저의 ID가 같은지 여부로 판단
                  isMine={isOwner}
                  showProfile={true}
                  onClick={() => handleReviewClick(review.reviewId)}
                />
              ))}
            </ReviewList>

            {pageInfo.pageContentAmount > 1 && (
              <Pagination
                size={pageInfo.size}
                itemsPerPage={ITEMS_PER_PAGE}
                pageContentAmount={pageInfo.pageContentAmount}
                currentPage={pageInfo.currentPage}
                setPageInfo={setPageInfo}
                pageInfo={pageInfo}
                selectedOption={sortOrder}
              />
            )}
          </>
        ) : (
          <EmptyState>작성한 상세 리뷰가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyReviewsDetailPage;
