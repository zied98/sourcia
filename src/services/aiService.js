/**
 * AI Service for OpenRouter
 * Generates summaries and digests using OpenRouter API
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY

export async function generateSummary(text, maxLength = 150) {
  console.log('[AI Service] Generating summary for text length:', text.length)

  // Fallback mock if no API key
  if (!OPENROUTER_API_KEY) {
    console.log('[AI Service] No API key, using mock summary')
    return mockSummary(text, maxLength)
  }

  try {
    console.log('[AI Service] Calling OpenRouter API with model: poolside/laguna-xs-2.1:free')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Sourcia MVP',
      },
      body: JSON.stringify({
        model: 'poolside/laguna-xs-2.1:free',
        messages: [
          {
            role: 'user',
            content: `Summarize this text in French, keeping it under ${maxLength} characters: "${text}"`,
          },
        ],
        max_tokens: Math.ceil(maxLength * 1.5),
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim() || text.substring(0, maxLength)

    console.log('[AI Service] Summary generated successfully, length:', summary.length)

    return {
      success: true,
      summary: summary.length > maxLength ? summary.substring(0, maxLength - 3) + '...' : summary,
      originalLength: text.length,
      summaryLength: summary.length,
    }
  } catch (error) {
    console.error('[AI Service] Error generating summary:', error.message)
    return mockSummary(text, maxLength)
  }
}

export async function generateGlobalDigest(articles, maxLength = 500) {
  console.log('[AI Service] Generating global digest for', articles.length, 'articles')

  // Fallback mock if no API key
  if (!OPENROUTER_API_KEY) {
    console.log('[AI Service] No API key, using mock global digest')
    return mockGlobalDigest(articles, maxLength)
  }

  try {
    // Combine all article content
    const combinedText = articles
      .map((a) => `${a.title}: ${a.snippet || a.text || ''}`)
      .join('\n\n')

    console.log('[AI Service] Combined text length:', combinedText.length)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Sourcia MVP',
      },
      body: JSON.stringify({
        model: 'poolside/laguna-xs-2.1:free',
        messages: [
          {
            role: 'user',
            content: `Génère un résumé global en français, sous ${maxLength} caractères, des articles suivants pour un agrégateur de nouvelles:\n\n${combinedText}`,
          },
        ],
        max_tokens: Math.ceil(maxLength * 2),
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    console.log('[AI Service] Global digest generated successfully, length:', summary?.length)

    return {
      success: true,
      summary: summary || mockGlobalDigest(articles, maxLength).summary,
      originalLength: combinedText.length,
      summaryLength: summary?.length || 0,
    }
  } catch (error) {
    console.error('[AI Service] Error generating global digest:', error.message)
    return mockGlobalDigest(articles, maxLength)
  }
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
    .map((a) => `${a.title}: ${a.snippet || a.text || ''}`)
    .join(' ')

  const summary = combined.length <= maxLength ? combined : combined.substring(0, maxLength - 3) + '...'

  return {
    success: true,
    summary,
    originalLength: combined.length,
    summaryLength: summary.length,
  }
}