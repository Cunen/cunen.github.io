import styled from "styled-components";
import ProfileBox from "./components/ProfileBox";
import Timeline from "./components/TimeLine";
import TimelineItem from "./components/TimelineItem";
import Tool from "./components/Tool";
import { useState } from "react";

function CVPage() {
  const [top, setTop] = useState(true);

  const handleScroll = (e) => {
    if (!e.target) return;
    const newTop = e.target.scrollTop <= 8;
    if (newTop === top) return;
    setTop(newTop);
  };

  return (
    <Wrapper onScroll={handleScroll}>
      <ProfileBox tiny={!top} />
      <CV>CV</CV>
      <TextContent>
        <Title id="timeline">
          Timeline
          <span>
            <a href="#timeline">#</a>
          </span>
        </Title>
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
        <Title id="education">
          Education <EduBall>●</EduBall>
          <span>
            <a href="#education">#</a>
          </span>
        </Title>
        <Stack>
          <Tool img="tredu.png" name="TREDU" />
          <Tool img="tuni.png" name="TUNI" />
        </Stack>
        <Chapter>
          Obtained three relevant degrees on the field of software development:
          Associate's, Bachelor's and Master's.
        </Chapter>
        <Chapter>
          During bachelor's studies I focused on software development and user
          experience. I pursued my interests in writing a thesis about
          transforming an open source map library into a shareable component.
        </Chapter>
        <Chapter>
          During master's studies I focused on advanced software engineering and
          human-technology interaction. Master's thesis focused on software and
          technology based spatial safety using location technologies, yet again
          following my interests in spatial systems.
        </Chapter>
      </TextContent>
      <TextContent>
        <Title id="career">
          Career <WorkBall>●</WorkBall>
          <span>
            <a href="#career">#</a>
          </span>
        </Title>
        <Stack>
          <Tool img="vianova.jfif" name="Vianova" />
          <Tool img="viasys.jfif" name="ViasysVDC" />
          <Tool img="topcon.png" name="Topcon" />
        </Stack>
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
          I became fluent in FullStack development dealing with databases,
          backends, frontends, cloud and pipelines. I became well known for my
          expertise in geographical systems, web development, web components,
          design systems and shared services. I ended up focusing more on the
          web-, map-, and frontend development which I had a passion for.
          Eventually this lead to me assuming a Lead position mentoring
          developers in my own team, while consulting global teams to help them
          succeed with their projects.
        </Chapter>
        <Chapter>
          The highlight of my career is pioneering a framework-agnostic Google
          Lit web component project of shared branded components tied together
          with a design system and a shared React solutions library, which were
          all lead and developed almost exclusively by me. Inside the shared
          React solutions library my Bachelor's thesis finally came into
          fruition as I got to implement a fully fledged OpenLayers-context that
          could be plugged into any React project with minimal configuration
          (CDD). This development ecosystem became a globally accepted standard
          inside the company and became a central force in the development
          strategy of our software business with several large scale projects
          depending on it.
        </Chapter>
      </TextContent>
      <TextContent>
        <Title id="toolkit">
          Favourite Toolkit
          <span>
            <a href="#toolkit">#</a>
          </span>
        </Title>
        <Chapter>
          Lately I've been primarily focused on Frontend Web Development as that
          is what I am passionate about and that is reflected in my favourite
          tools.
        </Chapter>
        <Stack>
          <Tool img="vite.jfif" name="Vite" />
          <Tool img="react.png" name="React" />
          <Tool img="lit.png" name="Google Lit" />
          <Tool img="ts.png" name="TypeScript" />
          <Tool img="ol.png" name="OpenLayers" />
          <Tool img="node.png" name="Node" />
          <Tool img="py.jfif" name="Python" />
          <Tool img="robo.png" name="RobotFramework" />
        </Stack>
      </TextContent>
      <TextContent>
        <Title id="familiar">
          Familiar Tools
          <span>
            <a href="#familiar">#</a>
          </span>
        </Title>
        <Chapter>
          A lot of tools exist in my toolkit in professional capacity and I've
          worked with them in large scale projects. Some of these tools I am
          still fluent with, some may be a little rusty, but everything can be
          picked back up. Here's some I can remember from the top of my head.
        </Chapter>
        <Stack>
          <Tool img="docker.png" name="Docker" />
          <Tool img="tc.png" name="TeamCity" />
          <Tool img="jenkins.png" name="Jenkins" />
          <Tool img="copilot.png" name="Copilot" />
          <Tool img="maps.png" name="Maps API" />
          <Tool img="aws.png" name="AWS" />
          <Tool img="c.png" name="C#" />
          <Tool img="playwright.png" name="Playwright" />
          <Tool img="linux.png" name="Linux" />
          <Tool img="angular.jfif" name="Angular" />
          <Tool img="vue.png" name="Vue" />
          <Tool img="svelte.png" name="Svelte" />
          <Tool img="postman.png" name="Postman" />
          <Tool img="postgre.png" name="PostgreSQL" />
          <Tool img="graphql.png" name="GraphQL" />
        </Stack>
      </TextContent>
      <TextContent>
        <Title id="certs">
          Certifications
          <span>
            <a href="#certs">#</a>
          </span>
        </Title>
        <Chapter>
          Whenever I have time and interest, I keep on improving my skills
          through training, education and certifications.
        </Chapter>
        <Stack>
          <Tool
            img="deep.jfif"
            name="Machine Learning Specialization"
            description="Supervised machine learning: regression and classification, advanced learning algorithms, unsupervised learning, recommenders, reinforcement learning. | DeepLearning.AI, Standford Online"
            big
          />
          <Tool
            img="deep.jfif"
            name="Generative AI for Software Development"
            description="Generative AI for Software Development, Team Software Engineering with AI, AI-Powered Software and System Design. | DeepLearning.AI"
            big
          />
        </Stack>
      </TextContent>
      <TextContent>
        <Title id="ai">
          About AI
          <span>
            <a href="#ai">#</a>
          </span>
        </Title>
        <Chapter>
          To keep this chapter short in order for it to not blow up into a
          massive detailed rant about AI and AI development, I will just say
          that AI can be extremely useful, helpful and a essential tool to have
          in-depth knowledge in. The use of AI has a lot of caveats and dangers
          involving the security, maintainability and the potential negative
          effect on the critical thinking and technical understanding of the
          developers who use it. VIBE-coding can be fun, but if we aim for
          sustainable quality development, we need to keep engineers around who
          still understand the solutions and architecture.
        </Chapter>
        <Chapter>
          PS: No AI was used to write this silly CV application, everything was
          foolishly manually written and the stack is badly outdated.
        </Chapter>
      </TextContent>
      <TextContent>
        <Title id="references">
          References
          <span>
            <a href="#references">#</a>
          </span>
        </Title>
        <Referrer>Tomi Virtanen</Referrer>
        <RefTitle>Manager / Lead Software Engineer / Godtier Dev</RefTitle>
        <Chapter>
          Kalle has deep understanding of modern frontend technologies but can
          also fluently work around the stack. He is a valuable asset to any web
          development team. He has an innate ability to take complex
          requirements and translate them into intuitive, user-friendly
          interfaces. His attention to detail and commitment to delivering
          high-quality code has set a standard that inspires those around him.
          As a lead developer he providers mentorship and helps the more junior
          developers reach their potential. If I would get to pick one person
          for a project I would pick Kalle, as no what is the project, the specs
          or the tech stack, he is the one that you can count on throughout the
          way.
        </Chapter>
        <br />
        <Referrer>Ari-Pekka Hujanen</Referrer>
        <RefTitle>CTO / Senior Manager</RefTitle>
        <Chapter>
          I had the privilege of working with Kalle from the time I first
          started as a consultant on his team. Even back then, he was an
          exceptional engineer who consistently demonstrated a deep
          understanding of software development, a passion for problem-solving,
          and an impressive ability to tackle complex challenges. As I
          transitioned into a senior engineering role and eventually took on a
          direct management position, I saw firsthand how Kalle continued to
          excel in his work. His technical expertise, combined with his
          dedication and attention to detail, made him one of the best engineers
          I've had the pleasure of working with. He consistently delivered
          high-quality solutions and played a key role in the success of our
          team. He was quickly recognized for his exceptional performance,
          earning a well-deserved promotion from Software Engineer to Senior
          Software Engineer. Kalle has a unique ability to grasp difficult
          concepts quickly, contribute to the overall technical strategy, and
          work collaboratively with both engineers and other teams. His
          contributions were pivotal in ensuring the success of many of our
          projects, and his impact on the team was invaluable. His hard work and
          continued growth led him to be promoted once again, this time from
          Senior Software Engineer to Lead Software Engineer (equivalent to
          Staff Engineer in many companies). What truly sets Kalle apart is his
          unwavering commitment to delivering the best possible results, always
          focusing on the highest standards of quality. He is honest, dedicated,
          and consistently puts in the effort to ensure that the work is done
          right. His technical skills and work ethic make him an exceptional
          engineer, and I have no doubt that he would be an asset to any team or
          organization. I wholeheartedly recommend him for any software
          engineering role.
        </Chapter>
        <br />
        <Referrer>Olga Rink</Referrer>
        <RefTitle>Software QA Engineer</RefTitle>
        <Chapter>
          I have been working with Kalle for the past 7 years. He is an
          enthusiastic and positive talent. Kalle consistently takes
          responsibility for new projects and ensures that work is done to a
          high standard. He is the one who leads projects from the
          design/requirement stage to successful releases. With his keen eye for
          UX and insightful suggestions, he has implemented significant
          improvements to both web and mobile apps, highlighting issues and
          providing ready-made solutions. Kalle is also an excellent leader,
          supporting and guiding other developers, helping them to grow. His
          self-motivation, agility, and willingness to take on new
          responsibilities set him apart. During challenging times, he protects
          the team, researches solutions, and shares his knowledge to help
          others. A true asset to any team.
        </Chapter>
        <br />
        <Referrer>Sravanthi Bandaru</Referrer>
        <RefTitle>Fullstack Developer</RefTitle>
        <Chapter>
          I have been working with Kalle for past 3.5years. Kalle possesses an
          exceptional depth of technical expertise across a wide range of
          technologies. He is known for his ability to solve complex problems
          creatively and efficiently. Whether developing new features,
          optimizing existing systems, or troubleshooting critical issues, Kalle
          always demonstrates a high level of skill and cleaner approach. I have
          been fortunate to work with Kalle. From him I learned to approach
          complex problems strategically, apply best practices.
        </Chapter>
        <br />
        <Referrer>Vy Nguyen</Referrer>
        <RefTitle>Software Engineer</RefTitle>
        <Chapter>
          I've had the privilege of working with Kalle, and his expertise in
          frontend development is truly exceptional. No matter the complexity of
          the problem, he always has an effective, well-thought-out solution.
          Beyond technical skills, I've learned a great deal from him about
          planning and structuring work effectively. His ability to guide the
          team with clarity and precision has been inspiring and instrumental in
          my growth. Kalle is a phenomenal leader and a problem-solver, and I'm
          grateful for the opportunity to work under his guidance.
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
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(20, 20, 20, 1) 100%
  );
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
  width: 624px;
  max-width: 100%;
  color: white;
`;
const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 12px;
  & a {
    padding-left: 12px;
    color: #ccc;
    text-decoration: none;
    font-size: 18px;
  }
`;
const Chapter = styled.p`
  font-size: 12px;
  margin: 4px 0;
`;

const EduBall = styled.span`
  color: #286f1a;
`;
const WorkBall = styled.span`
  color: #3340a3;
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  scroll-behavior: smooth;

  @media (max-width: 800px) {
    gap: 4px;
  }
`;

const Referrer = styled.span`
  font-weight: 700;
  font-size: 14px;
`;
const RefTitle = styled.span`
  font-size: 12px;
  color: #ccc;
  padding-bottom: 8px;
`;

const CV = styled.div`
  min-height: 96px;

  @media (max-width: 800px) {
    min-height: 112px;
  }
`;

export default CVPage;
