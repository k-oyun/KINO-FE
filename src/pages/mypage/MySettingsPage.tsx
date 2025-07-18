// src/pages/mypage/MySettingsPage.tsx

import React, { useState, useEffect } from 'react'; // useState, useEffect 훅 임포트
import styled from 'styled-components';
import axios from 'axios'; // axios 에러 처리를 위해 임포트
import SettingForm from '../../components/mypage/SettingForm';
import UserProfileSection from '../../components/mypage/UserProfileSection';
import VideoBackground from '../../components/VideoBackground';
import useMyPageApi from '../../api/useMyPageApi'; // useMyPageApi 훅 임포트

// UserProfileType 정의 (API 응답 타입과 일치해야 함)
interface UserProfileType {
  nickname: string;
  profileImageUrl: string; // 실제 API에서는 'image' 필드명일 수 있으니 주의
  followerCount: number;
  followingCount: number;
}

// ⭐ 더미 프로필은 API 연동 후에는 삭제하거나 개발 목적으로만 사용합니다.
// 현재는 로딩 중이나 에러 발생 시의 폴백(fallback)으로 사용할 수 있습니다.
const FALLBACK_USER_PROFILE: UserProfileType = {
  nickname: '사용자',
  profileImageUrl: 'https://via.placeholder.com/100/CCCCCC/FFFFFF?text=USER', // 깨지지 않는 더미 이미지 URL로 변경
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

// 로딩 및 에러 메시지 스타일 추가
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
  // useMyPageApi 훅에서 프로필 데이터를 가져오는 함수 사용
  const { fetchMyPageMainData } = useMyPageApi();

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 사용자 프로필 데이터 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyPageMainData(); // API 호출
        if (data) {
          // fetchMyPageMainData의 반환 타입 (image_3dd761.png)에 따라 매핑
          setUserProfile({
            nickname: data.nickname,
            profileImageUrl: data.image || FALLBACK_USER_PROFILE.profileImageUrl, // 'image' 필드가 없으면 폴백 이미지 사용
            followerCount: data.followers,
            followingCount: data.following,
          });
        } else {
          // 데이터는 받았지만 내용이 null이거나 비어있을 경우
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
  }, [fetchMyPageMainData]); // fetchMyPageMainData 함수가 변경될 때마다 useEffect 재실행

  // SettingForm에서 프로필 업데이트 시 호출될 콜백 함수
  const handleProfileUpdate = (updatedProfile: UserProfileType) => {
    setUserProfile(updatedProfile); // MySettingsPage의 userProfile 상태 업데이트
  };

  // 로딩 상태 표시
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

  // 에러 상태 표시
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

  // userProfile이 아직 null인 경우 (로딩/에러가 아니지만 데이터가 없는 경우)
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
      {/* 실제 userProfile 데이터를 UserProfileSection에 전달 */}
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper>
        {/* 실제 userProfile 데이터와 업데이트 콜백 함수를 SettingForm에 전달 */}
        <SettingForm initialUserProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
      </SectionWrapper>
    </PageContainer>
  );
};

export default MySettingsPage;