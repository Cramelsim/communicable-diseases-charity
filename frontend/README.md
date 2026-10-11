# Frontend (React + Redux Toolkit)

```bash
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:8000/api
npm run dev            # http://localhost:3000
npm test               # Jest + React Testing Library
npm run build
```

State lives in Redux Toolkit slices under `src/features/`; `src/api/resourceSlice.js` generates the
list/get/create/update/remove thunks shared by diseases, areas, reviews and users.
