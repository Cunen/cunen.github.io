import styled from "styled-components";

function TimelineItem({ percentage, year, title, subtitle, description }) {
  return (
    <Entry $percentage={percentage}>
      <Year>{year}</Year>
      {title && (
        <Info>
          <Main>{title}</Main>
          {subtitle && <Details>{subtitle}</Details>}
          {description && <Details>{description}</Details>}
        </Info>
      )}
    </Entry>
  );
}

export default TimelineItem;

const Entry = styled.div`
  position: absolute;
  left: ${(props) => props.$percentage}%;
  bottom: 0;
  height: 16px;
  width: 2px;
  background-color: #757575;
`;

const Year = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #286f1a;
  color: white;
  font-size: 12px;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 12px;
  transform: translate(-50%, 24px);
  display: flex;
  align-items: center;
  flex-direction: column;
  white-space: nowrap;
`;

const Main = styled.div``;

const Details = styled.div`
  color: #c7c7c7;
`;
