import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import ArtistList from './ArtistList';
import ChipList from './ChipList';
import { detectLinks } from '../links';
import { MAX_EVENT_DAYS } from '../types';
import type { CalendarEvent } from '../types';

const DAY_OPTIONS = Array.from(
  { length: MAX_EVENT_DAYS },
  (_, index) => index + 1
);

const dayOptionLabel = (days: number) =>
  `${days} ${days === 1 ? 'päivä' : 'päivää'}`;

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
        placeholder="Keikan nimi"
        onChange={(event) => onChange({ title: event.target.value })}
        aria-label="Keikan nimi"
      />

      <Row>
        <Field>
          <Label htmlFor="event-time">Alkaa</Label>
          <Input
            id="event-time"
            type="time"
            value={draft.startTime}
            onChange={(event) => onChange({ startTime: event.target.value })}
          />
        </Field>
        <Field $grow>
          <Label htmlFor="event-location">Missä</Label>
          <Input
            id="event-location"
            value={draft.location}
            placeholder="Paikka tai osoite"
            onChange={(event) => onChange({ location: event.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="event-price">Hinta</Label>
          <PriceInput
            id="event-price"
            value={draft.price}
            placeholder="20 € / ilmainen"
            onChange={(event) => onChange({ price: event.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="event-days">Kesto</Label>
          <DaySelect
            id="event-days"
            value={draft.days}
            onChange={(event) => onChange({ days: Number(event.target.value) })}
          >
            {DAY_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {dayOptionLabel(days)}
              </option>
            ))}
          </DaySelect>
        </Field>
      </Row>

      <SoldOutToggle>
        <input
          id="event-sold-out"
          type="checkbox"
          checked={draft.soldOut}
          onChange={(event) => onChange({ soldOut: event.target.checked })}
        />
        <label htmlFor="event-sold-out">Loppuunmyyty</label>
      </SoldOutToggle>

      <ArtistList
        artists={draft.artists}
        onChange={(artists) => onChange({ artists })}
      />

      <Field>
        <Label htmlFor="event-description">Kuvaus</Label>
        <Textarea
          id="event-description"
          value={draft.description}
          placeholder="Mitä muuta kannattaa tietää. Liitä tähän Spotify-, YouTube- tai lippulinkit."
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
        label="Kiinnostuneet"
        tone="interested"
        values={draft.interested}
        placeholder="Ketkä ehkä tulevat?"
        hint="klikkaa nimeä siirtääksesi tulossa-listalle"
        onChange={(interested) => onChange({ interested })}
        onChipClick={(name) => moveTo('going', name)}
      />
      <ChipList
        label="Tulossa"
        tone="going"
        values={draft.going}
        placeholder="Ketkä ovat varmasti mukana?"
        hint="klikkaa nimeä siirtääksesi takaisin kiinnostuneisiin"
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

const DaySelect = styled.select`
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-muted);
  padding: 9px 10px;
  font: inherit;
  color: var(--text);

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const SoldOutToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -6px;

  input {
    width: 16px;
    height: 16px;
    accent-color: var(--danger);
    cursor: pointer;
  }

  label {
    cursor: pointer;
  }
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
