/**
 * AI Service for OpenRouter
 * Generates summaries and digests using OpenRouter API
 */

export async function generateSummary(text, maxLength = 150) {
  console.log('[AI Service] Generating summary via Netlify Function')

  try {
    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        maxLength,
      }),
    })

    if (!response.ok) {
      // If Netlify Function fails (e.g. local dev without netlify dev), fallback to mock
      console.warn('[AI Service] Netlify Function failed, falling back to mock')
      return mockSummary(text, maxLength)
    }

    const data = await response.json()
    return {
      success: true,
      summary: data.summary,
      originalLength: text.length,
      summaryLength: data.summary.length,
    }
  } catch (error) {
    console.error('[AI Service] Error calling AI function:', error.message)
    return mockSummary(text, maxLength)
  }
}

export async function generateGlobalDigest(articles, maxLength = 500) {
  console.log('[AI Service] Generating global digest via Netlify Function')
  
  // For now, we reuse the same summary function for global digest
  const combinedText = articles
    .map((a) => `${a.title}: ${a.snippet || a.text || ''}`)
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