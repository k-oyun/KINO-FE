import axios from "./AxiosInstance";

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

  const postReview = async (
    reviewTitle: string,
    reviewContent: string,
    movieId: number
  ) => {
    return await axios.post(`/review`, { reviewTitle, reviewContent, movieId });
  };

  const updateReview = async (
    reviewTitle: string,
    reviewContent: string,
    movieId: number,
    reviewId: number
  ) => {
    return await axios.put(`/review`, {
      reviewContent,
      reviewTitle,
      movieId,
      reviewId,
    });
  };

  const postComment = async (reviewId: number, commentContent: string) => {
    return await axios.post(`/comment`, { reviewId, commentContent });
  };

  const getComments = async (reviewId: number, page: number, size: number) => {
    return await axios.get(`/comment/${reviewId}`, {
      params: {
        page: page,
        size: size,
      },
    });
  };

  const updateComment = async (
    commentId: number,
    reviewId: number,
    content: string
  ) => {
    return await axios.put(`/comment/${commentId}`, { reviewId, content });
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

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("upload", file);

    return await axios.post(`/img`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const postShortReviewReport = async (
    reportType: number,
    content: string,
    relatedId: number,
    reporteeId: number
  ) => {
    return await axios.post(`/report`, {
      reportType,
      content,
      relatedId,
      reporteeId,
      relatedType: -1, // -1 indicates short review
    });
  };

  const postReviewReport = async (
    reportType: number,
    content: string,
    relatedId: number,
    reporteeId: number
  ) => {
    return await axios.post(`/report`, {
      reportType,
      content,
      relatedId,
      reporteeId,
      relatedType: -2, // -2 indicates review
    });
  };

  const postCommentReport = async (
    reviewId: number,
    commentId: number,
    reason: string
  ) => {
    return await axios.post(`/report`, {
      reviewId,
      commentId,
      reason,
    });
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
    uploadImage,
    postShortReviewReport,
    postReviewReport,
    postCommentReport,
  };
};

export default useReviewsApi;
