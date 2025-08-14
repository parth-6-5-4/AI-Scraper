# AI Scraper Pro

AI Scraper Pro is a full-stack web application designed to track and manage data scraping jobs. It features a modern, glassmorphism UI built with Next.js, Tailwind CSS, and shadcn/ui, and a robust backend powered by Next.js API Routes and Prisma.

## Features

- **Modern Frontend**: Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.
- **Glassmorphism UI**: Beautiful, responsive interface with animated backgrounds and floating blobs.
- **Component-Based**: Leverages shadcn/ui and Radix UI for accessible and reusable components.
- **Type-Safe Backend**: Next.js API Routes with Zod for validation.
- **ORM and Database**: Prisma with a SQLite database for easy setup (can be switched to PostgreSQL).
- **Dashboard**: At-a-glance view of key stats and recent activity.
- **Jobs Table**: Search, paginate, and export scraped job data to CSV.
- **Cron Job Simulation**: A script to simulate running and completing scraping jobs.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **ORM**: Prisma
- **Database**: SQLite (default), PostgreSQL (supported)
- **Validation**: Zod
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 1. Clone the repository

```bash
git clone <https://github.com/parth-6-5-4/AI-Scraper.git>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

The default `DATABASE_URL` is configured for SQLite and should work out of the box. The `BACKEND_BASE_URL` is set for the local development server.

### 4. Set up the database

Generate the Prisma client and apply the database schema migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed the database

Populate the database with sample data using the seed script:

```bash
npm run seed
```

### 6. Run the development server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.
- `npm run seed`: Populates the database with initial data.
- `npm run cron:sim`: Runs the cron job simulation script.

### Cron Job Simulation

To simulate a scraping job being run, execute the following command:

```bash
npm run cron:sim
```

This script will:
1. Pick a random job from the database.
2. Call the `/api/runs/start` endpoint.
3. Wait for a few seconds to simulate work.
4. Call the `/api/runs/complete` endpoint with a 'COMPLETED' or 'FAILED' status.

Check the dashboard to see the activity feed update after running the script.

## Switching to PostgreSQL

1.  **Set up a PostgreSQL database** and get its connection URL.
2.  **Update the `DATABASE_URL`** in your `.env` file with the PostgreSQL connection URL.
3.  **Change the Prisma provider** in `prisma/schema.prisma` from `sqlite` to `postgresql`.
4.  **Run migrations** against the new database:
    ```bash
    npx prisma migrate dev --name init-postgres
    ```
5.  **Re-seed the database** if needed:
    ```bash
    npm run seed
    ```

## Deployment

This application is ready to be deployed on platforms like Vercel or Netlify.

### Deploying on Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the repository into Vercel.
3.  Configure the environment variables (especially `DATABASE_URL` if you're using a hosted database).
4.  Set the build command to `npx prisma generate && npm run build`.
5.  Deploy!
