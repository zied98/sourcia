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
    console.error('Missing OPENROUTER_API_KEY');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'OpenRouter API key not configured.',
        details: 'Check your Netlify environment variables for OPENROUTER_API_KEY',
      }),
    }
  }

  try {
    console.log('Calling OpenRouter for text length:', text.length);
    // Call OpenRouter API
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sourcia.netlify.app',
        'X-Title': 'Sourcia MVP',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA concis qui résume du contenu pour des journalistes. Tes résumés doivent être en français, factuels et structurés.',
          },
          {
            role: 'user',
            content: `Résume ce texte en français (max ${maxLength} caractères) :\n\n${text}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('No summary returned from OpenRouter choices');
    }

    console.log('Summary generated successfully');

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