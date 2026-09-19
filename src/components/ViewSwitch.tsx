import styled from 'styled-components';
import { phone } from '../breakpoints';

export type View = 'list' | 'calendar';

type Props = {
  view: View;
  onChange: (view: View) => void;
};

const OPTIONS: { value: View; label: string }[] = [
  { value: 'list', label: 'Lista' },
  { value: 'calendar', label: 'Kalenteri' },
];

const ViewSwitch = ({ view, onChange }: Props) => (
  <Switch role="tablist" aria-label="Näkymä">
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

  ${phone} {
    padding: 2px;
  }
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

  ${phone} {
    /* Narrow enough to sit next to the title on the smallest phones. */
    padding: 6px 11px;
    font-size: 12px;
  }
`;

export default ViewSwitch;
