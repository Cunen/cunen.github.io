import styled from "styled-components";

function Timeline({ children }) {
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
  padding-top: 64px;
`;

const Line = styled.div`
  display: flex;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #757575;
`;
