import axios from "./AxiosInstance";

export const useHomeApi = () => {
  const getHomeApi = async () => {
    return await axios.get(`/home`);
  };

  const searchHomeApi = async (keyword: string) => {
    return await axios.get(`/movies/search?keyword=${keyword}`);
  };

  const surveyApi = async (genreIds: number[]) => {
    return await axios.post(`/user/genre`, { genreIds });
  };

  return {
    getHomeApi,
    searchHomeApi,
    surveyApi,
  };
};
export default useHomeApi;
