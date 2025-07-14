import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import MyPageMain from "./pages/mypage/MyPageMain";
import { Routes, Route } from "react-router-dom"; // 라우터 임포트


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Routes>
          <Route path ="/mypage" element={<MyPageMain />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
