import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

interface UserProfile {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

const UserProfileSectionWrapper = styled.section`
  background-color: #000000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // background-image: url('/src/assets/img/matrix_background.jpg'); /* 현재 경로 유지 */
  // background-size: cover;
  // background-position: center;
  // background-repeat: no-repeat;

  &::before {
    content: '';
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

interface UserProfileSectionProps {
  userProfile: UserProfile;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
    <UserProfileSectionWrapper>
      <LeftButtonsContainer>
        <IconButton onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </IconButton>
      </LeftButtonsContainer>
      <ButtonsContainer>
        <TagButton onClick={() => navigate('/mypage/tags')}>태그</TagButton>
        <IconButton onClick={() => navigate('/mypage/settings')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0007 14.2427C13.2435 14.2427 14.2427 13.2435 14.2427 12.0007C14.2427 10.7578 13.2435 9.75867 12.0007 9.75867C10.7578 9.75867 9.75867 10.7578 9.75867 12.0007C9.75867 13.2435 10.7578 14.2427 12.0007 14.2427Z" fill="currentColor"/>
            <path d="M22.25 11.25V12.75C22.25 13.1642 21.9142 13.5 21.5 13.5H19.7997C19.4673 14.5422 18.9161 15.5028 18.1772 16.3409L19.4199 17.5837C19.7032 17.8669 19.7032 18.3323 19.4199 18.6155L18.6155 19.4199C18.3323 19.7032 17.8669 19.7032 17.5837 19.4199L16.3409 18.1772C15.5028 18.9161 14.5422 19.4673 13.5 19.7997V21.5C13.5 21.9142 13.1642 22.25 12.75 22.25H11.25C10.8358 22.25 10.5 21.9142 10.5 21.5V19.7997C9.4578 19.4673 8.49723 18.9161 7.65911 18.1772L6.41635 19.4199C6.13311 19.7032 5.66768 19.7032 5.38444 19.4199L4.58006 18.6155C4.29681 18.3323 4.29681 17.8669 4.58006 17.5837L5.82282 16.3409C5.08394 15.5028 4.53272 14.5422 4.20033 13.5H2.5C2.08579 13.5 1.75 13.1642 1.75 12.75V11.25C1.75 10.8358 2.08579 10.5 2.5 10.5H4.20033C4.53272 9.4578 5.08394 8.49723 5.82282 7.65911L4.58006 6.41635C4.29681 6.13311 4.29681 5.66768 4.58006 5.38444L5.38444 4.58006C5.66768 4.29681 6.13311 4.29681 6.41635 4.58006L7.65911 5.82282C8.49723 5.08394 9.4578 4.53272 10.5 4.20033V2.5C10.5 2.08579 10.8358 1.75 11.25 1.75H12.75C13.1642 1.75 13.5 2.08579 13.5 2.5V4.20033C14.5422 4.53272 15.5028 5.08394 16.3409 5.82282L17.5837 4.58006C17.8669 4.29681 18.3323 4.29681 18.6155 4.58006L19.4199 5.38444C19.7032 5.66768 19.7032 6.13311 19.4199 6.41635L18.1772 7.65911C18.9161 8.49723 19.4673 9.4578 19.7997 10.5H21.5C21.9142 10.5 22.25 10.8358 22.25 11.25Z" fill="currentColor"/>
          </svg>
        </IconButton>
      </ButtonsContainer>
      <ProfileContent>
        <ProfileImageWrapper>
          <ProfileImage src={userProfile.profileImageUrl} alt={`${userProfile.nickname} 프로필 이미지`} />
        </ProfileImageWrapper>
        <Nickname>{userProfile.nickname}</Nickname>
        <FollowStats>팔로워 {userProfile.followerCount} | 팔로잉 {userProfile.followingCount}</FollowStats>
      </ProfileContent>
    </UserProfileSectionWrapper>
  );
};

export default UserProfileSection;