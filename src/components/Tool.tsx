import styled from 'styled-components';

interface ToolProps {
  img: string;
  name: string;
  description?: string;
  big?: boolean;
}

function Tool({ img, name, description, big }: ToolProps) {
  return (
    <Wrapper $big={big}>
      <Image $img={img} />
      <DescWrap>
        <Description>{name}</Description>
        {description && <Description>{description}</Description>}
      </DescWrap>
    </Wrapper>
  );
}

export default Tool;

const Wrapper = styled.div<{ $big?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$big ? 'row' : 'column')};
  border: 1px solid #313131;
  width: ${(props) => (props.$big ? '100%' : '96px')};
  border-radius: 4px;
  overflow: hidden;
  flex: 0 1 auto;
`;

const Image = styled.div<{ $img: string }>`
  display: flex;
  width: 96px;
  min-width: 96px;
  height: 96px;
  background-image: url(${(props) => 'tools/' + props.$img});
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
`;

const Description = styled.span`
  padding: 4px 8px;
  font-size: 10px;
`;

const DescWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
