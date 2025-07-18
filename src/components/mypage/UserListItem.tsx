import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface UserListItemProps {
  user: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    isFollowing?: boolean;
  };
  onFollowToggle?: (userId: string, isCurrentlyFollowing: boolean) => void; // 팔로우/언팔로우 액션 콜백
  // 'follower': 팔로워 목록에서 사용 (팔로우/언팔로우 버튼 필요)
  // 'following': 팔로잉 목록에서 사용 (언팔로우 버튼만 필요)
  type: 'follower' | 'following' | 'searchResult'; // 추가 시나리오 고려
}

const UserItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2a2a2a;
  }

  @media (max-width: 767px) {
    padding: 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const Nickname = styled.span`
  font-size: 1.1em;
  font-weight: bold;
  color: #f0f0f0;

  @media (max-width: 767px) {
    font-size: 1em;
  }
`;

const FollowButton = styled.button<{ $isFollowing: boolean }>` 
  background-color: ${props => (props.$isFollowing ? '#555' : '#ff69b4')};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => (props.$isFollowing ? '#777' : '#e0509a')};
  }

  @media (max-width: 767px) {
    padding: 6px 12px;
    font-size: 0.8em;
  }
`;

const UserListItem: React.FC<UserListItemProps> = ({ user, onFollowToggle, type }) => {
  const navigate = useNavigate();

  // user.isFollowing의 기본값 설정. 팔로잉 목록이라면 기본적으로 true로 간주
  const currentIsFollowingStatus = user.isFollowing ?? (type === 'following');

  const handleUserClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소 (UserItemContainer)의 클릭 이벤트 방지
    if (onFollowToggle) {
      onFollowToggle(user.id, currentIsFollowingStatus);
    }
  };

  // type에 따라 버튼을 렌더링할지 결정
  // 'follower' 또는 'searchResult'에서는 팔로우/언팔로우 버튼이 필요
  // 'following'에서는 언팔로우 버튼만 필요 (만약 텍스트만 '팔로잉'으로 보여주고 싶다면 조건 변경)
  const shouldShowFollowButton = onFollowToggle && (type === 'follower' || type === 'following' || type === 'searchResult');

  return (
    <UserItemContainer>
      <UserInfo onClick={handleUserClick}>
        <ProfileImage src={user.profileImageUrl} alt={user.nickname} />
        <Nickname>{user.nickname}</Nickname>
      </UserInfo>
      {shouldShowFollowButton && (
        <FollowButton
          $isFollowing={currentIsFollowingStatus}
          onClick={handleFollowButtonClick}
        >
          {type === 'following' ? '팔로잉' : (currentIsFollowingStatus ? '팔로잉' : '팔로우')}
        </FollowButton>
      )}
    </UserItemContainer>
  );
};

export default UserListItem;