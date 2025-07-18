import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; 
import SettingForm from '../../components/mypage/SettingForm';
import UserProfileSection from '../../components/mypage/UserProfileSection';
import VideoBackground from '../../components/VideoBackground';
import useMyPageApi from '../../api/useMyPageApi'; 

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

const FALLBACK_USER_PROFILE: UserProfileType = {
  nickname: '사용자',
  profileImageUrl: 'https://via.placeholder.com/100/CCCCCC/FFFFFF?text=USER',
  followerCount: 0,
  followingCount: 0,
};

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

const StatusMessage = styled.div`
  color: #f0f0f0;
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
`;

const ErrorMessage = styled(StatusMessage)`
  color: #ff6b6b; // 에러 메시지는 붉은색
`;

const MySettingsPage: React.FC = () => {
  const { fetchMyPageMainData } = useMyPageApi();

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyPageMainData();
        if (data) {
          setUserProfile({
            nickname: data.nickname,
            profileImageUrl: data.image || FALLBACK_USER_PROFILE.profileImageUrl,
            followerCount: data.followers,
            followingCount: data.following,
          });
        } else {
          setError("프로필 데이터를 불러오지 못했습니다. 서버 응답이 비어있습니다.");
        }
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        if (axios.isAxiosError(err)) {
          setError(`프로필 정보를 불러오는 데 실패했습니다: ${err.response?.data?.message || err.message}`);
        } else {
          setError("프로필 정보를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [fetchMyPageMainData]);

  const handleProfileUpdate = (updatedProfile: UserProfileType) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <PageContainer>
        <VideoBackground />
        <SectionWrapper>
          <StatusMessage>프로필 정보를 불러오는 중...</StatusMessage>
        </SectionWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <VideoBackground />
        <SectionWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </SectionWrapper>
      </PageContainer>
    );
  }

  if (!userProfile) {
    return (
      <PageContainer>
        <VideoBackground />
        <SectionWrapper>
          <ErrorMessage>프로필 정보를 불러올 수 없습니다. 다시 시도해주세요.</ErrorMessage>
        </SectionWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground />
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper>
        <SettingForm initialUserProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
      </SectionWrapper>
    </PageContainer>
  );
};

export default MySettingsPage;