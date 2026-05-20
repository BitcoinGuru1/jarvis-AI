# Jarvis Content Agent

Jarvis is an agentic content command center for founder strategy posts. The frontend runs in `index.html`; the backend exposes Vercel serverless API routes for generation and health checks.

## Backend Structure

```text
.
├── api/
│   ├── generate.js      # POST /api/generate
│   └── health.js        # GET /api/health
├── lib/
│   └── jarvis-engine.js # Drafting, scoring, and normalization engine
├── index.html           # Jarvis UI
├── package.json         # Project metadata and scripts
├── vercel.json          # Vercel routing and headers
└── README.md
```

## API

`POST /api/generate`

```json
{
  "audience": "bootstrapped founders and solo operators",
  "topic": "pricing strategy",
  "contentType": "Problem + solution",
  "proof": "Clarity compounds faster than hustle.",
  "cta": "If this resonates, let's talk.",
  "tones": ["direct", "premium"]
}
```

The route returns four scored drafts under `drafts`.

`GET /api/health`

Returns a small JSON health payload.

## Deploy From GitHub Repo

1. Push this folder to GitHub.
2. In Vercel, choose **Add New Project**.
3. Select **Deploy from GitHub repo**.
4. Import the Jarvis repo.
5. Leave the build command empty. Vercel will serve `index.html` and the `api/` routes.

No required environment variables are needed for the current backend engine.
