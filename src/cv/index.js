import styled from "styled-components";
import ProfileBox from "./components/ProfileBox";
import Timeline from "./components/TimeLine";
import TimelineItem from "./components/TimelineItem";

function CVPage() {
  return (
    <Wrapper>
      <ProfileBox />
      <Timelines>
        <Timeline>
          <TimelineItem
            year="2014"
            percentage={25}
            title="Associate's Degree"
            subtitle="Software Engineering"
            description="TREDU"
          />
          <TimelineItem
            year="2018"
            percentage={50}
            title="Bachelor's Degree"
            subtitle="Information Technology"
            description="Tampere University"
          />
          <TimelineItem
            year="2021"
            percentage={69}
            title="Master's Degree"
            subtitle="Information Technology"
            description="Tampere University"
          />
          <TimelineItem year="2026" percentage={99.5} />
        </Timeline>
        <Timeline>
          <TimelineItem
            year="2010"
            percentage={0.2}
            title="Tieto"
            description="IT Support"
            flip
          />
          <TimelineItem
            year="2012"
            percentage={13}
            title="Software Developer"
            description="Topcon"
            flip
          />
          <TimelineItem
            year="2022"
            percentage={75}
            title="Senior Software Engineer"
            description="Topcon"
            flip
          />
          <TimelineItem
            year="2024"
            percentage={88}
            title="Lead Software Engineer"
            description="Topcon"
            flip
          />
        </Timeline>
      </Timelines>
    </Wrapper>
  );
}

const Timelines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 160px 0;

  @media (max-width: 800px) {
    flex-direction: row-reverse;
    padding: 0 112px;
  }
`;

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
