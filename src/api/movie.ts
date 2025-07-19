import axios from "./AxiosInstance";

export const useMovieApi = () => {
  const getMovies = async () => {
    return await axios.get(`/movie/all`);
  };

  return {
    getMovies,
  };
};
