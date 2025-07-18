import axios from "./AxiosInstance";

export const useMovieDetailApi = () => {
  const getMovieDetail = async (movieId: number) => {
    return await axios.get(`/${movieId}/info`);
  };

  const postShortReview = async (movieId: number, content: string) => {
    return await axios.post(`/${movieId}/short-reviews`, { content });
  };

  const updateShortReview = async (
    movieId: number,
    reviewId: number,
    content: string
  ) => {
    return await axios.put(`/${movieId}/short-reviews/${reviewId}`, {
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
    postShortReview,
    updateShortReview,
    deleteShortReview,
    getShortReviews,
    getReviews,
    likeShortReview,
  };
};

export default useMovieDetailApi;
