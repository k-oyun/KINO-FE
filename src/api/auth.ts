import axios from "./AxiosInstance";

export const useAuthApi = () => {
  const login = async (provider: string) => {
    return await axios.get(`/auth/login/${provider}`);
  };

  return {
    login,
  };
};
export default useAuthApi;
