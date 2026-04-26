import styled from 'styled-components';

interface ProfileBoxProps {
  tiny: boolean;
}

function ProfileBox({ tiny }: ProfileBoxProps) {
  return (
    <Box $tiny={tiny}>
      <Face $tiny={tiny} className="face" />
      <Details $tiny={tiny}>
        <Name $tiny={tiny}>Kalle Kuparinen</Name>
        {!tiny && <Title>Senior Software Developer</Title>}
        {!tiny && <Title>Lead Software Engineer</Title>}
        {!tiny && <Title>MSc. - Information Technology</Title>}
      </Details>
    </Box>
  );
}

export default ProfileBox;

const Box = styled.div<{ $tiny: boolean }>`
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  transition-property: top, left, transform;
  display: flex;
  flex: 0 1 auto;
  flex-direction: row-reverse;
  gap: 16px;
  color: white;
  height: fit-content;
  position: absolute;
  top: 0;
  background: black;
  z-index: 2;
  border-radius: 4px 1000px 1000px 4px;
  box-shadow: 0 0 8px #ffffff66;
  padding-left: 8px;
  top: 16px;
  left: 0;

  &:hover .face {
    width: 256px;
    height: 256px;
    min-width: 256px;
  }
`;

const Face = styled.div<{ $tiny: boolean }>`
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  transition-property: width, height, min-width;
  width: ${(props) => (props.$tiny ? '32px' : '128px')};
  height: ${(props) => (props.$tiny ? '32px' : '128px')};
  min-width: ${(props) => (props.$tiny ? '32px' : '128px')};

  border-radius: 50%;
  background: white;
  background-image: url('Amsterdam.jpg');
  background-size: 200%;
  background-position: 8% 15%;
  box-shadow: -4px 0px 4px #ffffff33;
`;

const Details = styled.div<{ $tiny: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  transition-property: width, height;
  height: ${(props) => (props.$tiny ? '32px' : '128px')};
  width: ${(props) => (props.$tiny ? '112px' : '214px')};
  white-space: nowrap;
  gap: 8px;
`;

const Name = styled.span<{ $tiny: boolean }>`
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  transition-property: font-size, font-weight;
  font-size: ${(props) => (props.$tiny ? '14px' : '24px')};
  font-weight: ${(props) => (props.$tiny ? '500' : '700')};
  line-height: 32px;
  white-space: nowrap;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #c7c7c7;
`;
