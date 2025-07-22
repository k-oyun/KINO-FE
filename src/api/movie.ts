import axios from "./axiosInstance";

export const useMovieApi = () => {
  const getMovies = async (page: number, size: number, genres: number[]) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (size) params.append("size", size.toString());
    if (genres.length > 0) {
      genres.forEach((genre) => params.append("genreIds", genre.toString()));
    }
    console.log("Fetching movies with params:", params.toString());
    return await axios.get(`/movie/all?${params}`);
  };

  return {
    getMovies,
  };
};
