import axios from "./AxiosInstance";

export const useHomeApi = () => {
  const getHomeApi = async () => {
    return await axios.get(`/home`);
  };

  const searchHomeApi = async (keyword: string) => {
    return await axios.get(`/movies/search?keyword=${keyword}`);
  };

  return {
    getHomeApi,
    searchHomeApi,
  };
};
export default useHomeApi;
