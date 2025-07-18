import React from 'react';
import styled from 'styled-components';
import SettingForm from '../../components/mypage/SettingForm';
import UserProfileSection from '../../components/mypage/UserProfileSection';
import VideoBackground from '../../components/VideoBackground';

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

const DUMMY_USER_PROFILE: UserProfileType = {
  nickname: 'Nick_name',
  profileImageUrl: 'https://via.placeholder.com/100/3498db/ffffff?text=User',
  followerCount: 123,
  followingCount: 45,
};

const PageContainer = styled.div`
  max-width: 1200px; 
  margin: 0 auto;
  padding-top: 300px; 
  background-color: transparent; 
  min-height: calc(100vh - 60px);
  // max-height: 100vh;
  color: #f0f0f0;

  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
`;

const SectionWrapper = styled.section`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px; 

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    padding: 20px;
  }
`;

const MySettingsPage: React.FC = () => {
  const userProfile: UserProfileType = DUMMY_USER_PROFILE; 

  return (
    <PageContainer>
    <VideoBackground /> 
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper>
        <SettingForm initialUserProfile={userProfile} />
      </SectionWrapper>
    </PageContainer>
  );
};

export default MySettingsPage;