import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import CommunityCreatePage from "./pages/community/CommunityCreatePage";
import CommunityDetailPage from "./pages/community/CommunityDetailPage";
import CommunityListPage from "./pages/community/CommunityListPage";
import MyFollowersPage from "./pages/mypage/MyFollowersPage";
import MyFollowingPage from "./pages/mypage/MyFollowingPage";
import GlobalBackgroundLayer from "./components/GlobalBackgroundLayer";

function HeaderSelector() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/Login" || path === "/login") return null;
  if (path === "/") return null;

  return <Header />;
}

function App() {
  const isDarkMode = usePreferMode();
  const isAdminPage = location.pathname === "/admin";
  return (
    <>
      <BrowserRouter>
      <GlobalBackgroundLayer /> {/* ⭐ 여기에 추가 */}
        <ThemeProvider
          theme={isAdminPage ? lightTheme : isDarkMode ? darkTheme : lightTheme}
        >
          <GlobalStyle />
          <HeaderSelector />
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/login" element={<Login />}></Route>
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
            <Route
              path="/community/new"
              element={<CommunityCreatePage />}
            />
            <Route
              path="/community/posts/:id"
              element={<CommunityDetailPage />}
            />
            <Route path="/community" element={<CommunityListPage />} />
            <Route path="/mypage/followers" element={<MyFollowersPage />} />
            <Route path="/mypage/following" element={<MyFollowingPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;