# Backend (Django + DRF)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL for PostgreSQL (SQLite is used if unset)
python manage.py migrate
python manage.py seed_data    # sample data + admin / admin12345
python manage.py runserver
python manage.py test         # run the test suite
```

PostgreSQL: `createdb cdc` and set `DATABASE_URL=postgres://user:pass@localhost:5432/cdc`.

## API (`/api/`)

| Endpoint | Access | Purpose |
|---|---|---|
| `POST auth/register/`, `POST auth/login/`, `POST auth/refresh/`, `GET auth/me/` | public / user | Account + JWT |
| `GET diseases/`, `GET diseases/:id/` | public | Diseases by prevalence; detail with affected areas |
| `GET areas/`, `GET areas/:id/` | public | Areas by impact; detail with diseases |
| `GET map/?disease=&area=` | public | Map markers with case analysis |
| `POST/PUT/PATCH/DELETE diseases/`, `areas/`, `stats/` | admin | CRUD |
| `users/` (CRUD, change `role`) | admin | User management |
| `GET/POST reviews/?area=&disease=` | read public, write user | How users want to help |
| `GET/POST donations/`, `GET donations/totals/` | user / public totals | Donations |
