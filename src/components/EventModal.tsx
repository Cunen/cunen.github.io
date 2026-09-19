import { useState } from 'react';
import styled from 'styled-components';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import Modal from './Modal';
import {
  formatCompactDate,
  formatDate,
  formatLongDate,
  fromDateKey,
} from '../dates';
import { lastDayOf } from '../occupancy';
import { useIsPhone } from '../useIsPhone';
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
  // Deleting is one tap away from the form, so it asks before it happens.
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isPhone = useIsPhone();

  /** Saved events edit in place; a draft is only persisted once it is created. */
  const update = (patch: Partial<CalendarEvent>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (isExisting) onSave(next);
  };

  // A multi-day event names both ends, so the header matches what the grid
  // shows. On a phone the weekday and the month shrink to their short forms,
  // which is what leaves room for the closing button beside them.
  const weekday = isPhone ? 'EEEEEE' : 'EEEE';
  const start = fromDateKey(draft.date);
  const eyebrow =
    draft.days > 1
      ? `${formatDate(start, `${weekday} d.M.`)} – ${formatDate(lastDayOf(draft), `${weekday} d.M.yyyy`)}`
      : isPhone
        ? formatCompactDate(start)
        : formatLongDate(start);
  const label = isExisting ? draft.title || 'Keikka' : 'Uusi keikka';

  if (!canEdit) {
    return (
      <Modal
        eyebrow={eyebrow}
        label={label}
        onClose={onClose}
        action={
          <PrimaryButton type="button" onClick={onClose}>
            Sulje
          </PrimaryButton>
        }
        footer={
          <SecondaryButton type="button" onClick={onSignIn}>
            Kirjaudu Googlella
          </SecondaryButton>
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
      action={
        isExisting ? (
          <PrimaryButton type="button" onClick={onClose}>
            Valmis
          </PrimaryButton>
        ) : (
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
        )
      }
      footer={
        !isExisting ? (
          <CancelButton type="button" onClick={onClose}>
            Peruuta
          </CancelButton>
        ) : confirmingDelete ? (
          <Confirm>
            <ConfirmQuestion>Poistetaanko keikka?</ConfirmQuestion>
            <ConfirmButtons>
              <CancelButton
                type="button"
                onClick={() => setConfirmingDelete(false)}
              >
                Peruuta
              </CancelButton>
              <DangerButton type="button" onClick={onDelete}>
                Poista
              </DangerButton>
            </ConfirmButtons>
          </Confirm>
        ) : (
          <DeleteButton type="button" onClick={() => setConfirmingDelete(true)}>
            Poista
          </DeleteButton>
        )
      }
    >
      {/* Landing in the name field is right for a blank event and wrong for one
          that is already named: it would pop the keyboard over what you opened. */}
      <EventForm draft={draft} autoFocusTitle={!isExisting} onChange={update} />
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

/** Replaces the delete button in place, so the answer is where the question is. */
const Confirm = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 12px;
`;

const ConfirmQuestion = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--danger);
`;

const ConfirmButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DangerButton = styled(FooterButton)`
  border-color: var(--danger);
  background: var(--danger);
  font-weight: 600;
  color: var(--on-danger);
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
