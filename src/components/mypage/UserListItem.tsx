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
  // 이 부분을 수정해야 합니다.
  // 기존: onFollowToggle?: (userId: string, isCurrentlyFollowing: boolean) => void;
  // 변경: nickname 인자 추가 및 Promise<void> 반환 타입 지정
  onFollowToggle?: (userId: string, isCurrentlyFollowing: boolean, nickname: string) => Promise<void>;
  type: 'follower' | 'following' | 'searchResult';
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
  const currentIsFollowingStatus = user.isFollowing ?? (type === 'following');

  const handleUserClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (UserInfo의 onClick이 호출되지 않도록)
    if (onFollowToggle) {
      // 닉네임을 세 번째 인자로 전달
      onFollowToggle(user.id, currentIsFollowingStatus, user.nickname);
    }
  };

  // 'searchResult' 타입일 때도 팔로우/언팔로우 버튼을 보여주려면 이 조건이 필요합니다.
  // 'follower' 타입은 팔로우 해제만, 'following' 타입은 팔로잉 중인 것을 나타냄.
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