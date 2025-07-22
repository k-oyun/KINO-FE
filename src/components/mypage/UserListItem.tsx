import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface UserListItemUser {
  id: string;
  nickname: string;
  profileImageUrl: string;
  isFollowing?: boolean;
}

export interface UserListItemProps {
  user: UserListItemUser;
  onFollowToggle?: (
    userId: string,
    isCurrentlyFollowing: boolean,
    nickname: string
  ) => Promise<void>;

  type?: 'follower' | 'following' | 'searchResult';
  isMyAccount?: boolean;
  showFollowButton?: boolean;
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

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onFollowToggle,
  type = 'searchResult',
  isMyAccount = false,
  showFollowButton,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentIsFollowingStatus =
    user.isFollowing !== undefined ? user.isFollowing : type === 'following';

  const handleUserClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFollowToggle) {
      onFollowToggle(user.id, currentIsFollowingStatus, user.nickname);
    }
  };

  const computedShouldShowFollowButton = (() => {
    if (typeof showFollowButton === 'boolean') return showFollowButton;
    if (isMyAccount) return false;
    if (!onFollowToggle) return false;
    return type === 'follower' || type === 'following' || type === 'searchResult';
  })();

  const imgSrc =
    user.profileImageUrl ||
    `https://via.placeholder.com/50/CCCCCC/FFFFFF?text=${encodeURIComponent(
      user.nickname.substring(0, 1)
    )}`;

  return (
    <UserItemContainer>
      <UserInfo onClick={handleUserClick}>
        <ProfileImage src={imgSrc} alt={t('userListItem.profileImageAlt', { nickname: user.nickname })} />
        <Nickname>{user.nickname}</Nickname>
      </UserInfo>

      {computedShouldShowFollowButton && (
        <FollowButton
          $isFollowing={currentIsFollowingStatus}
          onClick={handleFollowButtonClick}
        >
          {currentIsFollowingStatus ? t('following') : t('follow')}
        </FollowButton>
      )}
    </UserItemContainer>
  );
};

export default UserListItem;