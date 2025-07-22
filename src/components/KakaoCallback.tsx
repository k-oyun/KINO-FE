import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthApi from "../api/auth";
import axios from "axios";

function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithKakao, reissue } = useAuthApi();
  const handleLogin = async (code: string) => {
    try {
      const res = await loginWithKakao(code);
      console.log("로그인", res);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      const refresh = localStorage.getItem("refreshToken");
      console.log("기존", res.data.data.accessToken);
      const tokenRes = await axios.get(
        "http://43.203.218.183:8080/api/refresh",
        {
          headers: {
            Authorization: `Bearer ${refresh}`,
          },
        }
      );

      localStorage.removeItem("accessToken");
      localStorage.setItem("accessToken", tokenRes.data.data);
      console.log("새로운거1 ", tokenRes.data);
      console.log("새로운거2 ", tokenRes.data.data);
      console.log("새로운거3 ", localStorage.getItem("accessToken"));
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("code 가져옴:", code);
      handleLogin(code).then(() => {
        window.location.href = "/home";
      });
    }
  }, [searchParams, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallback;
