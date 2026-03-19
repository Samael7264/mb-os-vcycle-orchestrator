# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite + React + TypeScript app with root-level entry files instead of a `src/` directory. `index.tsx` mounts the app, and `App.tsx` defines the `HashRouter` routes. Feature screens and tool views live in `components/`, with shared shell UI in `components/ui/`. Gemini integration and fallback mock data live in `services/geminiService.ts`. Shared types are in `types.ts`, global styles and Tailwind theme tokens are in `index.css`, and static deployment settings are in `render.yaml`. Treat `dist/` as generated output only.

## Build, Test, and Development Commands
Run `npm install` to install dependencies. Use `npm run dev` to start the local Vite server on port `3000`. Use `npm run build` to generate the production bundle in `dist/`, and `npm run preview` to serve that build locally. `npm run lint` runs `tsc --noEmit`; in this repo, that is the main type-checking gate and should pass before every PR.

## Coding Style & Naming Conventions
Use TypeScript React function components and keep code aligned with existing patterns: single quotes, semicolons, and Tailwind utility classes inline in JSX. Prefer 2-space indentation in TSX and preserve surrounding formatting in older files instead of reformatting unrelated code. Name components with PascalCase (`TestQualityTool.tsx`), utilities/services with camelCase (`geminiService.ts`), and constants with UPPER_SNAKE_CASE (`MODEL_FLASH`). Keep shared styling in `index.css`; avoid duplicating theme values across components.

## Testing Guidelines
There is no dedicated automated test suite configured yet. For every change, run `npm run lint` and `npm run build` to catch type, bundling, and route issues. If you add tests, use `*.test.ts` or `*.test.tsx`, place them next to the feature or under a new `tests/` directory, and add the matching script to `package.json`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:` and `fix:`. Keep commit subjects short, imperative, and scoped to one change. Pull requests should summarize user-visible impact, note any `GEMINI_API_KEY` or deployment changes, link the relevant issue, and include screenshots or short recordings for UI updates.

## Security & Configuration Tips
Keep secrets in `.env.local` and never commit API keys. The app reads `GEMINI_API_KEY` through Vite config and Render environment variables, so verify both local and deployed settings when changing Gemini-related code.
