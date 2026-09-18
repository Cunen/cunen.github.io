import styled from 'styled-components';

export type View = 'list' | 'calendar';

type Props = {
  view: View;
  onChange: (view: View) => void;
};

const OPTIONS: { value: View; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'calendar', label: 'Calendar' },
];

const ViewSwitch = ({ view, onChange }: Props) => (
  <Switch role="tablist" aria-label="View">
    {OPTIONS.map((option) => (
      <Option
        key={option.value}
        type="button"
        role="tab"
        aria-selected={view === option.value}
        $active={view === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Option>
    ))}
  </Switch>
);

const Switch = styled.div`
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-muted);
`;

const Option = styled.button<{ $active: boolean }>`
  border: 0;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  background: ${({ $active }) => ($active ? 'var(--surface)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--text)' : 'var(--muted)')};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgb(0 0 0 / 12%)' : 'none'};
  cursor: pointer;

  &:hover {
    color: var(--text);
  }
`;

export default ViewSwitch;
