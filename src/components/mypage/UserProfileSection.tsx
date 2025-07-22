import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosSettings } from "react-icons/io";

interface UserProfileType {
  userId: number;
  nickname: string;
  image: string;
  email: string;
  isFirstLogin: boolean;
}

interface Follow {
  follower: number;
  following: number;
}

interface UserProfileSectionProps {
  userProfile: UserProfileType;
  follow: Follow;
  isOwner: boolean; // 본인 여부
}

const UserProfileSectionWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  text-align: center;
`;

const ProfileImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
  margin-bottom: 15px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Nickname = styled.h2`
  color: #f0f0f0;
  margin: 0;
  font-size: 2em;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;

const FollowStats = styled.p`
  color: #e0e0e0;
  font-size: 1.1em;
  margin: 5px 0 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;
const FollowItem = styled.span`
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #ff69b4;
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 3;
`;

const LeftButtonsContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 3;
`;

const BaseIconButton = styled.button`
  background: none;
  border: none;
  color: #f0f0f0;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #aaa;
  }

  svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
`;

const IconButton = styled(BaseIconButton)`
  font-size: 1.5em;
`;

const TagButton = styled(BaseIconButton)`
  font-size: 0.9em;
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  white-space: nowrap;
  color: #f0f0f0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
  }
`;

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ userProfile, follow, isOwner }) => {
  const navigate = useNavigate();

  const handleFollowerClick = () => navigate("/mypage/followers");
  const handleFollowingClick = () => navigate("/mypage/following");

  return (
    <UserProfileSectionWrapper>
      <LeftButtonsContainer>
        <IconButton onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </IconButton>
      </LeftButtonsContainer>

      {isOwner && (
        <ButtonsContainer>
          <TagButton onClick={() => navigate("/mypage/tags")}>태그</TagButton>
          <IconButton onClick={() => navigate("/mypage/settings")}>
            <IoIosSettings />
          </IconButton>
        </ButtonsContainer>
      )}

      <ProfileContent>
        <ProfileImageWrapper>
          <ProfileImage
            src={userProfile.image}
            alt={`${userProfile.nickname} 프로필 이미지`}
          />
        </ProfileImageWrapper>
        <Nickname>{userProfile.nickname}</Nickname>
        <FollowStats>
          <FollowItem onClick={handleFollowerClick}>
            팔로워 {follow.follower}
          </FollowItem>
          <span> | </span>
          <FollowItem onClick={handleFollowingClick}>
            팔로잉 {follow.following}
          </FollowItem>
        </FollowStats>
      </ProfileContent>
    </UserProfileSectionWrapper>
  );
};

export default UserProfileSection;
