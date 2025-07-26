# Design Shark Frontend (TypeScript)

This is a TypeScript conversion of the Design Shark frontend application.

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Query
- Shadcn UI
- Axios

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built static files will be in the `dist` folder.

## Project Structure

- `src/` - Contains all the source code
  - `assets/` - Static assets like images, fonts, etc.
  - `components/` - Reusable React components
    - `ui/` - UI components from Shadcn UI
  - `constants/` - Application constants
  - `contexts/` - React context providers
  - `hooks/` - Custom React hooks
  - `lib/` - Utility libraries
  - `pages/` - Application pages/routes
  - `services/` - API and other service integrations
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
