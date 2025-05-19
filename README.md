# 🎬 Movie Explorer

A responsive movie discovery SPA built with **React 18**, **TypeScript**, and **Tailwind CSS**, using the **TMDB API**. It supports infinite scrolling, search, genre filtering, and a local watchlist—all optimized with **React Query**, **React Router v6**, and `localStorage`.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v16+
- npm or yarn
- A TMDB API key and access token ([sign up here](https://developer.themoviedb.org))

### 1. Clone the repository

```bash
git clone https://github.com/TheWildSea/Movie-Explorer.git
cd Movie-Explorer
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

-Create a .env file in the root:
```bash
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```
ℹ️ API credentials (TMDB_API_KEY, TMDB_ACCESS_TOKEN) are securely accessed via AWS Secrets Manager and are not stored in this file. Here’s an example from the project:
```bash
// .env or secrets.ts
import boto3

const secrets = boto3.client('secretsmanager');
const tmdb_api_key = secrets.get_secret_value({ SecretId: 'TMDB_API_KEY' }).SecretString;
const tmdb_access_token = secrets.get_secret_value({ SecretId: 'TMDB_ACCESS_TOKEN' }).SecretString;
```

### 4. Start the development server

```bash
npm run dev
```
App runs on: http://localhost:5173


## 🧠 Architectural Decisions

### 📁 Folder Structure

```txt
src/
├── _tests__/        # Unit & integration tests
├── api/             # API service functions (TMDB fetches)
├── assets/          # Static files
├── components/      # Reusable UI elements
├── helpers/         # Utility functions
├── hooks/           # Custom React hooks
├── pages/           # Route-level components
├── types/           # TypeScript definitions
├── router.tsx       # Router config (React Router v6)
├── routeTree.ts     # Route paths
├── main.tsx         # App entry
└── vite-env.d.ts    # Vite environment types
```

### 🧩 State Management

- Local component state for UI control and scoped logic.
- **React Context API** for global watchlist management.
- Watchlist is persisted in `localStorage`.

> 📌 Chose Context API for simplicity and maintainability for a small-scope app.

### ⚡ Data Fetching

- Uses **React Query** (`@tanstack/react-query`) for async API calls, caching, background refetching, and stale data control.

### 🎨 Styling Strategy

- **Tailwind CSS** for utility-first styling and responsive design.
- Centralized configuration in `tailwind.config.js`.

### 🚦 Routing

- **React Router v6** with nested routes and route tree abstraction.


---

### ✅ Article 4: 🔍 Features


## 🔍 Features

- ✅ Browse popular movies with infinite scroll
- ✅ Debounced search by title
- ✅ Multi-select genre filtering
- ✅ Movie detail modal/page with rich info
- ✅ Add/remove movies from watchlist (`localStorage`)
- ✅ Watchlist route with sorting (rating, date added)

## 🧪 Testing

Tests are written using **Jest** and **React Testing Library**.

To run all tests:

```bash
npm test
```
### ✅ Test Coverage Includes:

- 🔁 **Search debounce behavior** – Ensures the app waits before querying while typing.
- ➕➖ **Add/remove to/from Watchlist** – Validates that items can be toggled and persisted.
- 🔘 **Genre filter interactions** – Confirms filtering works based on selected genres.


---

### ✅ Article 6: ⚖️ Trade-offs & Known Issues


## ⚖️ Trade-offs & Known Issues

### Trade-offs

- ✅ AWS Secrets Manager integration ensures key security, but adds setup steps.
- ✅ React Context used over Redux for a lean global state.
- ✅ Tailwind speeds styling, though it clutters JSX.

### Known Issues

- ❗ No user account system or cloud-sync for Watchlist
- ❗ Modal lacks focus trap for full accessibility
- ⚠️ Minimal error UI for failed API requests

## 🔮 Future Enhancements

- ⏳ Paginate/sort Watchlist
- ☁️ Sync Watchlist to cloud (e.g., Firebase)
- 🧪 Expand test coverage (API failure states, UI edge cases)
- 🔎 Improve accessibility (keyboard nav, focus states)
- 🌍 Deploy to Vercel or Netlify with preview links

## 🖥 Local Demo

```bash
npm run dev
```
App will start at: http://localhost:5173

🔗 Live deployment: coming soon

