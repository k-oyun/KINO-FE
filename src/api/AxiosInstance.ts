import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://43.203.218.183:8080/api",
  //withCredentials: true,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 500) {
      // 이벤트 전송 후 app.tsx에서 처리합니다!
      window.dispatchEvent(
        new CustomEvent("unauthorized", {
          detail: { status: error.response.status },
        })
      );
      console.log(error.response?.status);
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
