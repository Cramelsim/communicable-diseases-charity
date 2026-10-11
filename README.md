# Communicable Diseases Charity

A platform that helps people learn about the most prevalent communicable diseases, see the areas
they affect most, share how they would like to help, and donate to affected areas.

- **Backend:** Python / Django + Django REST Framework (JWT auth), PostgreSQL
- **Frontend:** React + Redux Toolkit (mobile-first)
- **Tests:** Django test framework (backend, Minitest-style `unittest`) and Jest (frontend)
- **Wireframes:** see `docs/wireframes.md` (Figma-ready, mobile-first)

See `docs/` for details, and `backend/README.md` / `frontend/README.md` for setup.

## Quick start

```bash
# backend (SQLite by default; set DATABASE_URL for PostgreSQL)
cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
python manage.py migrate && python manage.py seed_data && python manage.py runserver

# frontend
cd frontend && npm install && npm run dev
```

Sample admin login after seeding: `admin` / `admin12345` (change it).

## MVP coverage

| Feature | Where |
|---|---|
| Sign up / log in (JWT) | `accounts`, `/login`, `/register` |
| Prevalent diseases, disease detail | `/diseases`, `/diseases/:id` |
| Most affected areas, area detail | `/areas`, `/areas/:id` |
| Reviews on how to help | Area detail page, `community` app |
| Map analysis | `/map`, `GET /api/map/` |
| Donations | `/donate`, `donations` app |
| Admin: users/roles, disease & area CRUD | `/admin/*` |
