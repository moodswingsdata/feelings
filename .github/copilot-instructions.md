# Copilot Instructions for feelings

## Commands

- **Start an http server**: `uv run python -m http.server -d feelings`

## Architecture

This is a client-side-only, HTML/JavaScript-based search engine for cards in the card game *Mood Swings*. See ./query-language.md for an overview of the queries that users can run. See ./moodswings.d.ts for the data types involved under the hood.

**Key directories:**
- `feelings/` — All HTML, JavaScript, and CSS
- `feelings/data/` — cards.json and printings.json, the core data files to search

## UI

On initial load, the user is presented a fairly minimal UI: a search box + button, some suggested queries to try, and a link to full help. Once they initiate a search, the search box/button animate up to the top of the screen and search results are shown below.

Search results are (by default) a grid of card images, though there are query language constructs which can alter this. The results are paginated, with up to 50 appearing per page. Clicking a result opens a popover with the card image and its most relevant details, plus left/right navigation buttons to cruise through the results. When there's more than one printing for a given card, the popover includes links to load the other printings.

All the states of the UI are hyperlinkable, because navigation modifies the #fragment portion. Users can link to a search result, a particular page of search results, or a card popover.

When a portion of a query can't be resolved, continue the search with the remaining, valid portions. Explain in plain English why a given portion of the query didn't work.

## Conventions

- This is a "single page app", but it doesn't make any dynamic API calls. It loads the UI, search engine, and data model once up front, and then everything is client-side.
- Make sure the query parser has complete test coverage.
- As you build the app, keep the in-product help system updated with all the features of the query language.
- The app is written in raw JavaScript. However, the project is open to the idea of switching to TypeScript and adding a build step _if it's technically necessary_.
- Use real tools. For example, write a real parser, don't just string.split or try to overload regexes.
- It's OK to use outside packages for targeted functionality, but we vendor everything and do _not_ use the NPM ecosystem / tooling.
