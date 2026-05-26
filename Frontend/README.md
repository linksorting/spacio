## Designer Pro Frontend

React + Vite frontend for Designer Pro.

### Setup

1. Install dependencies:
   `npm install`
2. Add a `.env` file in `Frontend/`:

```bash
VITE_APP_ID=designer-pro-local
VITE_API_BASE_URL=
VITE_PROXY_TARGET=http://localhost:4000
```

### Run

```bash
npm run dev
```

By default, API requests to `/api/*` are proxied to the backend at `http://localhost:4000`.
