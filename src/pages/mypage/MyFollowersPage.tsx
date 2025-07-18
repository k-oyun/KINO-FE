import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UserListItem from '../../components/mypage/UserListItem';
import VideoBackground from '../../components/VideoBackground';


const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px; /* HeaderSelector 높이에 따라 조정 */
  background-color: transparent;
  min-height: calc(100vh - 60px);
  color: #f0f0f0;

  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px; /* 모바일에서 조정 */
  }
`;

const SectionWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

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

interface FollowerType {
  id: string;
  nickname: string;
  profileImageUrl: string;
  isFollowing: boolean;
}

const DUMMY_FOLLOWERS: FollowerType[] = [
  {
    id: 'user1', nickname: '영화광_김씨', profileImageUrl: 'https://via.placeholder.com/50/FF69B4/FFFFFF?text=김씨',
    isFollowing: false
  },
  {
    id: 'user2', nickname: '무비매니아_이', profileImageUrl: 'https://via.placeholder.com/50/3498DB/FFFFFF?text=이씨',
    isFollowing: false
  },

  { id: 'user3', isFollowing: false, nickname: '리뷰어_박', profileImageUrl: 'https://via.placeholder.com/50/2ECC71/FFFFFF?text=박씨' },
  { id: 'user4', isFollowing: false, nickname: '시네필_최', profileImageUrl: 'https://via.placeholder.com/50/E74C3C/FFFFFF?text=최씨' },
  { id: 'user5',isFollowing: false, nickname: '영화친구_정', profileImageUrl: 'https://via.placeholder.com/50/9B59B6/FFFFFF?text=정씨' },
  { id: 'user3',isFollowing: false, nickname: '리뷰어_박', profileImageUrl: 'https://via.placeholder.com/50/2ECC71/FFFFFF?text=박씨' },
  { id: 'user4',isFollowing: false, nickname: '시네필_최', profileImageUrl: 'https://via.placeholder.com/50/E74C3C/FFFFFF?text=최씨' },
  { id: 'user5',isFollowing: false, nickname: '영화친구_정', profileImageUrl: 'https://via.placeholder.com/50/9B59B6/FFFFFF?text=정씨' },
  { id: 'user6',isFollowing: false, nickname: '봉준호감독님팬', profileImageUrl: 'https://via.placeholder.com/50/FFC0CB/FFFFFF?text=봉팬' },
  { id: 'user7',isFollowing: false, nickname: '영화사랑_홍', profileImageUrl: 'https://via.placeholder.com/50/F1C40F/FFFFFF?text=홍씨' },
  { id: 'user8',isFollowing: false, nickname: '무비러버_김', profileImageUrl: 'https://via.placeholder.com/50/1ABC9C/FFFFFF?text=김씨' },
  { id: 'user9',isFollowing: false, nickname: '영화토크_이', profileImageUrl: 'https://via.placeholder.com/50/34495E/FFFFFF?text=이씨' },
  { id: 'user10',isFollowing: false, nickname: '시네마틱_박', profileImageUrl: 'https://via.placeholder.com/50/8E44AD/FFFFFF?text=박씨' },
  { id: 'user11',isFollowing: false, nickname: '영화덕후_수지', profileImageUrl: 'https://via.placeholder.com/50/ADD8E6/FFFFFF?text=수지' },
  { id: 'user12',isFollowing: false, nickname: '영화리뷰어_지수', profileImageUrl: 'https://via.placeholder.com/50/90EE90/FFFFFF?text=지수' },
  { id: 'user13',isFollowing: false, nickname: '영화사랑_민수', profileImageUrl: 'https://via.placeholder.com/50/FFB6C1/FFFFFF?text=민수' },
  { id: 'user14',isFollowing: false, nickname: '영화평론가_준호', profileImageUrl: 'https://via.placeholder.com/50/FF6347/FFFFFF?text=준호' },
  { id: 'user15',isFollowing: false, nickname: '영화감상_하늘', profileImageUrl: 'https://via.placeholder.com/50/FF4500/FFFFFF?text=하늘' },
  { id: 'user16',isFollowing: false, nickname: '영화광_지민', profileImageUrl: 'https://via.placeholder.com/50/FFD700/FFFFFF?text=지민' },
  { id: 'user17',isFollowing: false, nickname: '영화팬_서연', profileImageUrl: 'https://via.placeholder.com/50/FF69B4/FFFFFF?text=서연' },
];


const MyFollowersPage: React.FC = () => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<FollowerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);
      try {
        // ⭐ 실제 API 호출 로직을 여기에 작성하세요.
        // 예시:
        // const response = await fetch('/api/mypage/followers', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}` // 인증 토큰이 필요하다면
        //   }
        // });
        // if (!response.ok) {
        //   throw new Error('팔로워 목록을 불러오는데 실패했습니다.');
        // }
        // const data = await response.json();
        // setFollowers(data.followers); // 실제 응답 구조에 맞게 수정

        // 더미 데이터 사용 (API 연동 전 테스트용)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 효과를 위한 딜레이
        setFollowers(DUMMY_FOLLOWERS);
      } catch (err: any) {
        console.error("Failed to fetch followers:", err);
        setError(err.message || "팔로워 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행됨

  // 이 함수는 각 UserListItem의 팔로우 버튼 클릭 시 호출됩니다.
  // 실제 백엔드 연동 시 여기에 팔로우/언팔로우 API 호출 로직을 구현합니다.
  const handleFollowToggle = (userId: string, isCurrentlyFollowing: boolean) => {
    console.log(`User ${userId}를 ${isCurrentlyFollowing ? '언팔로우' : '팔로우'} 합니다.`);
    // ⭐ 여기에 팔로우/언팔로우 API 호출 로직 추가 (예: axios.post(`/api/users/${userId}/follow`))

    // API 호출 성공 시 UI 업데이트
    setFollowers(prevFollowers =>
      prevFollowers.filter(follower => follower.id !== userId) // 간단한 예시: 언팔로우 시 목록에서 제거
      // 실제로는 팔로우/언팔로우 API 호출 후 응답에 따라 상태를 업데이트하거나, 전체 목록을 다시 불러오는 것이 더 안정적입니다.
    );
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
          <PageTitle>팔로워</PageTitle>
        </PageHeader>
        {loading ? (
          <EmptyState>팔로워 목록을 불러오는 중...</EmptyState>
        ) : error ? (
          <EmptyState>오류 발생: {error}</EmptyState>
        ) : followers.length > 0 ? (
          <UserList>
            {followers.map((follower) => (
              <UserListItem
                key={follower.id}
                user={follower}
                onFollowToggle={handleFollowToggle}
                 type="follower" 
              />
            ))}
          </UserList>
        ) : (
          <EmptyState>아직 팔로워가 없습니다.</EmptyState>
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyFollowersPage;