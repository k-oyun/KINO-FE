import React, { useState, useEffect } from 'react'; // useEffect, useState 임포트
import styled from 'styled-components';
import axios from 'axios'; // axios 임포트
import SettingForm from '../../components/mypage/SettingForm';
import UserProfileSection from '../../components/mypage/UserProfileSection';

// --- 백엔드 API 응답 구조에 맞는 타입 정의 ---
// MyPage 메인에서 사용자 프로필 정보를 가져오는 API (가정: GET /api/mypage/profile)
interface ApiUserProfile {
    nickname: string;
    profileImageUrl: string;
    followerCount: number;
    followingCount: number;
    // 필요한 경우 추가적인 사용자 설정 관련 필드 추가
    // email?: string;
    // phoneNumber?: string;
}

// 전체 API 응답 구조를 정의합니다.
interface UserProfileApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: ApiUserProfile; // 데이터 필드에 ApiUserProfile 객체가 직접 들어올 것으로 가정
}

// --- 컴포넌트들이 사용하는 타입 정의 (매핑 후의 최종 형태) ---
interface UserProfileType {
    nickname: string;
    profileImageUrl: string;
    followerCount: number;
    followingCount: number;
}

// --- 스타일 컴포넌트들은 변경 없음 (생략) ---
const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 300px;
    background-color: transparent;
    // min-height: calc(100vh - 60px); // 주석 처리 유지
    max-height: 100vh;
    color: #f0f0f0;

    display: flex;
    flex-direction: column;

    @media (max-width: 767px) {
        padding: 20px 15px;
        padding-top: 80px;
    }
`;

const SectionWrapper = styled.section`
    background-color: #000000;
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

const EmptyState = styled.div`
    color: #aaa;
    text-align: center;
    padding: 30px 0;
    font-size: 1.1em;

    @media (max-width: 767px) {
        padding: 20px 0;
        font-size: 1em;
    }
`;


const MySettingsPage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null); // 초기값을 null로 설정
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 사용자 프로필 데이터를 불러오는 함수
    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // MyPage 메인에서 사용하는 API와 동일한 프로필 정보를 가져오는 API를 가정합니다.
            // 엔드포인트는 /api/mypage/profile 로 가정합니다.
            const response = await axios.get<UserProfileApiResponse>(
                `http://43.203.218.183:8080/api/mypage/profile`
            );
            const apiData = response.data.data;

            setUserProfile({
                nickname: apiData.nickname,
                profileImageUrl: apiData.profileImageUrl,
                followerCount: apiData.followerCount,
                followingCount: apiData.followingCount,
            });
        } catch (err) {
            console.error("사용자 프로필 데이터를 불러오는 데 실패했습니다:", err);
            setError("프로필 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 사용자 프로필 데이터 호출
        fetchUserProfile();
    }, []); // 빈 의존성 배열: 컴포넌트가 처음 렌더링될 때 한 번만 실행

    if (isLoading) {
        return (
            <PageContainer>
                <EmptyState>프로필 데이터를 불러오는 중입니다...</EmptyState>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <EmptyState style={{ color: 'red' }}>{error}</EmptyState>
            </PageContainer>
        );
    }

    // userProfile이 null이 아닐 때만 하위 컴포넌트를 렌더링
    if (!userProfile) {
        return (
            <PageContainer>
                <EmptyState>프로필 정보를 찾을 수 없습니다.</EmptyState>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* UserProfileSection은 현재 UserProfileType을 받으므로 userProfile을 그대로 전달 */}
            <UserProfileSection userProfile={userProfile} />

            <SectionWrapper>
                {/* SettingForm은 initialUserProfile을 받으므로 userProfile을 그대로 전달 */}
                <SettingForm initialUserProfile={userProfile} />
            </SectionWrapper>
        </PageContainer>
    );
};

export default MySettingsPage;