import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { phone } from '../breakpoints';
import { useIsPhone } from '../useIsPhone';

type Props = {
  /** Small uppercase line in the header, above the content. */
  eyebrow: string;
  label: string;
  children: ReactNode;
  /**
   * The button that finishes and closes the dialog. On a phone it sits in the
   * header, which the on-screen keyboard never covers; everywhere else it ends
   * the footer row.
   */
  action?: ReactNode;
  /** The rest of the actions — destructive or secondary, never the closing one. */
  footer?: ReactNode;
  onClose: () => void;
};

const Modal = ({
  eyebrow,
  label,
  children,
  action,
  footer,
  onClose,
}: Props) => {
  const isPhone = useIsPhone();

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
          {isPhone && action}
        </Header>

        <Body>
          {children}
          {/* On a phone the remaining actions are just the end of the form, so
              they scroll away with it instead of taking up a permanent strip. */}
          {isPhone && footer && <InlineActions>{footer}</InlineActions>}
        </Body>

        {!isPhone && (footer || action) && (
          <Footer>
            {footer ?? <Spacer />}
            {action}
          </Footer>
        )}
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

/** A fixed frame: the header holds its place, everything under it scrolls. */
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
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);

  ${phone} {
    padding: 10px 12px 10px 16px;
  }
`;

const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);

  ${phone} {
    /* Shares the row with the closing button, so it must not push it off. */
    min-width: 0;
    overflow-wrap: anywhere;
  }
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

  ${phone} {
    /* Clears the home indicator on phones that have one. */
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
`;

const InlineActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
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
`;

const Spacer = styled.div`
  flex: 1;
`;

export default Modal;
