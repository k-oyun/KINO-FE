import axios from "./axiosInstance";

export const useMovieDetailApi = () => {
  const getMovieDetail = async (movieId: number) => {
    return await axios.get(`/${movieId}/info`);
  };

  const getIsPicked = async (movieId: number) => {
    return await axios.get(`/mypick/${movieId}`);
  };

  const postMyPick = async (movieId: number) => {
    return await axios.post(`/mypick/${movieId}`);
  };

  const deleteMyPick = async (movieId: number) => {
    return await axios.delete(`/mypick/${movieId}`);
  };

  const postShortReview = async (
    movieId: number,
    rating: number,
    content: string
  ) => {
    return await axios.post(`/${movieId}/short-reviews`, { rating, content });
  };

  const updateShortReview = async (
    movieId: number,
    reviewId: number,
    rating: number,
    content: string
  ) => {
    return await axios.put(`/${movieId}/short-reviews/${reviewId}`, {
      rating,
      content,
    });
  };

  const deleteShortReview = async (movieId: number, reviewId: number) => {
    return await axios.delete(`/${movieId}/short-reviews/${reviewId}`);
  };

  const getShortReviews = async (movieId: number) => {
    return await axios.get(`/${movieId}/short-reviews`);
  };

  const getReviews = async (movieId: number) => {
    return await axios.get(`/${movieId}/reviews`);
  };

  const likeShortReview = async (reviewId: number) => {
    return await axios.post(`/${reviewId}/like`);
  };

  return {
    getMovieDetail,
    getIsPicked,
    postMyPick,
    deleteMyPick,
    postShortReview,
    updateShortReview,
    deleteShortReview,
    getShortReviews,
    getReviews,
    likeShortReview,
  };
};

export default useMovieDetailApi;
