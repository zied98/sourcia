/**
 * RSS/Atom Feed Extraction Service (MVP Simple Version)
 * Fetches RSS feeds using a CORS proxy with fallback to mock data
 */

// Simple CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

// Parse RSS/Atom XML feed using DOMParser (browser-compatible)
export async function extractRSSContent(source) {
  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(source.url)

    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Sourcia/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xmlText = await response.text()

    // Parse XML using DOMParser
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML in RSS feed')
    }

    // Parse RSS 2.0 items
    const items = []
    const rssItems = xmlDoc.querySelectorAll('item')

    for (const item of rssItems) {
      const title = item.querySelector('title')?.textContent || 'Untitled'
      const link = item.querySelector('link')?.textContent || source.url
      const description = item.querySelector('description')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent

      items.push({
        title: title.trim(),
        text: cleanText(description),
        url: link.trim(),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      })
    }

    // Parse Atom entries if no RSS items found
    if (items.length === 0) {
      const entries = xmlDoc.querySelectorAll('entry')
      for (const entry of entries) {
        const title = entry.querySelector('title')?.textContent || 'Untitled'
        const linkEl = entry.querySelector('link')
        const link = linkEl?.getAttribute('href') || source.url
        const summary = entry.querySelector('summary')?.textContent || ''
        const content = entry.querySelector('content')?.textContent || ''
        const published = entry.querySelector('published')?.textContent || entry.querySelector('updated')?.textContent

        items.push({
          title: title.trim(),
          text: cleanText(summary || content),
          url: link.trim(),
          publishedAt: published ? new Date(published).toISOString() : new Date().toISOString(),
        })
      }
    }

    const limitedItems = items.slice(0, 5)

    if (limitedItems.length === 0) {
      throw new Error('No items found in RSS feed')
    }

    return {
      success: true,
      items: limitedItems,
      source: source.url,
      sourceType: 'rss',
      itemCount: limitedItems.length,
      isReal: true,
      fromRSS: true,
    }
  } catch (error) {
    // Return fallback mock data
    return {
      success: true,
      items: [
        {
          title: `RSS unavailable: ${source.name}`,
          text: `Could not fetch RSS feed. Error: ${error.message}. Using mock data.`,
          url: source.url,
          publishedAt: new Date().toISOString(),
          fromRSS: false,
          rssError: error.message,
        },
      ],
      source: source.url,
      sourceType: 'rss',
      itemCount: 1,
      isReal: false,
      fromRSS: false,
    }
  }
}

// Clean and decode HTML entities from feed content
function cleanText(text) {
  if (!text) return ''
  const txt = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return txt.replace(/<[^>]*>/g, '').trim()
}