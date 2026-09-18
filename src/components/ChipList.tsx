import { useState } from 'react';
import styled from 'styled-components';

export type ChipTone = 'neutral' | 'interested' | 'going';

type Props = {
  label: string;
  values: string[];
  tone?: ChipTone;
  placeholder: string;
  /** Rendered next to the label as a quiet affordance hint. */
  hint?: string;
  onChange: (next: string[]) => void;
  /** When set, clicking a chip body triggers this instead of doing nothing. */
  onChipClick?: (value: string) => void;
};

const ChipList = ({
  label,
  values,
  tone = 'neutral',
  placeholder,
  hint,
  onChange,
  onChipClick,
}: Props) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    // Names are the identity here, so keep them unique per list.
    if (!values.some((value) => value.toLowerCase() === name.toLowerCase())) {
      onChange([...values, name]);
    }
    setDraft('');
  };

  const remove = (name: string) =>
    onChange(values.filter((value) => value !== name));

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
      return;
    }
    if (event.key === 'Backspace' && !draft && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <Field>
      <LabelRow>
        <Label>{label}</Label>
        {hint && values.length > 0 && <Hint>{hint}</Hint>}
      </LabelRow>
      <Chips>
        {values.map((value) => (
          <Chip key={value} $tone={tone}>
            <ChipBody
              type="button"
              $clickable={Boolean(onChipClick)}
              onClick={onChipClick ? () => onChipClick(value) : undefined}
              disabled={!onChipClick}
              title={onChipClick ? hint : undefined}
            >
              {value}
            </ChipBody>
            <ChipRemove
              type="button"
              onClick={() => remove(value)}
              aria-label={`Poista ${value}`}
            >
              ×
            </ChipRemove>
          </Chip>
        ))}
        <ChipInput
          value={draft}
          placeholder={values.length ? 'Lisää…' : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={add}
          aria-label={label}
        />
      </Chips>
    </Field>
  );
};

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Hint = styled.span`
  font-size: 11px;
  color: var(--muted);
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 6px;
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-muted);

  &:focus-within {
    border-color: var(--accent);
  }
`;

const toneColors = {
  neutral: { fg: 'var(--text)', bg: 'var(--surface)' },
  interested: { fg: 'var(--interested)', bg: 'var(--interested-soft)' },
  going: { fg: 'var(--going)', bg: 'var(--going-soft)' },
} as const;

const Chip = styled.span<{ $tone: ChipTone }>`
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: ${({ $tone }) => toneColors[$tone].bg};
  color: ${({ $tone }) => toneColors[$tone].fg};
  font-size: 13px;
  overflow: hidden;
`;

const ChipBody = styled.button<{ $clickable: boolean }>`
  border: 0;
  background: none;
  padding: 3px 4px 3px 10px;
  color: inherit;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const ChipRemove = styled.button`
  border: 0;
  background: none;
  padding: 3px 8px 3px 2px;
  font-size: 15px;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;

  &:hover {
    color: var(--danger);
  }
`;

const ChipInput = styled.input`
  flex: 1;
  min-width: 90px;
  border: 0;
  background: none;
  padding: 3px 4px;
  color: var(--text);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
  }
`;

export default ChipList;
