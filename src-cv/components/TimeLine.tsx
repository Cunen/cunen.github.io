import type { ReactNode } from 'react';
import styled from 'styled-components';

interface TimelineProps {
  children: ReactNode;
}

function Timeline({ children }: TimelineProps) {
  return (
    <Box>
      {children}
      <Line />
    </Box>
  );
}

export default Timeline;

const Box = styled.div`
  position: relative;
  display: flex;
  width: 66vw;
  max-width: 1000px;
  overflow: visible;

  @media (max-width: 800px) {
    width: 50%;
    padding: 0px;
    height: 320px;
  }
`;

const Line = styled.div`
  display: flex;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #757575;

  @media (max-width: 800px) {
    width: 4px;
    max-width: 4px;
    height: 100%;
  }
`;
