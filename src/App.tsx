import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { usePreferMode } from "./hooks/usePreferMode";
import GlobalStyle from "./styles/GlobalStyle";
import Movie from "./pages/Movie";

function HeaderSelector() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/Login") return null;
  if (path === "/") return null;
  return <Header />;
}
function App() {
  const isDarkMode = usePreferMode();
  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <BrowserRouter>
          <HeaderSelector />
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/Login" element={<Login />}></Route>
            <Route path="/Movie" element={<Movie />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
