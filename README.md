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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
