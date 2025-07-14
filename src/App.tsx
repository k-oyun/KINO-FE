import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import MyPageMain from "./pages/mypage/MyPageMain";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <>
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Routes>
          <Route path ="/mypage" element={<MyPageMain />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
