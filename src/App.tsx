import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import Login from "./pages/Login";
import Movie from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>

            <Route path="/movie" element={<Movie />}></Route>
            <Route path="/movie/:id" element={<MovieDetail />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
