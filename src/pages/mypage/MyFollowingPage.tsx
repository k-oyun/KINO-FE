  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios'; // axios.isAxiosError를 사용하기 위해 추가

  import UserListItem from '../../components/mypage/UserListItem';
  import VideoBackground from '../../components/VideoBackground';
  import useMyPageApi from '../../api/useMyPageApi'; // useMyPageApi와 FollowingApiResponse 임포트

  // src/pages/mypage/MyFollowingPage.tsx (또는 src/types/followTypes.ts 같은 별도 파일)
  // FollowingApiResponse 인터페이스
  export interface FollowingApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: Array<{
      userId: number;
      nickname: string;
      follow: boolean; // 내가 이 팔로잉 대상을 팔로우하고 있는지 여부 (이 페이지에서는 항상 true일 가능성 높음)
      profileImageUrl?: string; // API 명세에는 없지만, 프론트엔드에서 필요할 경우를 대비하여 선택적 속성으로 추가
    }>;
  }

  interface FollowingType {
    id: string; 
    nickname: string;
    profileImageUrl: string;
    isFollowing: boolean; // 내가 이 사용자를 팔로우하고 있는지 여부 (이 페이지에서는 항상 true로 시작)
  }

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
      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
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


  const MyFollowingPage: React.FC = () => {
    const navigate = useNavigate();
    // useMyPageApi에서 필요한 모든 함수를 구조 분해 할당
    const { fetchMyFollowing, followUser, unfollowUser } = useMyPageApi(); 

    const [following, setFollowing] = useState<FollowingType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 현재 로그인한 사용자의 ID를 localStorage 등에서 가져오거나, 다른 Context API를 통해 가져와야 합니다.
    // ⭐ 실제 사용자 ID로 대체해야 합니다. 예: localStorage.getItem('userId') || 'defaultUserId';
    const myUserId = "1"; 
    // const myUserId = "someLoggedInUserId"; 

    useEffect(() => {
      const loadFollowing = async () => {
        setLoading(true);
        setError(null);
        try {
          // ⭐ 더미 데이터 대신 실제 API 호출
          const data: FollowingApiResponse["data"] | null = await fetchMyFollowing(myUserId); 
          
          if (data) {
            const mappedFollowing: FollowingType[] = data.map(followedUser => ({
              id: String(followedUser.userId), 
              nickname: followedUser.nickname,
              // API 명세에 profileImageUrl이 없으므로, 더미 이미지 또는 닉네임 첫 글자로 대체
              profileImageUrl: followedUser.profileImageUrl || `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${followedUser.nickname.substring(0,1)}`, 
              isFollowing: followedUser.follow, // API에서 제공하는 follow 필드를 isFollowing으로 매핑
            }));
            setFollowing(mappedFollowing);
          } else {
            setFollowing([]);
          }
        } catch (err: any) {
          console.error("팔로잉 데이터 불러오기 실패:", err);
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            console.log("401 Unauthorized: Access token invalid or expired. Redirecting to login.");
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
    }, [fetchMyFollowing, myUserId, navigate]); 

    const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
      try {
        if (isCurrentlyFollowing) { // 팔로잉 중이라면 -> 언팔로우
          await unfollowUser(targetUserId); 
          console.log(`User ${targetUserId} 언팔로우 성공`);
          // UI 업데이트: 언팔로우 시 목록에서 제거
          setFollowing(prevFollowing => 
            prevFollowing.filter(user => user.id !== targetUserId) 
          );
        } else {
          // 팔로잉 페이지에서는 기본적으로 모두 isFollowing이 true이므로, 이 블록은 실행되지 않을 것임.
          // 하지만 혹시 모를 경우를 대비하여 (예: 다른 페이지에서 팔로우 후 상태 업데이트) 넣어둠.
          await followUser(targetUserId);
          console.log(`User ${targetUserId} 팔로우 성공`);
          setFollowing(prevFollowing =>
              prevFollowing.map(u => u.id === targetUserId ? { ...u, isFollowing: true } : u)
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
            <PageTitle>팔로잉</PageTitle> 
          </PageHeader>
          {loading ? (
            <EmptyState>팔로잉 목록을 불러오는 중...</EmptyState>
          ) : error ? (
            <EmptyState>오류 발생: {error}</EmptyState>
          ) : following.length > 0 ? (
            <UserList>
              {following.map((followedUser) => (
                <UserListItem
                  key={followedUser.id}
                  user={followedUser}
                  onFollowToggle={handleFollowToggle}
                  type="following" 
                />
              ))}
            </UserList>
          ) : (
            <EmptyState>아직 팔로잉하는 사용자가 없습니다.</EmptyState> 
          )}
        </SectionWrapper>
      </PageContainer>
    );
  };

  export default MyFollowingPage;