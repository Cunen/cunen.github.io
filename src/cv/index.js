import styled from "styled-components";
import ProfileBox from "./components/ProfileBox";
import Timeline from "./components/TimeLine";
import TimelineItem from "./components/TimelineItem";

function CVPage() {
  return (
    <Wrapper>
      <ProfileBox />
      <Timeline>
        <TimelineItem year="2014" percentage={0} title="Associate's Degree" subtitle="Software Engineering" description="TREDU" />
        <TimelineItem year="2018" percentage={33} title="Bachelor's Degree" subtitle="Information Technology" description="Tampere University" />
        <TimelineItem year="2021" percentage={58} title="Master's Degree" subtitle="Information Technology" description="Tampere University" />
        <TimelineItem year="2026" percentage={100} />
      </Timeline>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: black;
  align-items: center;
  padding: 32px;
  gap: 32px;
  box-sizing: border-box;
  & * {
    box-sizing: border-box;
  }
`;

export default CVPage;
