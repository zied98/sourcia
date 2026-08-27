/**
 * AI Service for OpenRouter
 * Generates summaries and digests using OpenRouter API directly from the browser
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL = 'poolside/laguna-xs-2.1:free'

export async function generateSummary(text, maxLength = 150) {
  console.log('[AI Service] Generating summary via direct OpenRouter call')

  if (!OPENROUTER_API_KEY) {
    console.warn('[AI Service] No API key found in VITE_OPENROUTER_API_KEY, using mock')
    return mockSummary(text, maxLength)
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sourcia.netlify.app', // For OpenRouter rankings
        'X-Title': 'Sourcia MVP',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA expert en analyse média pour journalistes. Ton rôle est de fournir des résumés factuels, concis et structurés en français.',
          },
          {
            role: 'user',
            content: text.length > 2000 
              ? `Voici plusieurs articles, fais-en un résumé global synthétique en français (max ${maxLength} caractères) :\n\n${text}`
              : `Résume ce texte en français (max ${maxLength} caractères) :\n\n${text}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenRouter API error: ${response.status} ${errorData.error?.message || ''}`)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('No summary returned from OpenRouter')
    }

    return {
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
    }
  } catch (error) {
    console.error('[AI Service] Error calling OpenRouter:', error.message)
    return mockSummary(text, maxLength)
  }
}

export async function generateGlobalDigest(articles, maxLength = 500) {
  console.log('[AI Service] Generating global digest via direct OpenRouter call')
  
  const combinedText = articles
    .map((a) => `${a.sourceName} : ${a.title}. ${a.snippet || ''}`)
    .join('\n\n')

  return generateSummary(combinedText, maxLength)
}

function mockSummary(text, maxLength = 150) {
  const summary =
    text.length <= maxLength
      ? text
      : text.substring(0, maxLength - 3) + '...'

  return {
    success: true,
    summary,
    originalLength: text.length,
    summaryLength: summary.length,
  }
}

function mockGlobalDigest(articles, maxLength = 500) {
  const combined = articles
    .map((a) => `${a.sourceName} : ${a.title}. ${a.snippet || ''}`)
    .join(' ')

  const summary = combined.length <= maxLength ? combined : combined.substring(0, maxLength - 3) + '...'

  return {
    success: true,
    summary,
    originalLength: combined.length,
    summaryLength: summary.length,
  }
}
