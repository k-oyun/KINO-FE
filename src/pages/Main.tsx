import styled from "styled-components";
import MainHeader from "../components/MainHeader";
import { useEffect, useState } from "react";
import SurveyModal from "../components/SurveyModal";
import teaser from "../assets/video/teaser.mp4";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const VideoContainer = styled.div`
  background-color: black;
  width: 100%;
  margin-top: 40px;
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

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100vw;
  height: auto;
  top: 77vh;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.backgroundColor};
  background-color: transparent;
  padding-bottom: 50px;
`;

const MovieContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  margin-top: 20px;
  margin-left: 40px;
  right: 0px;
  background-color: transparent;
`;

const MoviesSlider = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  margin-top: 15px;
  background-color: transparent;
`;

const Movies = styled.div`
  display: inline-block;
  width: 200px;
  height: 120px;
  margin-right: 8px;
  background-color: #ddd;
  text-align: center;
  line-height: 120px;
`;

const PreviousSlideBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  border: none;
  cursor: pointer;
`;

const NextSlideBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  /* right: 0px;
  top: 52px; */
  border: none;
  cursor: pointer;
`;

const SliderTypeTxt = styled.span<{ isFirst?: boolean }>`
  font-size: 18px;
  font-weight: 400;
  margin-top: 30px;
  color: ${({ isFirst, theme }) => (isFirst ? "#ffffff" : theme.textColor)};
`;

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const sliderData = [
    { prefix: "사용자 좋아요", highlight: "TOP 10 리뷰" },
    { prefix: "사용자 좋아요", highlight: "TOP 10 영화" },
    { prefix: "현재 상영작 박스 오피스", highlight: "TOP 10 영화" },
    { prefix: "일별 조회수", highlight: "TOP 10 영화" },
    { prefix: "월별 조회수", highlight: "TOP 10 영화" },
  ];

  return (
    <>
      {isNewUser && <SurveyModal setIsNewUser={setIsNewUser} />}
      <MainHeader keyword={keyword} setKeyword={setKeyword} />
      <MainContainer>
        <VideoContainer>
          <Video
            src={teaser}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        </VideoContainer>
        <ListContainer>
          {sliderData.map(({ prefix, highlight }, idx) => (
            <MovieContainer key={idx}>
              <SliderTypeTxt isFirst={idx === 0}>
                {prefix} <strong>{highlight}</strong>
              </SliderTypeTxt>
              <MoviesSlider>
                {Array.from({ length: 15 }).map((_, itemIdx) => (
                  <Movies key={itemIdx}>Item {itemIdx + 1}</Movies>
                ))}
              </MoviesSlider>
            </MovieContainer>
          ))}
        </ListContainer>
      </MainContainer>
    </>
  );
};

export default Main;

{
  /* <PreviousSlideBtn>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </PreviousSlideBtn> */
}
{
  /* <NextSlideBtn>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </NextSlideBtn> */
}
