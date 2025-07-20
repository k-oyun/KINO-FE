import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthApi from "../api/auth";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthApi();
  const handleLogin = async (code: string) => {
    try {
      const res = await loginWithGoogle(code);
      console.log("로그인", res);

      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("code 가져옴:", code);
      handleLogin(code).then(() => {
        window.location.href = "/main";
      });
    }
  }, [searchParams, navigate]);

  return <div>구글 로그인 처리 중...</div>;
}

export default GoogleCallback;
