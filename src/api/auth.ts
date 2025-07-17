import axios from "./AxiosInstance";

export const useAuthApi = () => {
  const login = async (provider: string) => {
    return await axios.get(`/auth/login/${provider}`);
  };

  const loginWithCode = async (code: string) => {
    return await axios.get(`auth/oauth/kakao?code=${code}`);
  };

  return {
    login,
    loginWithCode,
  };
};
export default useAuthApi;
