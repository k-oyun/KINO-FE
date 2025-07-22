import React from "react";
import styled from "styled-components";

interface styledType {
  $ismobile?: boolean;
}

const LanguageButton = styled.button<styledType>`
  position: fixed;
  z-index: 9999;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  bottom: 32px;
  right: 20px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.hoverColor};
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  &:hover {
    filter: brightness(90%);
    transform: scale(1.1);
  }
`;

const Language = () => {
  const handleLanguageChange = () => {
    const currentLanguage = localStorage.getItem("language") || "ko";
    if (currentLanguage === "ko") {
      localStorage.setItem("language", "en");
      window.location.reload();
    } else {
      localStorage.setItem("language", "ko");
      window.location.reload();
    }
  };

  return (
    <LanguageButton onClick={handleLanguageChange}>
      {localStorage.getItem("language") === "ko" ? "🇰🇷" : "🇬🇧"}
    </LanguageButton>
  );
};

export default Language;
