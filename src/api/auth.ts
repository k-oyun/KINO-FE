import axios from "./AxiosInstance";

export const useAuthApi = () => {
  const login = async (provider: string) => {
    return await axios.get(`/auth/login/${provider}`);
  };

  const loginWithKakao = async (code: string) => {
    return await axios.get(`auth/oauth/kakao?code=${code}`);
  };
  const loginWithGoogle = async (code: string) => {
    return await axios.get(`auth/oauth/google?code=${code}`);
  };
  const loginWithNaver = async (code: string) => {
    return await axios.get(`auth/oauth/naver?code=${code}`);
  };

  return {
    login,
    loginWithKakao,
    loginWithGoogle,
    loginWithNaver,
  };
};
export default useAuthApi;
