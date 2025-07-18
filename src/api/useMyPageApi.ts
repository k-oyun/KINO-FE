// src/api/useMyPageApi.ts
import { useCallback } from 'react';
import axios from "./AxiosInstance";
import type { MyPageMainApiResponse } from "../pages/mypage/MyPageMain";
import type { ShortReviewListApiResponse } from "../pages/mypage/MyReviewsShortPage";
import type { DetailReviewListApiResponse } from "../pages/mypage/MyReviewsDetailPage";
import type { FavoriteMovieApiResponse } from "../pages/mypage/MyFavoriteMoviesPage";
import type { FollowerApiResponse } from "../pages/mypage/MyFollowersPage"; 
import type { FollowingApiResponse } from "../pages/mypage/MyFollowingPage"; // MyFollowingPage에서 정의된 인터페이스 임포트

// 팔로우/언팔로우 API 응답 인터페이스 (useMyPageApi 내부에서 사용)
interface FollowToggleResponse {
  status: number;
  success: boolean;
  message: string;
}

const useMyPageApi = () => {
  const fetchMyPageMainData = useCallback(async (): Promise<MyPageMainApiResponse["data"] | null> => {
    try {
      const response = await axios.get<MyPageMainApiResponse>("/mypage/main");
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch data with success: false");
      }
    } catch (error) {
      console.error("마이페이지 데이터 불러오기 실패:", error);
      throw error;
    }
  }, []);

  const fetchMyShortReviews = useCallback(async (): Promise<ShortReviewListApiResponse["data"]["shortReviews"] | null> => {
    try {
      const response = await axios.get<ShortReviewListApiResponse>("/mypage/shortReview");
      if (response.data.success) {
        return response.data.data.shortReviews;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch short reviews with success: false");
      }
    } catch (error) {
      console.error("내 한줄평 불러오기 실패:", error);
      throw error;
    }
  }, []);

  const fetchMyDetailReviews = useCallback(async (): Promise<DetailReviewListApiResponse["data"]["reviews"] | null> => {
    try {
      const response = await axios.get<DetailReviewListApiResponse>("/mypage/review");
      if (response.data.success) {
        return response.data.data.reviews;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch detail reviews with success: false");
      }
    } catch (error) {
      console.error("내 상세 리뷰 불러오기 실패:", error);
      throw error;
    }
  }, []);

  const fetchMyFavoriteMovies = useCallback(async (): Promise<FavoriteMovieApiResponse["data"]["myPickMoives"] | null> => {
    try {
      const response = await axios.get<FavoriteMovieApiResponse>("/mypage/myPickMovie");
      if (response.data.success) {
        return response.data.data.myPickMoives;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch favorite movies with success: false");
      }
    } catch (error) {
      console.error("내가 찜한 영화 불러오기 실패:", error);
      throw error;
    }
  }, []);

  const fetchMyFollowers = useCallback(async (targetId: string): Promise<FollowerApiResponse["data"] | null> => {
    try {
      const response = await axios.get<FollowerApiResponse>(`/follow/followers/${targetId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch followers with success: false");
      }
    } catch (error) {
      console.error(`팔로워 목록 불러오기 실패 (targetId: ${targetId}):`, error);
      throw error;
    }
  }, []);

  const fetchMyFollowing = useCallback(async (targetId: string): Promise<FollowingApiResponse["data"] | null> => {
    try {
      const response = await axios.get<FollowingApiResponse>(`/follow/following/${targetId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch following with success: false");
      }
    } catch (error) {
      console.error(`팔로잉 목록 불러오기 실패 (targetId: ${targetId}):`, error);
      throw error;
    }
  }, []);

  const followUser = useCallback(async (targetUserId: string): Promise<FollowToggleResponse> => {
    try {
      const response = await axios.post<FollowToggleResponse>(`/follow/${targetUserId}`);
      if (response.data.success) {
        return response.data;
      } else {
        console.error("팔로우 API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to follow user with success: false");
      }
    } catch (error) {
      console.error(`팔로우 실패 (targetUserId: ${targetUserId}):`, error);
      throw error;
    }
  }, []);

  const unfollowUser = useCallback(async (targetUserId: string): Promise<FollowToggleResponse> => {
    try {
      const response = await axios.delete<FollowToggleResponse>(`/follow/${targetUserId}`);
      if (response.data.success) {
        return response.data;
      } else {
        console.error("언팔로우 API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to unfollow user with success: false");
      }
    } catch (error) {
      console.error(`언팔로우 실패 (targetUserId: ${targetUserId}):`, error);
      throw error;
    }
  }, []);

  const updateMyProfile = useCallback(async (profileData: { nickname?: string; image?: string }) => {
    try {
      const response = await axios.patch("/users/me", profileData);
      return response.data;
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error;
    }
  }, []);


  // 2. fetchUserGenres 함수 추가 (mypage/userGenres GET 호출)
  const fetchUserGenres = useCallback(async (): Promise<UserGenresApiResponse["data"] | null> => {
    try {
      const url = `/mypage/userGenres`; // mypage/userGenres GET API 경로
      console.log(`[fetchUserGenres] API 요청 URL: ${axios.defaults.baseURL}${url}`);
      const response = await axios.get<UserGenresApiResponse>(url);
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("API 응답 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to fetch user genres with success: false");
      }
    } catch (error) {
      console.error("사용자 장르 불러오기 실패:", error);
      throw error;
    }
  }, []);

  // 3. saveUserGenres 함수 추가 (mypage/userGenres POST 호출)
  const saveUserGenres = useCallback(async (genreNames: string[]): Promise<boolean> => {
    try {
      const url = `/mypage/userGenres`; // mypage/userGenres POST API 경로
      const requestBody: SaveUserGenresRequest = { genreNames }; // 요청 바디 생성
      console.log(`[saveUserGenres] API 요청 URL: ${axios.defaults.baseURL}${url}, Body:`, requestBody);

      const response = await axios.post(url, requestBody); // POST 요청
      if (response.data.success) {
        console.log("장르 저장 성공:", response.data.message);
        return true;
      } else {
        console.error("장르 저장 실패:", response.data.message);
        throw new Error(response.data.message || "Failed to save user genres with success: false");
      }
    } catch (error) {
      console.error("장르 저장 중 오류 발생:", error);
      throw error;
    }
  }, []);



  return {
    fetchMyPageMainData,
    fetchMyShortReviews,
    fetchMyDetailReviews,
    fetchMyFavoriteMovies,
    fetchMyFollowers,
    fetchMyFollowing,
    followUser,
    unfollowUser,
    updateMyProfile,
    // 새로 추가된 함수들
    fetchUserGenres,
    saveUserGenres,
  };
};

export default useMyPageApi;