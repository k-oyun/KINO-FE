import "./App.css";
import Header from "./components/Header";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import MyPageMain from "./pages/mypage/MyPageMain";
import MyReviewsShortPage from "./pages/mypage/MyReviewsShortPage";
import MyReviewsDetailPage from "./pages/mypage/MyReviewsDetailPage";
import MyFavoriteMoviesPage from "./pages/mypage/MyFavoriteMoviesPage";
import MySettingsPage from "./pages/mypage/MySettingsPage";
import MyTagsPage from "./pages/mypage/MyTagsPage";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Movie from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";
import { usePreferMode } from "./hooks/usePreferMode";
import GlobalStyle from "./styles/GlobalStyle";
import Admin from "./pages/Admin";
import KakaoCallback from "./components/KakaoCallback";
import GoogleCallback from "./components/GoogleCallback";
import NaverCallback from "./components/NaverCallback";
import { DialogProvider, useDialog } from "./context/DialogContext";
import ConfirmDialog from "./components/AdminConfirmDialog";
import { useEffect } from "react";

const HeaderSelector = ({ path }: { path: string }) => {
  if (path === "/Login" || path === "/login") return null;
  if (path === "/") return null;

  return <Header />;
};

const GlobalDialogRenderer = () => {
  const { dialog, closeDialog } = useDialog();

  return (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      title={dialog.title || ""}
      message={dialog.message}
      showCancel={dialog.showCancel}
      isRedButton={dialog.isRedButton}
      onConfirm={() => {
        closeDialog();
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }}
      onCancel={() => closeDialog()}
    />
  );
};

const AppContents = () => {
  const isDarkMode = usePreferMode();
  const location = useLocation();
  const path = location.pathname;
  const isAdminPage = path === "/admin";
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e: Event) => {
      let code = (e as CustomEvent).detail?.status || 401;
      openDialog({
        title: "알림",
        message:
          code === 500
            ? "서버에 문제가 발생했습니다."
            : "다시 로그인 해주세요!",
        showCancel: false,
        isRedButton: true,
        onConfirm: () => navigate("/login"),
      });
    };
    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, [openDialog]);
  return (
    <>
      <ThemeProvider
        theme={isAdminPage ? lightTheme : isDarkMode ? darkTheme : lightTheme}
      >
        <GlobalStyle />
        <HeaderSelector path={path} />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/api/auth/oauth/kakao" element={<KakaoCallback />} />
          <Route path="/api/auth/oauth/google" element={<GoogleCallback />} />
          <Route path="/api/auth/oauth/naver" element={<NaverCallback />} />
          <Route path="/movie" element={<Movie />}></Route>
          <Route path="/movie/:id" element={<MovieDetail />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/mypage" element={<MyPageMain />} />
          <Route
            path="/mypage/reviews/short"
            element={<MyReviewsShortPage />}
          />
          <Route
            path="/mypage/reviews/detail"
            element={<MyReviewsDetailPage />}
          />
          <Route
            path="/mypage/movies/favorite"
            element={<MyFavoriteMoviesPage />}
          />
          <Route path="/mypage/settings" element={<MySettingsPage />} />
          <Route path="/mypage/tags" element={<MyTagsPage />} />
        </Routes>
      </ThemeProvider>
      <GlobalDialogRenderer />
    </>
  );
};

function App() {
  return (
    <DialogProvider>
      <BrowserRouter>
        <AppContents />
      </BrowserRouter>
    </DialogProvider>
  );
}

export default App;
