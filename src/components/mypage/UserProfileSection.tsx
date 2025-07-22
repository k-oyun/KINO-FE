import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosSettings } from "react-icons/io";
import useFollowApi from "../../api/follow";
import { useMediaQuery } from "react-responsive";

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
  isOwner?: boolean; // 본인 여부
}

interface StyleType {
  $ismobile?: boolean;
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

const ProfileImageWrapper = styled.div<StyleType>`
  width: ${(props) => (props.$ismobile ? "70px" : "120px")};
  height: ${(props) => (props.$ismobile ? "70px" : "120px")};
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
  margin-bottom: 15px;
`;

const ProfileImage = styled.img<StyleType>`
  width: ${(props) => (props.$ismobile ? "70px" : "120px")};
  height: ${(props) => (props.$ismobile ? "70px" : "120px")};
  object-fit: cover;
  object-position: center;
`;

const Nickname = styled.h2<StyleType>`
  color: #f0f0f0;
  margin: 0;
  font-size: ${(props) => (props.$ismobile ? "1em" : "2em")};
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;

const FollowStats = styled.p`
  color: #e0e0e0;
  font-size: 1.1em;
  margin: 5px 0 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;
const FollowItem = styled.span<StyleType>`
  font-size: ${(props) => (props.$ismobile ? "0.7em" : "1em")};
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #ff69b4;
  }
`;

const FollowButton = styled.button<{ $isFollowed: boolean } & StyleType>`
  background-color: ${(props) => (props.$isFollowed ? "#fd6782" : "#aaa")};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 2px 5px;
  font-size: ${(props) => (props.$ismobile ? "0.6em" : "1em")};
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.$isFollowed ? "#aaa" : "#f73c63")};
    transform: scale(1.03);
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

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userProfile,
  follow,
  isOwner,
}) => {
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  const [followerCount, setFollowerCount] = useState(follow.follower);
  const { getIsFollowed, postFollow, deleteFollow } = useFollowApi();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    console.log(follow);
    try {
      // 팔로우 상태 확인
      if (!isOwner) {
        const res = getIsFollowed(userProfile.userId);
        res
          .then((data) => {
            setIsFollowed(data.data.data.following);
            console.log("팔로우 상태:", isFollowed);
          })
          .catch((error) => {
            console.error("Error fetching follow status:", error);
          });
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, []);

  const handleFollowerClick = () => navigate(`followers`);
  const handleFollowingClick = () =>
    navigate(`/mypage/following/${userProfile.userId}`);

  const handleFollow = () => {
    console.log(`팔로우: ${userProfile.nickname}`);
    try {
      if (isFollowed) {
        // 팔로우 취소
        const res = deleteFollow(userProfile.userId);
        res.then(() => {
          setIsFollowed(false);
          setFollowerCount(followerCount - 1);
        });
      } else {
        // 팔로우
        const res = postFollow(userProfile.userId);
        res.then(() => {
          setIsFollowed(true);
          setFollowerCount(followerCount + 1);
        });
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

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
        <ProfileImageWrapper $ismobile={isMobile}>
          <ProfileImage
            $ismobile={isMobile}
            src={userProfile.image}
            alt={`${userProfile.nickname} 프로필 이미지`}
          />
        </ProfileImageWrapper>
        <Nickname $ismobile={isMobile}>{userProfile.nickname}</Nickname>
        <FollowStats>
          <FollowItem onClick={handleFollowerClick} $ismobile={isMobile}>
            팔로워 {followerCount}
          </FollowItem>
          <span> | </span>
          <FollowItem onClick={handleFollowingClick} $ismobile={isMobile}>
            팔로잉 {follow.following}
          </FollowItem>
          {!isOwner && (
            <FollowButton
              onClick={handleFollow}
              $isFollowed={isFollowed}
              $ismobile={isMobile}
            >
              팔로우
            </FollowButton>
          )}{" "}
        </FollowStats>
      </ProfileContent>
    </UserProfileSectionWrapper>
  );
};

export default UserProfileSection;
