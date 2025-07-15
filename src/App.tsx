import { useState } from "react";
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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Routes>
          <Route path ="/mypage" element={<MyPageMain />} />
          <Route path ="/mypage/reviews/short" element={<MyReviewsShortPage />} />
          <Route path ="/mypage/reviews/detail" element={<MyReviewsDetailPage />} />
          <Route path ="/mypage/movies/favorite" element={<MyFavoriteMoviesPage />} />
          <Route path ="/mypage/settings" element={<MySettingsPage />} />
          <Route path ="/mypage/tags" element={<MyTagsPage />} />
          <Route path ="/mypage" element={<MyPageMain />} />
          <Route path ="/mypage" element={<MyPageMain />} />
          <Route path ="/mypage" element={<MyPageMain />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
