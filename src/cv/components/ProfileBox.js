import styled from "styled-components";

function ProfileBox() {
  return (
    <Box>
      <Face />
      <Details>
        <Name>Kalle Kuparinen</Name>
        <Title>Senior Software Developer / Lead Software Engineer</Title>
        <Title>MSc. - Information Technology</Title>
      </Details>
    </Box>
  );
}

export default ProfileBox;

const Box = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  gap: 16px;
  color: white;
  height: fit-content;
  position: sticky;
  top: 0;
  background: black;
  z-index: 2;
  border-radius: 100px 4px 4px 100px;
  box-shadow: 0 0 8px #ffffff66;
  padding-right: 8px;
`;

const Face = styled.div`
  width: 128px;
  height: 128px;
  min-width: 128px;
  border-radius: 50%;
  background: white;
  background-image: url("Amsterdam.jpg");
  background-size: 200%;
  background-position: 8% 15%;
  box-shadow: 4px 0px 4px #ffffff33;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Name = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #c7c7c7;
`;
