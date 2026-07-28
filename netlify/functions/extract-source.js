/**
 * Netlify Function to extract content from a public URL using Apify
 * Usage: POST /api/extract-source
 * Body: { url: "https://example.com", sourceType: "rss|website|social" }
 *
 * Note: This function uses Apify's REST API directly via fetch.
 * You need to set APIFY_API_KEY as an environment variable in Netlify.
 */

const APIFY_API_BASE = 'https://api.apify.com/v2/acts'

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    }
  }

  // Parse request body
  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    }
  }

  const { url, sourceType = 'website' } = body

  // Validate URL
  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'URL is required' }),
    }
  }

  const APIFY_API_KEY = process.env.APIFY_API_KEY
  if (!APIFY_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Apify API key not configured. Set APIFY_API_KEY in Netlify environment variables.',
      }),
    }
  }

  try {
    // Select appropriate Apify actor based on source type
    let actorId
    switch (sourceType) {
      case 'rss':
        actorId = 'apify/rss-finder'
        break
      case 'website':
        actorId = 'apify/static-sitemap-scraper'
        break
      case 'social':
        actorId = 'apify/cheerio-scraper'
        break
      default:
        actorId = 'apify/static-sitemap-scraper'
    }

    // Prepare actor input
    const actorInput = {
      url,
      maxResults: 10,
      crawlDepth: 1,
    }

    // Call Apify API directly via fetch
    const apifyResponse = await fetch(
      `${APIFY_API_BASE}/${actorId}/runs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: actorInput,
        }),
      }
    )

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text()
      throw new Error(`Apify API error: ${apifyResponse.status} ${errorText}`)
    }

    const runData = await apifyResponse.json()
    const runId = runData.data?.id

    if (!runId) {
      throw new Error('Failed to start Apify run')
    }

    // Poll for run completion (simple approach)
    let completed = false
    let output = null
    let attempts = 0
    const maxAttempts = 30

    while (!completed && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const statusResponse = await fetch(
        `${APIFY_API_BASE}/${actorId}/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${APIFY_API_KEY}`,
          },
        }
      )

      const statusData = await statusResponse.json()
      const status = statusData.data?.status

      if (status === 'COMPLETED' || status === 'SUCCESS') {
        completed = true

        // Get the output
        const outputResponse = await fetch(
          `${APIFY_API_BASE}/${actorId}/runs/${runId}/output`,
          {
            headers: {
              'Authorization': `Bearer ${APIFY_API_KEY}`,
            },
          }
        )

        if (outputResponse.ok) {
          output = await outputResponse.json()
        }
      } else if (status === 'FAILED' || status === 'ERROR') {
        throw new Error(`Apify run failed: ${statusData.data?.statusText || 'Unknown error'}`)
      }

      attempts++
    }

    if (!completed) {
      throw new Error('Apify run timed out')
    }

    // Format the extracted data
    const items = output?.data?.items || []

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        items: items.map((item) => ({
          title: item.title || item.headline || item.name || 'Untitled',
          url: item.url || item.link || item.href,
          text: item.text || item.content || item.description || item.snippet,
          publishedAt: item.publishedAt || item.date || item.timestamp,
          author: item.author,
        })),
        source: url,
        sourceType,
        itemCount: items.length,
      }),
    }
  } catch (error) {
    console.error('Apify extraction error:', error)

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to extract content',
        details: error.message,
      }),
    }
  }
}