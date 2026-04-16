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
`;

const Face = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: white;
  background-image: url("Amsterdam.jpg");
  background-size: 200%;
  background-position: 8% 15%;
  box-shadow: 0px 0px 8px #ffffff66;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #c7c7c7;
`;
