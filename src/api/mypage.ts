import axios from "./AxiosInstance";
import { useCallback, useMemo } from "react";

export const useMypageApi = () => {
  const mypageMain = useCallback(() => axios.get("/mypage/main"), []);
  const mypageMyPickMovie = useCallback(() => axios.get("/mypage/myPickMovie"), []);
  const mypageReview = useCallback(() => axios.get("/mypage/review"), []);
  const mypageShortReview = useCallback(() => axios.get("/mypage/shortReview"), []);
  const userInfoGet = useCallback(() => axios.get("/user"), []);
  const getFollower = useCallback((targetId: number) => axios.get(`/follow/followers/${targetId}`), []);
  const getFollowing = useCallback((targetId: number) => axios.get(`/follow/following/${targetId}`), []);
  const followUser = useCallback((targetId: number) => axios.post(`/follow/${targetId}`), []);
  const unfollowUser = useCallback((targetId: number) => axios.delete(`/follow/${targetId}`), []);
  const updateProfile = useCallback((formData: FormData) => {
    return axios.post("/mypage/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }, []);
  const getGenre = useCallback(() => axios.get("/mypage/userGenres"), []);
  const updateGenre = useCallback((genreIds: number[]) => axios.post("/mypage/userGenres", { genreIds }), []);
  const updateShortReview = useCallback(
    (reviewId: string, payload: { movieTitle: string; content: string; rating: number }) =>
      axios.put(`/mypage/shortReview/${reviewId}`, payload),
    []
  );
  const deleteShortReview = useCallback((reviewId: string) => axios.delete(`/mypage/shortReview/${reviewId}`), []);

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