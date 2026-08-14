# BlueDot IT Website

The public BlueDot IT website. It presents security engineering, AI automation, and full-stack application development while retaining technical insights, selected public work, account features, and admin tooling.

Table of contents

- About
- Features
- Tech stack
- Demo / Screenshots
- Quick start (local)
- Environment variables
- Database & Prisma
- Admin panel
- Available scripts
- Deployment
- Project structure
- Contributing & tests
- Suggested improvements
- License

## About

BlueDot IT is a remote technical consultancy and development studio operated by Jason O'Neal. The site communicates three connected capabilities: security engineering, AI automation and agent systems, and full-stack application development. It also provides a technical insights platform, selected public work, a security posture page, and an admin panel for content management.


## Features

Features include:

- Clean, responsive website layout optimized for desktop and mobile
- Selected public work across AI systems, security engineering, and technical evaluation
- Insights with Markdown/MDX support and SEO-friendly routes (/blog/[slug])
- Public security posture and structured About page
- Admin panel for creating and managing blog posts and projects
- SEO-first setup: comprehensive metadata, sitemap, robots, and JSON-LD
- PWA manifest and basic offline support
- TypeScript-first codebase with linting and tooling to maintain quality


## Tech stack

The framework:

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Radix UI (accessible primitives)
- NextAuth.js (authentication)
- Prisma ORM + MySQL
- ESLint, PostCSS
- Vercel for hosted deployments (supported)
- PM2 for self-hosted process management


## Demo

See it live:

- [https://bluedot.it.com](https://bluedot.it.com)


## Quick start — local development

Requirements

- Node.js 20.9+
- MySQL (local or remote)
- npm, yarn, or pnpm

1. Clone

   ```bash
   git clone https://github.com/BlueDot-IT/bluedot-website.git
   cd bluedot-website
   ```

2. Install

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Environment

   Create `.env.local` (copy from `.env.example` if present) and set required variables (see next section).

4. Database & Prisma

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed   # if a seed script exists
   ```

5. Start dev server

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Create `.env.local` with the following values (example values shown — do not commit secrets):

```text
DATABASE_URL="mysql://user:password@localhost:3306/bluedot"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_EMAILS="admin@example.com,security@example.com"
ADMIN_USER="admin"
ADMIN_PASS="secure-password"
ALLOW_PUBLIC_REGISTRATION="false"
RATE_LIMIT_IP_HEADER="x-forwarded-for"
# Add any NEXT_PUBLIC_ keys or third-party API keys as required
```

Copy `.env.example` and replace every placeholder. Admin authorization fails
closed unless the signed-in email appears in `ADMIN_EMAIL` or
`ADMIN_EMAILS`. Public registration remains disabled unless
`ALLOW_PUBLIC_REGISTRATION=true`; allowlisted administrator addresses can never
self-register. Production requests fail closed unless `RATE_LIMIT_IP_HEADER`
identifies a header controlled by a trusted reverse proxy. Rate-limit counters
are stored atomically in MySQL, so `npx prisma migrate deploy` must run before
the hardened application is started.


## Database & Prisma

- Prisma schema lives in `prisma/` (ensure `schema.prisma` is committed).
- Typical workflow:
  - `npx prisma generate`
  - `npx prisma migrate dev` (local migrations)
  - `npx prisma db seed` (if seed script exists)
- Confirm models for posts, projects, users, comments, and shared rate-limit
  buckets are present and documented.


## Admin panel

- Admin UI available at `/admin`
- Admin accounts authenticate through NextAuth and must also match the
  `ADMIN_EMAIL`/`ADMIN_EMAILS` allowlist. There are no default credentials.
- Admin features: create/edit blog posts and projects, moderate comments, manage metadata

## Available scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run typecheck` — run the TypeScript compiler without emitting files
- `npm test` — run security regression tests
- `npm run audit:prod` — fail on high/critical production dependency advisories
  except the documented, unreachable Nodemailer `raw`-message advisory until
  NextAuth accepts a patched Nodemailer major
- Prisma helpers:
  - `npx prisma studio`
  - `npx prisma migrate`
  - `npx prisma generate`

## Deployment

Vercel (recommended)

- Connect the repo to Vercel and set environment variables in project settings.
- Vercel will run `npm run build` and deploy the site.

Self-host (PM2)

1. Build

   ```bash
   npm run build
   ```

2. Start with PM2

   ```bash
   pm2 start ecosystem.config.js
   ```

3. Run migrations:

   ```bash
   npx prisma migrate deploy
   ```

## Project structure

Top-level (simplified)

```text
bluedot-website/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # UI components
│   └── lib/            # utilities and configs
├── prisma/             # schema, migrations, seed
├── public/             # static assets and images
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## Contributing & tests

- Add a `CONTRIBUTING.md` to document the development workflow, code style, and PR guidelines.
- Add Github Actions for linting and build checks (CI).
- Consider adding unit/integration tests for critical components and API routes.


## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Contact

- Site: [https://bluedot.it.com](https://bluedot.it.com)
- GitHub: [https://github.com/jason-allen-oneal](https://github.com/jason-allen-oneal)
- Email: [jason@bluedot.it.com](mailto:jason@bluedot.it.com)
