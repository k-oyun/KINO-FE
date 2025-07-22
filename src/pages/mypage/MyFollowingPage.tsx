import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import UserListItem from "../../components/mypage/UserListItem";
import VideoBackground from "../../components/VideoBackground";
import useMyPageApi from "../../api/mypage";
import Pagination from "../../components/Pagenation";

export interface FollowingApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: Array<{
    userId: number;
    nickname: string;
    follow: boolean;
    profileImageUrl?: string;
  }>;
}

interface FollowingType {
  id: string;
  nickname: string;
  profileImageUrl: string;
  isFollowing: boolean;
}

interface PageInfo {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

const ITEMS_PER_PAGE = 20;

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
  flex-grow: 1;
  overflow-y: auto;

  @media (max-width: 767px) {
    padding: 20px;
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 767px) {
    gap: 10px;
  }
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 0px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -100px) scale(0.9);
  }
`;

const PopupContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  min-width: 250px;
  text-align: center;

  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.5s
    forwards;
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: visibility 0.5s, opacity 0.5s;

  @media (max-width: 767px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 20px;
    font-size: 1em;
    min-width: unset;
    width: 90%;
  }
`;

const MyFollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const { getFollowing, followUser, unfollowUser } = useMyPageApi();

  const [following, setFollowing] = useState<FollowingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const myUserId = "1";

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  const triggerPopup = useCallback((message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    const timer = setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadFollowing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getFollowing(Number(myUserId));
        const data: FollowingApiResponse["data"] | null = res.data.data;
        if (data) {
          const mappedFollowing: FollowingType[] = data.map((followedUser) => ({
            id: String(followedUser.userId),
            nickname: followedUser.nickname,
            profileImageUrl:
              followedUser.profileImageUrl ||
              `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${followedUser.nickname.substring(
                0,
                1
              )}`,
            isFollowing: followedUser.follow,
          }));
          setFollowing(mappedFollowing);
        } else {
          setFollowing([]);
        }
      } catch (err) {
        console.error("팔로잉 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log(
            "401 Unauthorized: Access token invalid or expired. Redirecting to login."
          );
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        } else {
          setError("팔로잉 목록을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFollowing();
  }, [getFollowing, myUserId, navigate]);

  useEffect(() => {
    const totalPages = Math.ceil(following.length / ITEMS_PER_PAGE) || 0;
    setPageInfo((prev) => ({
      ...prev,
      currentPage: prev.currentPage >= totalPages ? 0 : prev.currentPage,
      size: ITEMS_PER_PAGE,
      pageContentAmount: totalPages,
    }));
  }, [following]);

  const currentFollowing = useMemo(() => {
    const startIdx = pageInfo.currentPage * pageInfo.size;
    const endIdx = startIdx + pageInfo.size;
    return following.slice(startIdx, endIdx);
  }, [following, pageInfo]);

  const handleFollowToggle = async (
    targetUserId: string,
    isCurrentlyFollowing: boolean,
    targetUserNickname: string
  ) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(Number(targetUserId));
        console.log(`User ${targetUserId} 언팔로우 성공`);
        setFollowing((prevFollowing) =>
          prevFollowing.filter((user) => user.id !== targetUserId)
        );
        triggerPopup(`${targetUserNickname}님을 언팔로우했습니다.`);
      } else {
        await followUser(Number(targetUserId));
        console.log(`User ${targetUserId} 팔로우 성공`);
        setFollowing((prevFollowing) =>
          prevFollowing.map((u) =>
            u.id === targetUserId ? { ...u, isFollowing: true } : u
          )
        );
        triggerPopup(`${targetUserNickname}님을 팔로우했습니다.`);
      }
    } catch (err) {
      console.error(`팔로우/언팔로우 실패 for user ${targetUserId}:`, err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.log(
          "401 Unauthorized: Access token invalid or expired. Redirecting to login."
        );
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        alert("팔로우/언팔로우 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate("/mypage")}>
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
            <PinkText>팔로잉</PinkText>
          </PageTitle>
        </PageHeader>
        {loading ? (
          <EmptyState>팔로잉 목록을 불러오는 중...</EmptyState>
        ) : error ? (
          <EmptyState>오류 발생: {error}</EmptyState>
        ) : following.length > 0 ? (
          <>
            <UserList>
              {currentFollowing.map((followedUser) => (
                <UserListItem
                  key={followedUser.id}
                  user={followedUser}
                  onFollowToggle={handleFollowToggle}
                  isMyAccount={
                    loggedInUser?.userId === Number(followedUser.userId)
                  }
                  type="following"
                />
              ))}
            </UserList>

            {pageInfo.pageContentAmount > 1 && (
              <Pagination
                size={pageInfo.size}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={pageInfo.currentPage}
                pageContentAmount={pageInfo.pageContentAmount}
                setPageInfo={setPageInfo}
                pageInfo={pageInfo}
                selectedOption=""
              />
            )}
          </>
        ) : (
          <EmptyState>아직 팔로잉이 없습니다.</EmptyState>
        )}
      </SectionWrapper>

      {/* 팝업 */}
      <PopupContainer $isVisible={showPopup}>{popupMessage}</PopupContainer>
    </PageContainer>
  );
};

export default MyFollowingPage;
