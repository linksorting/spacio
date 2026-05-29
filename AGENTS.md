# AGENTS.md — Designer Pro

## Project layout

Not a monorepo. Two independent packages:
- `Frontend/` — React 18 SPA (Vite 6, Tailwind 3, shadcn/ui New York)
- `Backend/` — Express 4 API (ESM)

Work in the correct subdirectory.

## Key commands

| Where | Command | What |
|-------|---------|------|
| `Frontend/` | `npm run dev` | Vite dev server on `:5183`, proxies `/api` → `:4000` |
| `Frontend/` | `npm run build` | Production build |
| `Frontend/` | `npm run lint` | ESLint 9 (flat config), limited to `src/components/`, `src/pages/`, `src/Layout.jsx` only |
| `Frontend/` | `npm run typecheck` | `tsc -p ./jsconfig.json` — TypeScript checking on **JSX** files via `checkJs: true` |
| `Backend/` | `npm run dev` | `node --watch src/server.js` on `:4000` |

No test framework, no CI, no pre-commit hooks, no formatter (Prettier), no Docker.

## Language & type checking

- Almost entirely **JavaScript (JSX)**. One isolated `.ts` utility file.
- `jsconfig.json` enables TypeScript checking on JS/JSX via `checkJs: true`. No `tsconfig.json`.
- shadcn/ui is configured for **JSX** (not TSX) — atypical. Use `.jsx` for new components.

## Auth

- JWT-based, optional in dev (`AUTH_REQUIRED=false` in `Backend/.env`).
- Default credentials: `admin@designerpro.com` / `admin123`

## State management

- **Zustand 5 + Immer** (primary, especially scene/editor state in `store/`)
- **TanStack React Query** (server data)
- **React Context** (AuthContext, NewProjectContext — legacy, do not extend)

## 3D rendering

- Primary: `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`
- Legacy Three.js (`three.min.js`) + Blueprint3D loaded via `<script>` tags in `index.html`

## Key entrypoints

| File | Role |
|------|------|
| `Frontend/index.html` | HTML shell + legacy script tags |
| `Frontend/src/main.jsx` | React DOM mount |
| `Frontend/src/App.jsx` | Provider chain: `AuthProvider → QueryClientProvider → Router → NewProjectProvider`. All routes defined here. |
| `Frontend/src/index.css` | Tailwind directives + VOXR design system CSS |
| `Backend/src/server.js` | Express server entry |

## Style / conventions

- **Tailwind CSS** with custom VOXR design tokens (`dp-black`, `dp-surface`, `dp-purple`, etc.)
- No Prettier — do not add formatting deps without asking.
- New components go under `src/components/` or next to their page.
- Scene/editor state belongs in `src/store/useSceneStore.js`.
- API calls go through `src/api/apiClient.js`.
