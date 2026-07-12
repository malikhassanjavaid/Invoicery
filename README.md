# Invoicery

Invoicery is a modern invoicing SaaS app built with Next.js. It gives users a polished landing page, Clerk authentication, a protected dashboard, company profile onboarding, client records, invoice creation, and branded invoice previews.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk authentication
- Prisma ORM
- Neon Postgres

## Core Features

- Auth-aware landing page with polished product sections
- Protected dashboard routes for signed-in users
- Company profile onboarding before dashboard access
- Client creation, editing, and deletion
- Invoice creation, editing, previewing, sharing, and status tracking
- Light and dark dashboard themes

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env` file from `.env.example` and add the required service keys:

```bash
cp .env.example .env
```

Required values include the Neon database URL and Clerk publishable/secret keys used by the authentication flow.

## Database Workflow

Prisma is configured for Neon Postgres. After updating the schema, run Prisma commands to generate the client and apply migrations before testing dashboard data flows.

Useful commands:

```bash
npx prisma generate
npx prisma migrate dev
```

## Authentication Flow

Clerk handles sign in and sign up. Signed-out visitors can use the landing page and auth pages, while dashboard routes are protected. On first dashboard access, users are guided to complete the company profile before using the rest of the workspace.

## Main Routes

- `/` - public landing page
- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page
- `/dashboard` - workspace overview
- `/dashboard/profile` - company profile setup
- `/dashboard/clients` - client management
- `/dashboard/invoices` - invoice management
- `/invoice/[id]` - public invoice preview/download page

## Validation

Run linting and production build checks before pushing changes:

```bash
npm run lint
npm run build
```

These checks catch TypeScript, ESLint, and Next.js build issues before deployment.
