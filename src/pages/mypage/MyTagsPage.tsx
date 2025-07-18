import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TagSelectionForm from '../../components/mypage/TagSelectionForm';
import UserProfileSection from '../../components/mypage/UserProfileSection';
import VideoBackground from '../../components/VideoBackground';
import useMyPageApi from '../../api/useMyPageApi';

export interface UserGenresApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    nickname: string;
    followers: number;
    following: number;
    userGenres: Array<{
      userGenreId: number;
      genreName: string;
    }>;
  };
}

interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

export interface GenreType {
  userGenreId: number;
  genreName: string;
}

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

const LoadingMessage = styled.div`
  color: #f0f0f0;
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
`;

const MyTagsPage: React.FC = () => {
  const { fetchMyPageMainData, fetchUserGenres, saveUserGenres } = useMyPageApi();

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileData = await fetchMyPageMainData();
        if (profileData) {
          setUserProfile({
            nickname: profileData.nickname,
            profileImageUrl: profileData.image || `https://via.placeholder.com/100/3498db/ffffff?text=${profileData.nickname.substring(0,1)}`, // API 명세에 'image' 필드가 있다면 사용, 없으면 더미
            followerCount: profileData.followers,
            followingCount: profileData.following,
          });
        } else {
            setError("사용자 프로필 정보를 불러오는 데 실패했습니다.");
            return;
        }

        const genresData = await fetchUserGenres();
        if (genresData && genresData.userGenres) {
          setSelectedGenres(genresData.userGenres.map(genre => genre.genreName));
        } else {
          setSelectedGenres([]);
        }

      } catch (err: any) {
        console.error("MyTagsPage 데이터 불러오기 실패:", err);
        if (axios.isAxiosError(err)) {
          setError(`데이터를 불러오는 데 실패했습니다: ${err.message || "알 수 없는 오류"}`);
        } else {
          setError("데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchMyPageMainData, fetchUserGenres]);

  const handleSaveTags = async (genresToSave: string[]) => {
    try {
      const success = await saveUserGenres(genresToSave);
      if (success) {
        alert("태그가 성공적으로 저장되었습니다!");
        setSelectedGenres(genresToSave);
      } else {
        alert("태그 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("태그 저장 중 오류 발생:", err);
      alert("태그 저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <VideoBackground />
        <SectionWrapper>
          <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
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
          <LoadingMessage>사용자 프로필을 불러오는 중...</LoadingMessage>
        </SectionWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <VideoBackground />
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper>
        <TagSelectionForm
          username={userProfile.nickname}
          initialSelectedGenres={selectedGenres}
          onSaveTags={handleSaveTags}
        />
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyTagsPage;