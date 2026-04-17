import styled from "styled-components";
import ProfileBox from "./components/ProfileBox";
import Timeline from "./components/TimeLine";
import TimelineItem from "./components/TimelineItem";
import { Work } from "@mui/icons-material";

function CVPage() {
  return (
    <Wrapper>
      <ProfileBox />
      <TextContent>
        <Title>Timeline</Title>
      </TextContent>
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
      <TextContent>
        <Title>
          Education <EduBall>●</EduBall>
        </Title>
        <Chapter>
          Obtained three relevant degrees on the field of software development:
          Associate's, Bachelor's and Master's.
        </Chapter>
        <Chapter>
          During bachelor's studies I focused on software development and user
          experience. I pursued my interests in writing a thesis about
          transforming an open source map library into a usable shareable
          component.
        </Chapter>
        <Chapter>
          During master's studies I focused on advanced software engineering nad
          human-technology interaction. Master's thesis focused on software and
          technology based spatial safety using location technologies, yet again
          following my interests in spatial systems.
        </Chapter>
      </TextContent>
      <TextContent>
        <Title>
          Career <WorkBall>●</WorkBall>
        </Title>
        <Chapter>
          While it may seem I have worked for a single company for a long time,
          the truth is far from what you may assume. The company has gone
          through several names, mergers, phases, offices and business sectors.
          It never felt like a single company to me and my responsibilities and
          skills kept growing each year. I've had the pleasure to work with some
          amazing people across several fields, technologies and work with local
          and global teams.
        </Chapter>
        <Chapter>
          I became in FullStack development dealing with databases, backends,
          frontends, cloud and pipelines. I became well known for my expertiese
          in geographical systems, web development, web components, design
          systems and shared services. I ended up focusing more on the web-,
          map-, and Frontend development which I had a passion for. Eventually
          this lead to me assuming a Lead position mentoring developers in my
          own team, while consulting global teams to help them succeed with
          their projects.
        </Chapter>
        <Chapter>
          The highlight of my career is pioneering a framework-agnostic Google
          Lit web component project of shared branded components tied together
          with a design system and a shared React solutions library, which was
          lead and developed almost exclusively by me. Inside the shared React
          solutions library my Bachelor's thesis finally came into fruition as I
          got to implement a fully fledged OpenLayers-context that could be
          plugged into any React project with minimal configuration (CDD). This
          development ecosystem became a globally accepted standard inside the
          company and became a central force in the development strategy of our
          software business with several large scale projects depending on it.
        </Chapter>
      </TextContent>
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

  @media (max-width: 800px) {
    padding: 12px;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 524px;
  max-width: 100%;
  color: white;
`;
const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 12px;s
`;
const Chapter = styled.p`
  font-size: 12px;
  margin: 4px 0;
`;

const EduBall = styled.span`
  color: #3340a3;
`;
const WorkBall = styled.span`
  color: #286f1a;
`;

export default CVPage;
