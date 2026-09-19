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

  // Two buttons, always in the same places: the destructive one on the left,
  // the one that finishes and closes the modal on the right.
  if (!canEdit) {
    return (
      <Modal
        eyebrow={eyebrow}
        label={label}
        onClose={onClose}
        footer={
          <>
            <SecondaryButton type="button" onClick={onSignIn}>
              Kirjaudu Googlella
            </SecondaryButton>
            <PrimaryButton type="button" onClick={onClose}>
              Sulje
            </PrimaryButton>
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
              Poista
            </DeleteButton>
            <PrimaryButton type="button" onClick={onClose}>
              Valmis
            </PrimaryButton>
          </>
        ) : (
          <>
            <CancelButton type="button" onClick={onClose}>
              Peruuta
            </CancelButton>
            <PrimaryButton
              type="button"
              disabled={draft.title.trim().length === 0}
              onClick={() => {
                onSave(draft);
                onClose();
              }}
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

const FooterButton = styled.button`
  border: 1px solid var(--line);
  border-radius: 9px;
  background: none;
  padding: 9px 14px;
  cursor: pointer;
  white-space: nowrap;
`;

const DeleteButton = styled(FooterButton)`
  color: var(--danger);

  &:hover {
    border-color: var(--danger);
  }
`;

const CancelButton = styled(FooterButton)`
  color: var(--muted);

  &:hover {
    border-color: var(--line-strong);
    color: var(--text);
  }
`;

const SecondaryButton = styled(FooterButton)`
  background: var(--surface-muted);
  font-weight: 500;

  &:hover {
    border-color: var(--accent);
  }
`;

const PrimaryButton = styled.button`
  border: 0;
  border-radius: 9px;
  background: var(--accent);
  padding: 10px 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export default EventModal;
