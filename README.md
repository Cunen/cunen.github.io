# Calendar

A weekly calendar for planning events. Each day can hold one event with a start
time, a location, the artists performing, and who is interested versus who is
definitely going.

Built with Vite, React, TypeScript and styled-components. Data lives in
`localStorage` under `calendar.events.v1` until there is a real database.

## Structure

| Path               | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `src/types.ts`     | The `CalendarEvent` shape, keyed by `yyyy-MM-dd` |
| `src/storage.ts`   | localStorage read/write, with validation on read |
| `src/useEvents.ts` | Event state, persisted on every change           |
| `src/dates.ts`     | Week building and formatting (Monday-first)      |
| `src/components/`  | `Calendar`, `DayCell`, `EventModal`, `ChipList`  |

The previous CV implementation is archived in `src-cv/` (not built or linted).

## Running

```bash
npm start
```

## Formatting

```bash
npm run format
```

## Deploying

Deployed using gh-pages to http://cunen.github.io

```bash
npm run deploy
```
