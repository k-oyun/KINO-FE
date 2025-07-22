import React from 'react';
import styled from 'styled-components';
import teaser from '../assets/video/teaser.mp4';

const VideoContainer = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;

  padding-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    </VideoContainer>
  );
};

export default VideoBackground;