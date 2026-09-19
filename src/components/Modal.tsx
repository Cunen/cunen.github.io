import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { phone } from '../breakpoints';

type Props = {
  /** Small uppercase line in the header, above the content. */
  eyebrow: string;
  label: string;
  children: ReactNode;
  /** The action row; it stays put while the body scrolls under it. */
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

  // The page behind stays where it was: without this the calendar scrolls under
  // the dialog, and on a phone the whole overlay pans with the finger. Pinning
  // the body rather than hiding its overflow is what keeps the scroll position,
  // and the padding stands in for the scrollbar that goes with it.
  useEffect(() => {
    const { body, documentElement } = document;
    const offset = window.scrollY;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previous = body.style.cssText;
    body.style.position = 'fixed';
    body.style.top = `-${offset}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.cssText = previous;
      window.scrollTo(0, offset);
    };
  }, []);

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
  /* Measured against the visible viewport, so a phone's toolbars never hide
     the footer underneath themselves. */
  height: 100dvh;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow: hidden;
  background: var(--overlay);

  ${phone} {
    padding: 0;
    align-items: stretch;
  }
`;

/** A fixed frame: header and footer hold their place, only `Body` scrolls. */
const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  width: min(520px, 100%);
  max-height: 100%;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;

  ${phone} {
    height: 100%;
    border: 0;
    border-radius: 0;
  }
`;

const Header = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
`;

const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  /* Scrolling to the end of the form must not start scrolling the page behind. */
  overscroll-behavior: contain;
`;

const Footer = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
  background: var(--surface);

  ${phone} {
    /* Clears the home indicator on phones that have one. */
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
`;

export default Modal;
