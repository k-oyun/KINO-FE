import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
      </ThemeProvider>
    </>
  );
}

export default App;
