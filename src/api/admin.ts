import axios from "./AxiosInstance";

export const useAdminApi = () => {
  const getShortReviewStats = async () => {
    return await axios.get("admin/stats/shortreview/genre");
  };

  const getBanUserStats = async (start: string, end: string) => {
    return await axios.get(
      `admin/stats/banuser/month?start=${start}&end=${end}`
    );
  };

  return {
    getBanUserStats,
    getShortReviewStats,
  };
};
export default useAdminApi;
