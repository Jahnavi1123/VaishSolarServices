# Vaish Solar Services

A modern, responsive landing page for Vaish Solar Services built with HTML and Tailwind CSS.

## Project structure

- `index.html` - Main website page
- `Assests/` - Brand assets such as the logo image
- `admin.html` - Protected visual content editor for all site pages
- `content-manager.js` - Applies the edits made in the admin portal to public pages
- `api/site-content.js` and `api/admin-auth.js` - Serverless content and sign-in APIs
- `.github/workflows/` - GitHub Pages deployment workflow

## Run locally

Open `index.html` in your browser, or serve the folder with a simple local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing website content

Open `admin.html` to use Content Studio. It lets an administrator select and edit text, links, image URLs, inline background images, image descriptions, and form placeholder text on every page. Image files up to 1 MB can be uploaded directly from the editor; larger photos should be hosted and pasted in as a URL.

For a shared, publishable admin portal, deploy the project to Vercel (the existing `api/` directory is automatically served as Vercel functions) and configure these environment variables:

```text
DATABASE_URL=your-postgres-connection-string
ADMIN_PASSWORD=a-strong-unique-password
ADMIN_SESSION_SECRET=a-long-random-secret-with-at-least-32-characters
```

`DATABASE_URL` can be from Vercel Postgres, Neon, Supabase, or another PostgreSQL provider. Once configured, sign in at `/admin.html`; saved content is protected by the password and is shown on the public site automatically. The portal also has a browser-only mode for local previews, but those edits stay in that browser and are not shared or published.

GitHub Pages only serves static files, so it cannot host the protected API. Use a Vercel deployment for site-wide publishing, or browser-only mode for a static GitHub Pages preview.

## Deploy to GitHub Pages

This repository is configured to deploy the static site with GitHub Pages using the workflow in `.github/workflows/deploy-pages.yml`.

1. Push the repository to GitHub.
2. Go to Settings > Pages.
3. Select the GitHub Actions deployment source.
4. Your site will be published automatically.
