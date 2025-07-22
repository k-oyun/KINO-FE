import styled from "styled-components";
import { motion, useAnimate } from "framer-motion";
import { useState, type ChangeEvent } from "react";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const SearchWrapper = styled(motion.form)<{ $issearchbtnpos: boolean }>`
  display: ${(props) => (props.$issearchbtnpos ? "none" : "flex")};
  align-items: center;
  position: relative;
  /* color: ${({ theme }) => theme.textColor}; */
  color: white;
  svg {
    height: 25px;
    cursor: pointer;
  }
  margin-right: 10px;
  z-index: 5000;
`;

const Input = styled(motion.input)<{ $ismobile: boolean }>`
  transform-origin: right center;
  position: absolute;
  right: 0;
  width: 820%;
  width: 205px;
  height: 100%;
  padding-left: 40px;
  padding-bottom: 5px;
  z-index: -1;
  /* color: ${({ theme }) => theme.textColor}; */
  color: white;
  font-size: 14px;
  background-color: transparent;
  border: none;
  z-index: 3001;
  /* background-color: red; */
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const SearchBar = ({ keyword, setKeyword }: SearchBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scope, animate] = useAnimate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isSearchBtnPos = useMediaQuery({ query: "(max-width: 1258px" });
  const toggleSearch = () => {
    if (searchOpen) {
      animate(scope.current, { scaleX: 0 }, { ease: "linear" });
      setKeyword("");
    } else {
      animate(scope.current, { scaleX: 1 }, { ease: "linear" });
      setKeyword("");
    }
    setSearchOpen((prev) => !prev);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const { t } = useTranslation();

  return (
    <SearchWrapper $issearchbtnpos={isSearchBtnPos}>
      <motion.svg
        ref={scope}
        onClick={toggleSearch}
        whileHover={{
          scale: 1.2,
          // zIndex: 10,
          // borderRadius: "15px",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 18,
        }}
        animate={{ x: searchOpen ? -220 : 0 }}
        style={{ zIndex: "5001" }}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </motion.svg>
      <Input
        $ismobile={isMobile}
        ref={scope}
        style={{ scaleX: 0 }}
        value={keyword}
        onChange={onChange}
        placeholder={t("search") + ".."}
      />
    </SearchWrapper>
  );
};
