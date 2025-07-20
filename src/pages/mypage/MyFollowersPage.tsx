import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import UserListItem from '../../components/mypage/UserListItem';
import VideoBackground from '../../components/VideoBackground';
import useMyPageApi from '../../api/mypage';
import Pagination from '../../components/PageNation';

export interface FollowerApiResponse {
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

interface FollowerType {
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

const MyFollowersPage: React.FC = () => {
  const navigate = useNavigate();
  const { getFollower, followUser, unfollowUser } = useMyPageApi();

  const [followers, setFollowers] = useState<FollowerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: 로그인 유 ID 연동
  const myUserId = "1";

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    size: ITEMS_PER_PAGE,
    pageContentAmount: 0,
  });

  useEffect(() => {
    const loadFollowers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getFollower(Number(myUserId));
        const data: FollowerApiResponse["data"] | null = res.data.data;
        if (data) {
          const mappedFollowers: FollowerType[] = data.map((follower) => ({
            id: String(follower.userId),
            nickname: follower.nickname,
            profileImageUrl:
              follower.profileImageUrl ||
              `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${follower.nickname.substring(0, 1)}`,
            isFollowing: follower.follow,
          }));
          setFollowers(mappedFollowers);
        } else {
          setFollowers([]);
        }
      } catch (err) {
        console.error("팔로워 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        } else {
          setError("팔로워 목록을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadFollowers();
  }, [getFollower, myUserId, navigate]);

  useEffect(() => {
    const totalPages = Math.ceil(followers.length / ITEMS_PER_PAGE) || 0;
    setPageInfo((prev) => ({
      ...prev,
      currentPage: prev.currentPage >= totalPages ? 0 : prev.currentPage,
      size: ITEMS_PER_PAGE,
      pageContentAmount: totalPages,
    }));
  }, [followers]);

  const currentFollowers = useMemo(() => {
    const startIdx = pageInfo.currentPage * pageInfo.size;
    const endIdx = startIdx + pageInfo.size;
    return followers.slice(startIdx, endIdx);
  }, [followers, pageInfo]);

  const handleFollowToggle = async (
    targetUserId: string,
    isCurrentlyFollowing: boolean
  ) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(Number(targetUserId));
        console.log(`User ${targetUserId} 언팔로우 성공`);
        setFollowers((prevFollowers) =>
          prevFollowers.filter((follower) => follower.id !== targetUserId)
        );
      } else {
        await followUser(Number(targetUserId));
        console.log(`User ${targetUserId} 팔로우 성공`);
        setFollowers((prevFollowers) =>
          prevFollowers.map((f) =>
            f.id === targetUserId ? { ...f, isFollowing: true } : f
          )
        );
      }
    } catch (err) {
      console.error(`팔로우/언팔로우 실패 for user ${targetUserId}:`, err);
      alert("팔로우/언팔로우 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <PageContainer>
      <VideoBackground />
      <SectionWrapper>
        <PageHeader>
          <BackButton onClick={() => navigate('/mypage')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <PageTitle><PinkText>팔로워</PinkText></PageTitle>
        </PageHeader>

        {loading ? (
          <EmptyState>팔로워 목록을 불러오는 중...</EmptyState>
        ) : error ? (
          <EmptyState>오류 발생: {error}</EmptyState>
        ) : followers.length > 0 ? (
          <>
            <UserList>
              {currentFollowers.map((follower) => (
                <UserListItem
                  key={follower.id}
                  user={follower}
                  onFollowToggle={handleFollowToggle}
                  type="follower"
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
              />
            )}
          </>
        ) : (
          <EmptyState>아직 팔로워가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyFollowersPage;