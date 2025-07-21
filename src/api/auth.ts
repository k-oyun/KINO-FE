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

  const userInfoGet = async () => {
    return await axios.get("/user");
  };

  const logout = async () => {
    return await axios.get("/logout");
  };

  return {
    login,
    loginWithKakao,
    loginWithGoogle,
    loginWithNaver,
    userInfoGet,
    logout,
  };
};
export default useAuthApi;
