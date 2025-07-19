import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import TagSelectionForm from "../../components/mypage/TagSelectionForm";
import UserProfileSection from "../../components/mypage/UserProfileSection";

// --- 백엔드 API 응답 구조에 맞는 타입 정의 ---

// GET /api/mypage/userGenres 응답의 userGenres 배열 내 객체 타입
interface ApiUserGenre {
  userGenreId: number;
  genreName: string;
}

// GET /api/mypage/userGenres 응답의 data 필드 타입
interface MyTagsPageApiResponseData {
  nickname: string;
  profileImageUrl: string; // API 명세에 명시되어 있다면 필수, 아니라면 ?로 optional 처리
  followers: number;
  following: number;
  userGenres: ApiUserGenre[];
}

// GET /api/mypage/userGenres 전체 응답 타입
interface MyTagsPageApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: MyTagsPageApiResponseData;
}

// POST /api/mypage/userGenres 요청 본문 타입
interface UpdateGenresRequestBody {
  genreIds: number[];
}

// POST /api/mypage/userGenres 응답 타입
interface UpdateGenresApiResponse {
  status: number;
  success: boolean;
  message: string;
  // data 필드는 없을 수도 있습니다. 있다면 그에 맞게 정의
}

// --- 컴포넌트들이 사용하는 타입 정의 (매핑 후의 최종 형태) ---
interface UserProfileType {
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

// --- 스타일 컴포넌트들은 변경 없음 ---
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 300px;
  background-color: transparent;
  max-height: 100vh;
  color: #f0f0f0;

  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    padding: 20px 15px;
    padding-top: 80px;
  }
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
  background-color: #000000;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    padding: 20px;
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

const MyTagsPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]); // 사용자가 현재 선택한 장르 ID 목록
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // 태그 업데이트 중 상태
  const [updateError, setUpdateError] = useState<string | null>(null); // 태그 업데이트 에러

  // 1. 사용자 프로필 및 선택된 장르 데이터를 불러오는 함수
  const fetchUserAndGenreData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<MyTagsPageApiResponse>(
        `http://43.203.218.183:8080/api/mypage/userGenres`
      );
      const apiData = response.data.data;

      // UserProfileSection에 전달할 프로필 데이터 설정
      setUserProfile({
        nickname: apiData.nickname,
        profileImageUrl:
          apiData.profileImageUrl ||
          "https://via.placeholder.com/100/3498db/ffffff?text=User", // profileImageUrl이 없을 경우 기본값
        followerCount: apiData.followers,
        followingCount: apiData.following,
      });

      // 선택된 장르 ID 목록 설정
      const currentSelectedIds = apiData.userGenres.map(
        (genre) => genre.userGenreId
      );
      setSelectedGenreIds(currentSelectedIds);
    } catch (err) {
      console.error(
        "사용자 프로필 및 장르 데이터를 불러오는 데 실패했습니다:",
        err
      );
      setError("정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback 의존성 배열 비움

  // 2. 장르 업데이트를 서버에 요청하는 함수
  const handleGenreUpdate = useCallback(async (newGenreIds: number[]) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const requestBody: UpdateGenresRequestBody = {
        genreIds: newGenreIds,
      };
      const response = await axios.post<UpdateGenresApiResponse>(
        `http://43.203.218.183:8080/api/mypage/userGenres`,
        requestBody
      );

      // API 응답의 success 필드를 확인하여 성공 여부 판단
      if (response.data.success) {
        setSelectedGenreIds(newGenreIds); // 성공 시 UI 상태 업데이트
        alert("장르 설정이 성공적으로 저장되었습니다.");
      } else {
        setUpdateError(
          response.data.message || "장르 설정 저장에 실패했습니다."
        );
        alert(
          "장르 설정 저장에 실패했습니다: " +
            (response.data.message || "알 수 없는 오류")
        );
      }
    } catch (err) {
      console.error("장르 업데이트에 실패했습니다:", err);
      setUpdateError("장르 설정 저장에 실패했습니다. 다시 시도해주세요.");
      alert("장르 설정 저장에 실패했습니다."); // 사용자에게 알림
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndGenreData();
  }, [fetchUserAndGenreData]); // fetchUserAndGenreData가 변경될 때마다 실행 (useCallback으로 메모이제이션)

  if (isLoading) {
    return (
      <PageContainer>
        <EmptyState>프로필 및 장르 데이터를 불러오는 중입니다...</EmptyState>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState style={{ color: "red" }}>{error}</EmptyState>
      </PageContainer>
    );
  }

  if (!userProfile) {
    return (
      <PageContainer>
        <EmptyState>프로필 정보를 찾을 수 없습니다.</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <UserProfileSection userProfile={userProfile} />
      <SectionWrapper>
        <TagSelectionForm
          // username={userProfile.nickname}
          initialSelectedGenreIds={selectedGenreIds} // 현재 선택된 장르 ID 목록 전달
          onSave={handleGenreUpdate} // 저장 버튼 클릭 시 호출될 콜백 함수 전달
          isSaving={isUpdating} // 저장 중 상태 전달
          saveError={updateError} // 저장 에러 메시지 전달
        />
      </SectionWrapper>
    </PageContainer>
  );
};

export default MyTagsPage;
