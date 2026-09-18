import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ChipList from './ChipList';
import { formatLongDate } from '../dates';
import type { CalendarEvent } from '../types';

type Props = {
  event: CalendarEvent;
  /** False while the event is still a draft that has never been saved. */
  isExisting: boolean;
  onSave: (event: CalendarEvent) => void;
  onDelete: () => void;
  onClose: () => void;
};

const EventModal = ({
  event,
  isExisting,
  onSave,
  onDelete,
  onClose,
}: Props) => {
  const [draft, setDraft] = useState(event);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  /** Saved events edit in place; a draft is only persisted once it is created. */
  const update = (patch: Partial<CalendarEvent>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (isExisting) onSave(next);
  };

  const moveTo = (list: 'interested' | 'going', name: string) => {
    const other = list === 'going' ? 'interested' : 'going';
    update({
      [list]: draft[list].includes(name) ? draft[list] : [...draft[list], name],
      [other]: draft[other].filter((value) => value !== name),
    });
  };

  const canCreate = draft.title.trim().length > 0;

  return (
    <Overlay onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={isExisting ? draft.title || 'Event' : 'New event'}
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <Header>
          <DateLabel>
            {formatLongDate(new Date(`${draft.date}T00:00:00`))}
          </DateLabel>
          <CloseButton type="button" onClick={onClose} aria-label="Close">
            ×
          </CloseButton>
        </Header>

        <Body>
          <TitleInput
            ref={titleRef}
            value={draft.title}
            placeholder="Event name"
            onChange={(changeEvent) =>
              update({ title: changeEvent.target.value })
            }
            aria-label="Event name"
          />

          <Row>
            <Field>
              <Label htmlFor="event-time">Starts</Label>
              <Input
                id="event-time"
                type="time"
                value={draft.startTime}
                onChange={(changeEvent) =>
                  update({ startTime: changeEvent.target.value })
                }
              />
            </Field>
            <Field $grow>
              <Label htmlFor="event-location">Where</Label>
              <Input
                id="event-location"
                value={draft.location}
                placeholder="Venue or address"
                onChange={(changeEvent) =>
                  update({ location: changeEvent.target.value })
                }
              />
            </Field>
          </Row>

          <ChipList
            label="Artists"
            values={draft.artists}
            placeholder="Add an artist…"
            onChange={(artists) => update({ artists })}
          />
          <ChipList
            label="Interested"
            tone="interested"
            values={draft.interested}
            placeholder="Who might come?"
            hint="click a name to move it to going"
            onChange={(interested) => update({ interested })}
            onChipClick={(name) => moveTo('going', name)}
          />
          <ChipList
            label="Going"
            tone="going"
            values={draft.going}
            placeholder="Who is definitely in?"
            hint="click a name to move it back to interested"
            onChange={(going) => update({ going })}
            onChipClick={(name) => moveTo('interested', name)}
          />
        </Body>

        <Footer>
          {isExisting ? (
            <>
              <DeleteButton type="button" onClick={onDelete}>
                Delete event
              </DeleteButton>
              <Saved>Saved automatically</Saved>
            </>
          ) : (
            <>
              <Spacer />
              <PrimaryButton
                type="button"
                disabled={!canCreate}
                onClick={() => onSave(draft)}
              >
                Add event
              </PrimaryButton>
            </>
          )}
        </Footer>
      </Dialog>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  overflow-y: auto;
  background: var(--overlay);
`;

const Dialog = styled.div`
  width: min(520px, 100%);
  margin: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
`;

const DateLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
`;

const CloseButton = styled.button`
  border: 0;
  background: none;
  padding: 0 4px;
  font-size: 22px;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;

  &:hover {
    color: var(--text);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

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
  flex: ${({ $grow }) => ($grow ? '1 1 200px' : '0 0 auto')};
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Input = styled.input`
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
`;

const Spacer = styled.div`
  flex: 1;
`;

const Saved = styled.span`
  font-size: 12px;
  color: var(--muted);
`;

const DeleteButton = styled.button`
  border: 1px solid var(--line);
  border-radius: 9px;
  background: none;
  padding: 8px 12px;
  color: var(--danger);
  cursor: pointer;

  &:hover {
    border-color: var(--danger);
  }
`;

const PrimaryButton = styled.button`
  border: 0;
  border-radius: 9px;
  background: var(--accent);
  padding: 9px 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export default EventModal;
