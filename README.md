# Keikkaryhmä

A weekly calendar for planning gigs. Each day can hold one event with a start
time, a location, a price, the artists performing (each with an optional set time
and genre), a description, and who is interested versus who is definitely going.

The calendar is **read-only for everyone**. Signing in with Google turns on
editing: adding events, changing them and deleting them.

The interface is in Finnish; dates use the `fi` locale from date-fns. `src/text.ts`
holds the labels that have to agree in number, and `formatDate` in `src/dates.ts` is
the single place the locale is applied.

Built with Vite, React, TypeScript and styled-components. Events live in Firestore.

## Structure

| Path                     | What it does                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `src/firebase.ts`        | Firebase app, Firestore instance with an offline cache, and auth                       |
| `src/eventRepository.ts` | Live subscription, writes, and normalisation of stored documents                       |
| `src/useEvents.ts`       | Event state plus read (`syncState`) and write (`writeState`) status                    |
| `src/useAuth.ts`         | Google sign-in, sign-out, and the `canEdit` flag the UI keys off                       |
| `src/types.ts`           | `CalendarEvent` and `Artist`, keyed by `yyyy-MM-dd`                                    |
| `src/dates.ts`           | Week building, month grouping, and formatting (Monday-first)                           |
| `src/links.ts`           | Pulls Spotify/YouTube/etc. links out of a description                                  |
| `src/occupancy.ts`       | Spreads multi-day events over the days they cover                                      |
| `src/text.ts`            | Finnish labels whose wording depends on a count                                        |
| `src/breakpoints.ts`     | The single phone breakpoint shared by every component                                  |
| `src/components/`        | `Calendar`, `DayCell`, `EventList`, `ViewSwitch`, `AccountButton`, and the modal below |

The modal is split three ways: `Modal` is the shell, `EventDetails` the read-only
body, and `EventForm` the editable one. `EventModal` picks between them on `canEdit`.

The calendar view renders one whole month at a time and loads six months per click.
Each month is padded out to complete weeks; the padding days belong to the
neighbouring month and are greyed, so a day near a boundary appears in both months.
`WeekdayRow` sits in the sticky header rather than in the grid, and shares its
column template with the day grid through `calendarGrid.ts`.

An event covers `days` calendar days from its start date. `buildOccupancy` spreads
it across them so each day can render it; a day that another event _starts_ on
always keeps that event, so the two never fight over a cell. `soldOut` adds a red
border and badge in the list and the grid, and a banner in the details view.

The previous CV implementation is archived in `src-cv/` (not built or linted).

## Firestore

Events are stored in the **`calendar-events`** collection of the `housework-a9d38`
project, the same project the legacy app in `legacy-app/` uses. One document per
day, with the `yyyy-MM-dd` date as the document id.

Anyone may read the calendar; only a signed-in user may write to it. Add this to
the project's rules in the Firebase console, alongside whatever rules the legacy
app already has:

```
match /calendar-events/{eventId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

> **Any Google account that signs in can edit or delete every event** — the rule
> checks that someone is signed in, not who they are. To limit it to specific
> people, list their uids:
>
> ```
> allow write: if request.auth != null
>   && request.auth.uid in ['uid-one', 'uid-two'];
> ```
>
> A signed-in uid is visible in Firebase console → Authentication → Users.

Until the rule is in place the header reads _"Ei tallennettu — tunnuksellasi ei ole
muokkausoikeutta"_ and every edit is rolled back.

Sign-in uses a Google popup. The domain the app is served from must be listed under
Firebase console → Authentication → Settings → Authorized domains; `localhost` is
there by default, and `cunen.github.io` needs to be too.

Firestore's local cache is enabled, so the calendar still opens and accepts edits
while offline; they sync on reconnect.

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
