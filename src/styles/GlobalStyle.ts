import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
    margin: 0;
    padding: 0;
    font-family: "Apple SD Gothic Neo";
    }

    body {
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.textColor};

    }
  
    ::-webkit-scrollbar {
    display: none;
    }

    img {
    user-drag: none; /* Safari */
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    }

    @font-face {
    font-family: "Apple SD Gothic Neo";
    /* font-weight: 500; */
    font-style: normal;
    font-display: swap;
    src: url("https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo-Medium.woff2")
        format("woff2"),
        url("https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo-Medium.ttf")
        format("truetype");
    }


`;

export default GlobalStyle;
