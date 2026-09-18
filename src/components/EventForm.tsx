import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import ArtistList from './ArtistList';
import ChipList from './ChipList';
import { detectLinks } from '../links';
import type { CalendarEvent } from '../types';

type Props = {
  draft: CalendarEvent;
  onChange: (patch: Partial<CalendarEvent>) => void;
};

const EventForm = ({ draft, onChange }: Props) => {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const moveTo = (list: 'interested' | 'going', name: string) => {
    const other = list === 'going' ? 'interested' : 'going';
    onChange({
      [list]: draft[list].includes(name) ? draft[list] : [...draft[list], name],
      [other]: draft[other].filter((value) => value !== name),
    });
  };

  const links = useMemo(
    () => detectLinks(draft.description),
    [draft.description]
  );

  return (
    <>
      <TitleInput
        ref={titleRef}
        value={draft.title}
        placeholder="Event name"
        onChange={(event) => onChange({ title: event.target.value })}
        aria-label="Event name"
      />

      <Row>
        <Field>
          <Label htmlFor="event-time">Starts</Label>
          <Input
            id="event-time"
            type="time"
            value={draft.startTime}
            onChange={(event) => onChange({ startTime: event.target.value })}
          />
        </Field>
        <Field $grow>
          <Label htmlFor="event-location">Where</Label>
          <Input
            id="event-location"
            value={draft.location}
            placeholder="Venue or address"
            onChange={(event) => onChange({ location: event.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="event-price">Price</Label>
          <PriceInput
            id="event-price"
            value={draft.price}
            placeholder="20 € / free"
            onChange={(event) => onChange({ price: event.target.value })}
          />
        </Field>
      </Row>

      <ArtistList
        artists={draft.artists}
        onChange={(artists) => onChange({ artists })}
      />

      <Field>
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          value={draft.description}
          placeholder="Anything worth knowing. Paste Spotify, YouTube or ticket links here."
          rows={3}
          onChange={(event) => onChange({ description: event.target.value })}
        />
        {links.length > 0 && (
          <Links>
            {links.map((link) => (
              <LinkChip
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                title={link.url}
              >
                {link.label} &#8599;
              </LinkChip>
            ))}
          </Links>
        )}
      </Field>

      <ChipList
        label="Interested"
        tone="interested"
        values={draft.interested}
        placeholder="Who might come?"
        hint="click a name to move it to going"
        onChange={(interested) => onChange({ interested })}
        onChipClick={(name) => moveTo('going', name)}
      />
      <ChipList
        label="Going"
        tone="going"
        values={draft.going}
        placeholder="Who is definitely in?"
        hint="click a name to move it back to interested"
        onChange={(going) => onChange({ going })}
        onChipClick={(name) => moveTo('interested', name)}
      />
    </>
  );
};

const TitleInput = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  padding: 2px 0 6px;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-bottom-color: var(--accent);
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Field = styled.div<{ $grow?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: ${({ $grow }) => ($grow ? '1 1 160px' : '0 0 auto')};
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Input = styled.input`
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-muted);
  padding: 9px 10px;
  color: var(--text);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const PriceInput = styled(Input)`
  width: 104px;
`;

const Textarea = styled.textarea`
  width: 100%;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-muted);
  padding: 9px 10px;
  font: inherit;
  color: var(--text);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const LinkChip = styled.a`
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--accent-soft);
  padding: 3px 10px;
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;

  &:hover {
    border-color: var(--accent);
  }
`;

export default EventForm;
