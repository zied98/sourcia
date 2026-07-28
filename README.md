# Sourcia

A lightweight media intelligence tool for journalists and researchers.

## Tech Stack

- **Frontend**: React + Vite
- **Hosting**: Netlify
- **Database**: Supabase (planned)
- **AI**: OpenRouter API
- **Data Collection**: Apify

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
sourcia/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── SourceForm.jsx
│   │   └── SourceList.jsx
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Utility functions
├── netlify/
│   └── functions/    # Netlify serverless functions
│       ├── sources.js
│       ├── extract-source.js
│       └── generate-summary.js
├── .env.example      # Environment variables template
└── vite.config.js    # Vite configuration
```

## API Endpoints

### Sources Management (`/api/sources`)
- `GET /api/sources` - Retrieve all sources
- `POST /api/sources` - Add a new source
- `PUT /api/sources/:id` - Update a source
- `DELETE /api/sources/:id` - Remove a source

### Content Extraction (`/api/extract-source`)
- `POST /api/extract-source` - Extract content from a URL using Apify
- Body: `{ url: "https://example.com", sourceType: "rss|website|social" }`

### AI Summarization (`/api/generate-summary`)
- `POST /api/generate-summary` - Generate AI summary using OpenRouter
- Body: `{ text: "Content to summarize", maxLength: 150 }`
- Returns: `{ summary: "AI generated summary", originalLength: N, summaryLength: M }`

## Environment Variables

Set these in your Netlify dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `APIFY_API_KEY` | Apify API key for content extraction | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI summarization | Yes |
| `SUPABASE_URL` | Supabase project URL | Planned |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Planned |

## Flow

1. User adds a source via the form
2. Click "Generate Feed" to extract content from all sources using Apify
3. OpenRouter generates AI summaries for each extracted item
4. Results are displayed in the feed with summaries

## Deployment

This project is configured for Netlify deployment with serverless functions.

### Deploy to Netlify

1. Push your code to a Git repository
2. Create a new site in Netlify
3. Connect your repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!