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

const VideoContainer = styled.div`
  background-color: black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  scroll-snap-align: start;
`;

const Video = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <>
      {isNewUser && <SurveyModal setIsNewUser={setIsNewUser} />}
      <MainHeader keyword={keyword} setKeyword={setKeyword} />
      <MainContainer>
        <VideoContainer>
          <Video autoPlay muted loop playsInline controls={false} />
        </VideoContainer>
      </MainContainer>
    </>
  );
};

export default Main;
