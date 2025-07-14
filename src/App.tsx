import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import MyPageMain from "./pages/mypage/MyPageMain";
// import Login from "./pages/Login";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Routes>
          <Route path ="/mypage" element={<MyPageMain />} />
          {/* <Route path="/login" element={<Login />}></Route> */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
