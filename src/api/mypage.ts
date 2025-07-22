import axios from "./axiosInstance";
import { useCallback, useMemo } from "react";

interface UpdateShortReviewPayload {
  content: string;
  rating: number;
  movieTitle?: string; // 선택
}

export const useMypageApi = () => {
  const mypageMain = useCallback(
    (targetId: number) =>
      axios.get("/mypage/main", {
        params: { targetId },
      }),
    []
  );
  const mypageMyPickMovie = useCallback(
    (targetId: number) =>
      axios.get("/mypage/myPickMovie", {
        params: { targetId },
      }),
    []
  );
  const mypageReview = useCallback(
    (targetId: number) =>
      axios.get("/mypage/review", {
        params: { targetId },
      }),
    []
  );
  const mypageShortReview = useCallback(
    (targetId: number) =>
      axios.get("/mypage/shortReview", {
        params: { targetId },
      }),
    []
  );

  const userInfoGet = useCallback(() => axios.get("/user"), []);
  const getFollower = useCallback(
    (targetId: number) => axios.get(`/follow/followers/${targetId}`),
    []
  );
  const getFollowing = useCallback(
    (targetId: number) => axios.get(`/follow/following/${targetId}`),
    []
  );
  const followUser = useCallback(
    (targetId: number) => axios.post(`/follow/${targetId}`),
    []
  );
  const unfollowUser = useCallback(
    (targetId: number) => axios.delete(`/follow/${targetId}`),
    []
  );
  const updateProfile = useCallback((formData: FormData) => {
    return axios.post("/mypage/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }, []);
  const getGenre = useCallback(() => axios.get("/mypage/userGenres"), []);
  const updateGenre = useCallback(
    (genreIds: number[]) => axios.post("/mypage/userGenres", { genreIds }),
    []
  );
  const updateShortReview = useCallback(
    (
      movieId: number,
      shortReviewId: string,
      payload: UpdateShortReviewPayload
    ) => axios.put(`/${movieId}/short-reviews/${shortReviewId}`, payload),
    []
  );

  const deleteShortReview = useCallback(
    (movieId: number, shortReviewId: string) =>
      axios.delete(`/${movieId}/short-reviews/${shortReviewId}`),
    []
  );

  return useMemo(
    () => ({
      mypageMain,
      mypageMyPickMovie,
      mypageReview,
      mypageShortReview,
      userInfoGet,
      getFollower,
      getFollowing,
      followUser,
      unfollowUser,
      updateProfile,
      getGenre,
      updateGenre,
      updateShortReview,
      deleteShortReview,
    }),
    [
      mypageMain,
      mypageMyPickMovie,
      mypageReview,
      mypageShortReview,
      userInfoGet,
      getFollower,
      getFollowing,
      followUser,
      unfollowUser,
      updateProfile,
      getGenre,
      updateGenre,
      updateShortReview,
      deleteShortReview,
    ]
  );
};

export default useMypageApi;
