/**
 * Netlify Function to generate AI summaries using OpenRouter
 * Usage: POST /api/generate-summary
 * Body: { text: "Content to summarize", maxLength: 150 }
 *
 * Note: Set OPENROUTER_API_KEY as an environment variable in Netlify.
 */

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1'

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

  const { text, maxLength = 150 } = body

  // Validate text
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Text is required and must be a non-empty string' }),
    }
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in Netlify environment variables.',
      }),
    }
  }

  try {
    // Call OpenRouter API
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sourcia.netlify.app',
        'X-Form-From': 'sourcia',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Fast and efficient for summarization
        messages: [
          {
            role: 'system',
            content: 'You are a concise and helpful AI assistant that summarizes content for journalists and researchers. Keep summaries under 150 words and focus on key facts, insights, and context.',
          },
          {
            role: 'user',
            content: `Please provide a concise summary (max ${maxLength} words) of the following text:\n\n${text}`,
          },
        ],
        max_tokens: Math.min(maxLength * 2, 400), // Rough estimate: 4 chars per token
        temperature: 0.3, // Low temperature for more deterministic output
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `OpenRouter API error: ${response.status} ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('No summary returned from OpenRouter')
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
      }),
    }
  } catch (error) {
    console.error('OpenRouter summarization error:', error)

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to generate summary',
        details: error.message,
      }),
    }
  }
}