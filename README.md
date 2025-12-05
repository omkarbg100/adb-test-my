# Adbrew Test 

This repository is a small full-stack example (React frontend + Django REST backend + MongoDB) packaged with Docker Compose. The project has been updated so the backend persists todos to MongoDB and the frontend uses React Hooks to fetch and post todos.

**Quick Overview**
- Frontend: `src/app` — Create React App; dev server runs on `http://localhost:3000`.
- Backend API: `src/rest` — Django REST Framework; endpoints exposed on `http://localhost:8000`.
- Database: MongoDB container, data under `test_db.todos`.

**What I implemented / changed**
- **Backend**
  - `src/rest/rest/views.py`: Implemented `GET /todos/` (returns all todos) and `POST /todos/` (create todo). Uses `pymongo` and the `test_db.todos` collection. Documents returned include `_id` as a string.
  - `src/rest/rest/urls.py`: Added a root health endpoint (`/`) and wired `todos/` to `TodoListView`.
  - `src/rest/rest/settings.py`: Made settings environment-driven (secret key, debug, allowed hosts, CORS) and added console logging for container-friendly output.
  - `src/rest/manage.py`, `src/rest/rest/wsgi.py`, `src/rest/rest/asgi.py`: Improved sys.path handling and allowed `DJANGO_SETTINGS_MODULE` overrides to be robust when the project is mounted in containers.
  - `src/rest/rest/__init__.py`: Added package `__version__` and a NullHandler for safe logging.
- **Frontend**
  - `src/app/src/App.js`: Replaced the hardcoded UI with a React Hooks implementation that:
    - Fetches `GET http://localhost:8000/todos/` on load.
    - Posts new todos to `POST http://localhost:8000/todos/` and updates the UI.
    - Shows loading/error/submitting states.
  - `src/app/src/App.css`: Added a clean, responsive style sheet for the app.
  - `src/app/package.json`: (unchanged) CRA-based dependencies; uses browser `fetch` — no additional packages required.
- **Docker / Compose**
  - `docker-compose.yml`: Ensure `api` container receives `MONGO_HOST` and `MONGO_PORT` (set to `mongo` and `27017`) so the Django backend can connect to the Mongo container. `depends_on` ordering added for clarity.

Important: The backend intentionally does not use Django models/serializers/SQLite for todo persistence — it talks directly to Mongo as required by the test.

Requirements (already in the repo)
- `src/requirements.txt` — includes `pymongo` and other Python dependencies.
- `src/app/package.json` — Create React App config.

Quick start (PowerShell on Windows)
1. Set the repo path for Docker Compose (used by the `docker-compose.yml` volume mounts):
```powershell
$env:ADBREW_CODEBASE_PATH = 'D:\projects\fork\adb_test'
```
