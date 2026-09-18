import { useState } from 'react';
import styled from 'styled-components';
import { phone } from '../breakpoints';
import { createArtist } from '../types';
import type { Artist } from '../types';

type Props = {
  artists: Artist[];
  onChange: (next: Artist[]) => void;
};

const ArtistList = ({ artists, onChange }: Props) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [genre, setGenre] = useState('');
  // A half-typed `<input type="time">` reports an empty value, so clearing state
  // leaves the typed segments on screen. Remounting the row is what actually resets it.
  const [draftKey, setDraftKey] = useState(0);

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...artists, createArtist(trimmed, time, genre.trim())]);
    setName('');
    setTime('');
    setGenre('');
    setDraftKey((key) => key + 1);
  };

  const edit = (id: string, patch: Partial<Artist>) =>
    onChange(
      artists.map((artist) =>
        artist.id === id ? { ...artist, ...patch } : artist
      )
    );

  const remove = (id: string) =>
    onChange(artists.filter((artist) => artist.id !== id));

  const addOnEnter = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    add();
  };

  return (
    <Field>
      <Label>Artists</Label>

      {artists.length > 0 && (
        <Rows>
          {artists.map((artist) => (
            <Row key={artist.id}>
              <NameInput
                value={artist.name}
                placeholder="Name"
                onChange={(event) =>
                  edit(artist.id, { name: event.target.value })
                }
                aria-label="Artist name"
              />
              <TimeInput
                type="time"
                value={artist.time}
                onChange={(event) =>
                  edit(artist.id, { time: event.target.value })
                }
                aria-label={`Set time for ${artist.name || 'artist'}`}
              />
              <GenreInput
                value={artist.genre}
                placeholder="Genre"
                onChange={(event) =>
                  edit(artist.id, { genre: event.target.value })
                }
                aria-label={`Genre for ${artist.name || 'artist'}`}
              />
              <RemoveButton
                type="button"
                onClick={() => remove(artist.id)}
                aria-label={`Remove ${artist.name || 'artist'}`}
              >
                ×
              </RemoveButton>
            </Row>
          ))}
        </Rows>
      )}

      <Row key={draftKey}>
        <NameInput
          value={name}
          placeholder={artists.length ? 'Add another artist' : 'Artist name'}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={addOnEnter}
          aria-label="New artist name"
        />
        <TimeInput
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          onKeyDown={addOnEnter}
          aria-label="New artist set time"
        />
        <GenreInput
          value={genre}
          placeholder="Genre"
          onChange={(event) => setGenre(event.target.value)}
          onKeyDown={addOnEnter}
          aria-label="New artist genre"
        />
        <AddButton type="button" onClick={add} disabled={!name.trim()}>
          Add
        </AddButton>
      </Row>
      <Note>Time and genre are optional.</Note>
    </Field>
  );
};

const Field = styled.div`
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

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 108px 120px 30px;
  gap: 6px;
  align-items: center;

  ${phone} {
    /* Name takes its own line; time and genre share the next one. */
    grid-template-columns: 1fr 1fr 44px;
    grid-template-areas:
      'name name remove'
      'time genre genre';
    row-gap: 6px;
  }
`;

const Input = styled.input`
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface-muted);
  padding: 8px 10px;
  color: var(--text);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const NameInput = styled(Input)`
  ${phone} {
    grid-area: name;
  }
`;

const TimeInput = styled(Input)`
  ${phone} {
    grid-area: time;
  }
`;

const GenreInput = styled(Input)`
  ${phone} {
    grid-area: genre;
  }
`;

const RemoveButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;

  &:hover {
    color: var(--danger);
  }

  ${phone} {
    grid-area: remove;
  }
`;

const AddButton = styled.button`
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface-muted);
  padding: 8px 4px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${phone} {
    grid-area: remove;
    padding: 8px 0;
    font-size: 11px;
  }
`;

const Note = styled.span`
  font-size: 11px;
  color: var(--muted);
`;

export default ArtistList;
