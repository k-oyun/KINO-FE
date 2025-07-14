import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useEffect, useState } from "react";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const Main = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <MainHeader keyword={keyword} setKeyword={setKeyword} />
      <MainContainer></MainContainer>
    </>
  );
};

export default Main;
