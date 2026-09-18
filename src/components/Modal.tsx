import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { phone } from '../breakpoints';

type Props = {
  /** Small uppercase line in the header, above the content. */
  eyebrow: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

const Modal = ({ eyebrow, label, children, footer, onClose }: Props) => {
  useEffect(() => {
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <Overlay onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <Header>
          <Eyebrow>{eyebrow}</Eyebrow>
          <CloseButton type="button" onClick={onClose} aria-label="Close">
            &times;
          </CloseButton>
        </Header>

        <Body>{children}</Body>

        {footer && <Footer>{footer}</Footer>}
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

  ${phone} {
    padding: 0;
    align-items: stretch;
  }
`;

const Dialog = styled.div`
  width: min(520px, 100%);
  margin: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow);

  ${phone} {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    margin: 0;
    border: 0;
    border-radius: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);

  ${phone} {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--surface);
  }
`;

const Eyebrow = styled.span`
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

  ${phone} {
    flex: 1;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);

  ${phone} {
    position: sticky;
    bottom: 0;
    background: var(--surface);
  }
`;

export default Modal;
