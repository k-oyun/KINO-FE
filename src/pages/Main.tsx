import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useEffect, useState } from "react";
import SurveyModal from "../components/SurveyModal";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);

  return (
    <>
      {isNewUser && <SurveyModal setIsNewUser={setIsNewUser} />}
      <MainHeader keyword={keyword} setKeyword={setKeyword} />
      <MainContainer></MainContainer>
    </>
  );
};

export default Main;
