import React from 'react';
import styled from 'styled-components';
import teaser from '../assets/video/teaser.mp4'; // 비디오 파일 경로

const VideoContainer = styled.div`
  background-color: black; // ⭐ 이 부분이 비디오가 채워지지 않는 부분을 검은색으로 만듭니다.
  position: absolute;     // 부모 요소를 기준으로 배치되어 스크롤과 함께 움직임
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;            // 페이지 콘텐츠보다 뒤에 위치

  padding-top: 60px; // 헤더 높이만큼 패딩 추가
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;      // 비디오가 VideoContainer를 가득 채우되, 비율 유지
`;

const GradientOverlay = styled.div`
  position: absolute;     // VideoContainer를 기준으로 배치
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.0) 0%,    // 상단 투명
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0.6) 100%    // 하단 불투명
  );
  z-index: 0;             // VideoContainer (z-index: -1) 위에 위치
  pointer-events: none;   // 그라데이션 레이어 클릭 이벤트 무시
`;

const VideoBackground: React.FC = () => {
  return (
    <VideoContainer>
      <Video
        src={teaser}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
      <GradientOverlay />
    </VideoContainer>
  );
};

export default VideoBackground;