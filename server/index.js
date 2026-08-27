/**
 * Simple RSS Proxy Server
 * Provides a local API endpoint to fetch RSS feeds without CORS issues
 * Run with: npm run rss-proxy
 */

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.RSS_PROXY_PORT || 3001

// Enable CORS for all origins (dev mode)
app.use(cors())

// Parse XML response
app.get('/api/rss', async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Sourcia/1.0 (RSS Proxy)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const text = await response.text()
    res.setHeader('Content-Type', 'text/xml')
    res.send(text)
  } catch (error) {
    console.error('RSS fetch error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'RSS Proxy' })
})

app.listen(PORT, () => {
  console.log(`RSS Proxy server running on http://localhost:${PORT}`)
})

export default app