import { useState } from 'react';
import styled from 'styled-components';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import Modal from './Modal';
import { formatDate, formatLongDate, fromDateKey } from '../dates';
import { lastDayOf } from '../occupancy';
import type { CalendarEvent } from '../types';

type Props = {
  event: CalendarEvent;
  /** False while the event is still a draft that has never been saved. */
  isExisting: boolean;
  /** Signed-out visitors get the read-only view. */
  canEdit: boolean;
  onSave: (event: CalendarEvent) => void;
  onDelete: () => void;
  onClose: () => void;
  onSignIn: () => void;
};

const EventModal = ({
  event,
  isExisting,
  canEdit,
  onSave,
  onDelete,
  onClose,
  onSignIn,
}: Props) => {
  const [draft, setDraft] = useState(event);

  /** Saved events edit in place; a draft is only persisted once it is created. */
  const update = (patch: Partial<CalendarEvent>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (isExisting) onSave(next);
  };

  // A multi-day event names both ends, so the header matches what the grid shows.
  const eyebrow =
    draft.days > 1
      ? `${formatDate(fromDateKey(draft.date), 'EEEE d.M.')} – ${formatDate(lastDayOf(draft), 'EEEE d.M.yyyy')}`
      : formatLongDate(fromDateKey(draft.date));
  const label = isExisting ? draft.title || 'Keikka' : 'Uusi keikka';

  if (!canEdit) {
    return (
      <Modal
        eyebrow={eyebrow}
        label={label}
        onClose={onClose}
        footer={
          <>
            <Note>Kirjaudu sisään muokataksesi</Note>
            <SecondaryButton type="button" onClick={onSignIn}>
              Kirjaudu Googlella
            </SecondaryButton>
          </>
        }
      >
        <EventDetails event={draft} />
      </Modal>
    );
  }

  return (
    <Modal
      eyebrow={eyebrow}
      label={label}
      onClose={onClose}
      footer={
        isExisting ? (
          <>
            <DeleteButton type="button" onClick={onDelete}>
              Poista keikka
            </DeleteButton>
            <Note>Tallennetaan automaattisesti</Note>
          </>
        ) : (
          <>
            <Spacer />
            <PrimaryButton
              type="button"
              disabled={draft.title.trim().length === 0}
              onClick={() => onSave(draft)}
            >
              Lisää keikka
            </PrimaryButton>
          </>
        )
      }
    >
      <EventForm draft={draft} onChange={update} />
    </Modal>
  );
};

const Spacer = styled.div`
  flex: 1;
`;

const Note = styled.span`
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

const SecondaryButton = styled.button`
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface-muted);
  padding: 8px 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: var(--accent);
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
