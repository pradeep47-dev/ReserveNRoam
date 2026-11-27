# ReserveNRoam

Discover and reserve campsites, parks, recreation areas, cabins, and other outdoor stays.

ReserveNRoam is an outdoor discovery and reservation platform that helps users find, compare, and book available campsites, provincial and national parks, recreation areas, cabins, and other outdoor accommodations. Users can search based on location, dates, budget, accommodation type, amenities, and other preferences, making it easier to discover available spots and plan outdoor getaways. The platform aims to simplify fragmented reservation experiences by bringing outdoor destinations and booking options together in one place.

## Repository structure

```text
reservenroam/
├── apps/
│   ├── web/          # React + TypeScript + Vite
│   └── api/          # Node.js + Express + TypeScript
├── .gitignore
├── package.json      # Root workspace scripts
└── README.md
```

## Prerequisites

- Node.js 20+
- npm 10+

## Getting started

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/api/health

Run both applications from the repository root with `npm run dev`.

## Useful commands

```bash
npm run dev       # Run frontend and backend concurrently
npm run build     # Build both applications
npm run lint      # Run lint scripts where configured
```

You can also run an app independently:

```bash
npm run dev --workspace @reservenroam/web
npm run dev --workspace @reservenroam/api
```

## Environment variables

The API reads `PORT` from `apps/api/.env`. The frontend reads `VITE_API_BASE_URL` from `apps/web/.env`.

Never commit `.env` files or secrets. Use the `.env.example` files as templates.

## Initial product scope

The first iteration is intentionally a small foundation. Suggested next milestones:

1. Define searchable inventory types: campsite, cabin, park, and recreation area.
2. Add location, date range, party size, price, and amenity filters.
3. Integrate inventory and availability data sources.
4. Add reservation-provider links or booking integrations.
5. Add accounts, saved searches, and booking history.

## Development notes

- Keep frontend and backend independently deployable.
- Validate all API input on the server.
- Keep third-party reservation integrations behind backend adapters.
- Treat availability as time-sensitive; re-check it with the provider before confirming a booking.
