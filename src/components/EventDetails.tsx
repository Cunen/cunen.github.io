import styled from 'styled-components';
import { detectLinks } from '../links';
import type { CalendarEvent } from '../types';

type Props = { event: CalendarEvent };

/** The signed-out view: everything an event holds, nothing editable. */
const EventDetails = ({ event }: Props) => {
  const facts = [
    event.startTime && { label: 'Starts', value: event.startTime },
    event.location && { label: 'Where', value: event.location },
    event.price && { label: 'Price', value: event.price },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  const links = detectLinks(event.description);

  return (
    <>
      <Title>{event.title || 'Untitled event'}</Title>

      {facts.length > 0 && (
        <Facts>
          {facts.map((fact) => (
            <Fact key={fact.label}>
              <Label>{fact.label}</Label>
              <Value>{fact.value}</Value>
            </Fact>
          ))}
        </Facts>
      )}

      {event.artists.length > 0 && (
        <Section>
          <Label>Artists</Label>
          <Artists>
            {event.artists.map((artist) => (
              <Artist key={artist.id}>
                <ArtistName>{artist.name}</ArtistName>
                {artist.time && <ArtistMeta>{artist.time}</ArtistMeta>}
                {artist.genre && <ArtistMeta>{artist.genre}</ArtistMeta>}
              </Artist>
            ))}
          </Artists>
        </Section>
      )}

      {event.description && (
        <Section>
          <Label>Description</Label>
          <Description>{event.description}</Description>
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
        </Section>
      )}

      {event.going.length > 0 && (
        <Section>
          <Label>Going</Label>
          <Names>
            {event.going.map((name) => (
              <GoingChip key={name}>{name}</GoingChip>
            ))}
          </Names>
        </Section>
      )}

      {event.interested.length > 0 && (
        <Section>
          <Label>Interested</Label>
          <Names>
            {event.interested.map((name) => (
              <InterestedChip key={name}>{name}</InterestedChip>
            ))}
          </Names>
        </Section>
      )}
    </>
  );
};

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const Facts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
`;

const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Value = styled.span`
  overflow-wrap: anywhere;
`;

const Artists = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Artist = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
`;

const ArtistName = styled.span`
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const ArtistMeta = styled.span`
  font-size: 12px;
  color: var(--muted);
`;

const Description = styled.p`
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
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

const Names = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 13px;
`;

const GoingChip = styled(Chip)`
  background: var(--going-soft);
  color: var(--going);
`;

const InterestedChip = styled(Chip)`
  background: var(--interested-soft);
  color: var(--interested);
`;

export default EventDetails;
