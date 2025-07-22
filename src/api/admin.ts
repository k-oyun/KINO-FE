import axios from "./AxiosInstance";

export const useAdminApi = () => {
  const getShortReviewStats = async () => {
    return await axios.get("/admin/stats/shortreview/genre");
  };

  const getBanUserStats = async (start: string, end: string) => {
    return await axios.get(
      `/admin/stats/banuser/month?start=${start}&end=${end}`
    );
  };

  const userGet = async (currentPage: number, size: number) => {
    return await axios.get(`/admin/user?page=${currentPage}&size=${size}`);
  };

  const reviewReportGet = async (currentPage: number, size: number) => {
    return await axios.get(`/admin/review?page=${currentPage}&size=${size}`);
  };
  const shortReviewReportGet = async (currentPage: number, size: number) => {
    return await axios.get(
      `/admin/shortreview?page=${currentPage}&size=${size}`
    );
  };
  const commentReportGet = async (currentPage: number, size: number) => {
    return await axios.get(`/admin/comment?page=${currentPage}&size=${size}`);
  };

  const userActivePost = async (selectedUser: number[]) => {
    return await axios.post("/admin/active", selectedUser);
  };

  const reportModalGet = async (reportType: string, reportId: number) => {
    return await axios.get(`/admin/${reportType}/${reportId}`);
  };
  const reportModalPost = async (
    reportId: number,
    reportedId: number,
    result: string
  ) => {
    return await axios.post("/admin/process", {
      reportId,
      reportedId,
      result: Number(result),
    });
  };

  return {
    getBanUserStats,
    getShortReviewStats,
    userGet,
    reviewReportGet,
    shortReviewReportGet,
    commentReportGet,
    userActivePost,
    reportModalGet,
    reportModalPost,
  };
};
export default useAdminApi;
