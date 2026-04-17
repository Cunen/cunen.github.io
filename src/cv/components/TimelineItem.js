import styled from "styled-components";

function TimelineItem({ percentage, year, title, subtitle, description, flip }) {
  return (
    <Entry $percentage={percentage} $flip={flip}>
      <Year $flip={flip}>{year}</Year>
      {title && (
        <Info $flip={flip}>
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

  transform: ${(props) => props.$flip ? 'translate(0%, 100%)' : 'unset'};

  @media (max-width: 800px) {
    width: 16px;
    height: 2px;
    top: ${(props) => props.$percentage}%;
    left: unset;
    transform: ${(props) => props.$flip ? 'translate(-100%, 0%)' : 'unset'};
  }
`;

const Year = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.$flip ? '#3340a3' : '#286f1a'};
  color: white;
  font-size: 12px;
  top: 0;
  left: 0;
  transform: ${(props) => props.$flip ? 'translate(-50%, 16px)' : 'translate(-50%, -100%)'};

  @media (max-width: 800px) {
    transform: ${(props) => props.$flip ? 'translate(-100%, -50%) translateX(-16px)' : 'translate(0%, -50%)'};
    left: 100%;
    font-size: 10px;
    width: 32px;
    height: 32px;
  }
`;

const Info = styled.div`
  position: absolute;
  bottom:  ${(props) => props.$flip ? 'unset' : '0'};
  top:  ${(props) => props.$flip ? '0' : 'unset'};
  left: 0;
  color: white;
  font-size: 12px;
  transform: ${(props) => props.$flip ? 'translate(-25%, 56px) rotate(45deg)' : 'translate(-25%, -40px) rotate(-45deg)'};
  margin-bottom: ${(props) => props.$flip ? 'unset' : '48px'};
  margin-top: ${(props) => props.$flip ? '48px' : 'unset'};
  display: flex;
  align-items: center;
  flex-direction: column;
  white-space: nowrap;

  @media (max-width: 800px) {
    transform: ${(props) => props.$flip ? 'translate(-40px, -50%) translateX(-100%)' : 'translate(40px, -50%)'};
    font-size: 11px;
    top: 0;
    bottom: unset;
    left: ${(props) => props.$flip ? '0' : '100%'};
    margin: 0px;
  }
`;

const Main = styled.span``;

const Details = styled.span`
  color: #c7c7c7;
`;
