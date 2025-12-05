# Frontend (Create React App)

This folder contains the React frontend for the Adbrew test. The app is a small single-page UI that lists TODOs and lets you create new TODOs. It was implemented using React Hooks and uses the browser `fetch` API to talk to the backend.

**Quick Summary**
- Framework: Create React App (React 17)
- Key files:
  - `src/App.js` — React Hooks implementation: fetches `GET /todos/`, posts to `POST /todos/`, shows loading/error states.
  - `src/App.css` — Simple responsive styles for the UI.
- No additional HTTP libraries are required — native `fetch` is used.

**Behavior**
- On load the app calls `GET http://localhost:8000/todos/` and renders the returned list.
- When you submit the form the app `POST`s `{ todo: "text" }` to `http://localhost:8000/todos/` and prepends the created item to the list on success.
- The UI shows simple loading and error messages and disables the submit button while posting.

**Scripts**
- `yarn start` — Runs the dev server (open `http://localhost:3000`).
- `yarn build` — Creates a production build in `build/`.
- `yarn test` — Runs tests (CRA behavior).
- `yarn eject` — Ejects config (one-way).

Run locally (developer machine)
1. From the app folder:
```bash
cd src/app
yarn install
yarn start
```
