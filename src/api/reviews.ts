import axios from "./AxiosInstance";

interface ReviewPayload {
  movieId: number;
  reviewTitle: string;
  reviewContent: string;
}

interface ReviewEdit {
  reviewId: number;
  reviewTitle: string;
  reviewContent: string;
  movieId: number;
}

interface CommentPayload {
  reviewId: number;
  commentContent: string;
}

export const useReviewsApi = () => {
  const getReviews = async (page: number, size: number) => {
    return await axios.get(`/review/reviews`, {
      params: {
        page: page,
        size: size,
      },
    });
  };

  const getReviewById = async (reviewId: string) => {
    return await axios.get(`/review/${reviewId}`);
  };

  const postReview = async (payload: ReviewPayload) => {
    return await axios.post(`/review`, payload);
  };

  const updateReview = async (payload: ReviewEdit) => {
    return await axios.put(`/review`, payload);
  };

  const postComment = async (payload: CommentPayload) => {
    return await axios.post(`/comment`, payload);
  };

  const getComments = async (reviewId: number, page: number, size: number) => {
    return await axios.get(`/comment/${reviewId}`, {
      params: {
        page: page,
        size: size,
      },
    });
  };

  const updateComment = async (commentId: number, content: string) => {
    return await axios.put(`/comment/${commentId}`, { content });
  };

  const deleteReview = async (reviewId: number) => {
    return await axios.delete(`/review/${reviewId}`);
  };

  const deleteComment = async (commentId: number) => {
    return await axios.delete(`/comment/${commentId}`);
  };

  const likeReview = async (reviewId: number) => {
    return await axios.put(`/review/${reviewId}/heart`);
  };

  return {
    getReviews,
    postReview,
    updateReview,
    deleteReview,
    getReviewById,
    likeReview,
    postComment,
    getComments,
    deleteComment,
    updateComment,
  };
};

export default useReviewsApi;
