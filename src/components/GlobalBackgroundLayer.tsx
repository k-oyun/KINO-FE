import React from 'react';
import styled from 'styled-components';

const BackgroundLayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -999;
  background-color: black; 
  pointer-events: none;
`;

const GlobalBackgroundLayer: React.FC = () => {
  return <BackgroundLayerContainer />;
};

export default GlobalBackgroundLayer;