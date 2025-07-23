import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosSettings } from "react-icons/io";
import useFollowApi from "../../api/follow";
import { useMediaQuery } from "react-responsive";
import DefaultProfileImg from "../../assets/img/profileIcon.png";
import { useTranslation } from "react-i18next"; // useTranslation 임포트

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
  const { t } = useTranslation(); // useTranslation 훅 사용

  useEffect(() => {
    // console.log(follow); // This console.log should also be reviewed for production
    try {
      // 팔로우 상태 확인
      if (!isOwner) {
        const checkFollowStatus = async () => {
          try {
            const res = await getIsFollowed(userProfile.userId);
            setIsFollowed(res.data.data.following);
            // console.log("팔로우 상태:", res.data.data.following); // This console.log should also be reviewed for production
          } catch (error) {
            console.error(t("errorFetchingFollowStatus"), error);
          }
        };
        checkFollowStatus();
      }
    } catch (error) {
      console.error(t("errorCheckingFollowStatus"), error);
    }
  }, [getIsFollowed, isOwner, userProfile.userId, t]); // t를 의존성 배열에 추가

  const handleFollowerClick = () => navigate(`followers`);
  const handleFollowingClick = () =>
    navigate(`/mypage/following/${userProfile.userId}`);

  const handleFollow = async () => { // async/await 사용
    // console.log(`팔로우: ${userProfile.nickname}`); // This console.log should also be reviewed for production
    try {
      if (isFollowed) {
        // 팔로우 취소
        await deleteFollow(userProfile.userId); // await 사용
        setIsFollowed(false);
        setFollowerCount(prev => prev - 1); // 함수형 업데이트
      } else {
        // 팔로우
        await postFollow(userProfile.userId); // await 사용
        setIsFollowed(true);
        setFollowerCount(prev => prev + 1); // 함수형 업데이트
      }
    } catch (error) {
      console.error(t("errorTogglingFollowStatus"), error);
      // 사용자에게 오류 알림 (예: 토스트 메시지)
      // alert(t("errorTogglingFollowStatusGeneric")); // 필요하다면 일반적인 오류 메시지 추가
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
          <TagButton onClick={() => navigate("/mypage/tags")}>
            {t("userProfileSection.tagButton")}
          </TagButton>
          <IconButton onClick={() => navigate("/mypage/settings")}>
            <IoIosSettings />
          </IconButton>
        </ButtonsContainer>
      )}

      <ProfileContent>
        <ProfileImageWrapper $ismobile={isMobile}>
          <ProfileImage
            $ismobile={isMobile}
            src={userProfile.image || DefaultProfileImg}
            alt={t("userProfileSection.profileImageAlt", {
              nickname: userProfile.nickname,
            })}
          />
        </ProfileImageWrapper>
        <Nickname $ismobile={isMobile}>{userProfile.nickname}</Nickname>
        <FollowStats>
          <FollowItem onClick={handleFollowerClick} $ismobile={isMobile}>
            {t("userProfileSection.followerCount", { count: followerCount })}
          </FollowItem>
          <span> {t("userProfileSection.separator")} </span>
          <FollowItem onClick={handleFollowingClick} $ismobile={isMobile}>
            {t("userProfileSection.followingCount", {
              count: follow.following,
            })}
          </FollowItem>
          {!isOwner && (
            <FollowButton
              onClick={handleFollow}
              $isFollowed={isFollowed}
              $ismobile={isMobile}
            >
              {isFollowed ? t("unfollow") : t("follow")}
            </FollowButton>
          )}{" "}
        </FollowStats>
      </ProfileContent>
    </UserProfileSectionWrapper>
  );
};

export default UserProfileSection;