import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import Login from "./pages/Login";
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {/* <Header /> */}
        <Login />
      </ThemeProvider>
    </>
  );
}

export default App;
