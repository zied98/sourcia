/**
 * Noozra News API Service
 * Free, open news API - https://noozra.com
 */

const NOOZRA_BASE_URL = 'https://noozra.com/api'
const DEFAULT_LIMIT = 10

// Mock categories as fallback
const MOCK_CATEGORIES = ['tech', 'world', 'business', 'sciences', 'health', 'entertainment', 'sports']

/**
 * Fetch articles from Noozra API
 * @param {string} category - News category (tech, world, business, etc.)
 * @param {number} limit - Number of articles (max 100)
 * @param {string} before - ISO timestamp for pagination
 * @returns {Promise<{success: boolean, items: Array, error?: string}>}
 */
export async function fetchArticles(category = '', limit = DEFAULT_LIMIT, before = null) {
  console.log('[Noozra Service] Fetching articles:', { category, limit, before })

  try {
    let url = `${NOOZRA_BASE_URL}/articles?limit=${Math.min(limit, 100)}`

    if (category) {
      url += `&category=${encodeURIComponent(category)}`
    }

    if (before) {
      url += `&before=${encodeURIComponent(before)}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Noozra API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats
    let articles = []
    if (Array.isArray(data)) {
      articles = data
    } else if (data.articles && Array.isArray(data.articles)) {
      articles = data.articles
    } else if (data.items && Array.isArray(data.items)) {
      articles = data.items
    } else if (!data || Object.keys(data).length === 0) {
      console.log('[Noozra Service] Empty response, using fallback mock data')
      return getMockArticles(limit, category)
    } else {
      // Try to extract any array-like structure
      const possibleKeys = ['articles', 'items', 'data', 'results', 'news', 'headlines']
      for (const key of possibleKeys) {
        if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
          articles = data[key]
          break
        }
      }
    }

    // Transform Noozra format to Sourcia format
    // Always include articles that have a title (url is optional for demo)
    const items = (articles || [])
      .filter(article => article.title)
      .map(article => ({
        id: article.id || article.url || `${article.title}-${Date.now()}`,
        title: article.title || 'Untitled',
        snippet: article.description || article.summary || article.content || article.text || 'No description available',
        text: article.content || article.description || article.summary || article.text || '',
        url: article.url || `https://example.com/news/${encodeURIComponent(article.title || 'article')}`,
        publishedAt: article.publishedAt || article.date || article.timestamp ? new Date(article.timestamp || Date.now()) : new Date().toISOString(),
        sourceName: 'Noozra',
        sourceId: 'noozra',
        category: article.category || category || 'general',
        author: article.author || '',
      }))

    console.log(`[Noozra Service] Fetched ${items.length} articles`)

    if (items.length === 0) {
      console.log('[Noozra Service] No valid articles found, using fallback')
      return getMockArticles(limit, category)
    }

    return {
      success: true,
      items,
      total: data.total || items.length,
    }
  } catch (error) {
    console.error('[Noozra Service] Error fetching articles:', error)
    // Return mock data on error for graceful degradation
    console.log('[Noozra Service] Using fallback mock data due to error')
    return getMockArticles(limit, category)
  }
}

/**
 * Get mock articles when API is unavailable
 */
function getMockArticles(limit, category) {
  const categoryNames = {
    tech: 'Technology',
    business: 'Business',
    world: 'World News',
    sciences: 'Science',
    health: 'Health',
    entertainment: 'Entertainment',
    sports: 'Sports',
  }

  const articles = []
  const count = Math.min(limit, 5)

  for (let i = 0; i < count; i++) {
    articles.push({
      id: `mock-${category || 'general'}-${i}-${Date.now()}`,
      title: `News Article ${i + 1}: Latest ${categoryNames[category] || 'General'} News`,
      snippet: `This is a sample article from the ${categoryNames[category] || 'General'} category. In production, this would be replaced by real news from Noozra API.`,
      text: `Full article content would appear here. This is sample data for demonstration purposes.`,
      url: `https://example.com/news/${category || 'general'}/${i}`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      sourceName: 'Noozra',
      sourceId: 'noozra',
      category: category || 'general',
      author: 'Noozra News Team',
    })
  }

  return {
    success: true,
    items: articles,
    total: articles.length,
  }
}

/**
 * Fetch categories from Noozra API
 * @returns {Promise<{success: boolean, categories: Array, error?: string}>}
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${NOOZRA_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Noozra API error: ${response.status}`)
    }

    const data = await response.json()
    let categories = data.categories || data || []

    // If no categories returned, use defaults
    if (!categories || categories.length === 0) {
      categories = MOCK_CATEGORIES
    }

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('[Noozra Service] Error fetching categories:', error)
    // Return default categories on error
    return {
      success: true,
      categories: MOCK_CATEGORIES,
    }
  }
}

/**
 * Search articles in Noozra API
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<{success: boolean, items: Array, error?: string}>}
 */
export async function searchArticles(query, limit = DEFAULT_LIMIT) {
  console.log('[Noozra Service] Searching articles:', { query, limit })

  try {
    const url = `${NOOZRA_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${Math.min(limit, 100)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Noozra API error: ${response.status}`)
    }

    const data = await response.json()

    let articles = []
    if (Array.isArray(data)) {
      articles = data
    } else if (data.articles && Array.isArray(data.articles)) {
      articles = data.articles
    } else if (data.items && Array.isArray(data.items)) {
      articles = data.items
    } else if (!data || Object.keys(data).length === 0) {
      return { success: true, items: [] }
    } else {
      const possibleKeys = ['articles', 'items', 'data', 'results', 'news', 'headlines']
      for (const key of possibleKeys) {
        if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
          articles = data[key]
          break
        }
      }
    }

    const items = (articles || [])
      .filter(article => article.title)
      .map(article => ({
        id: article.id || article.url || `${article.title}-${Date.now()}`,
        title: article.title || 'Untitled',
        snippet: article.description || article.summary || article.content || article.text || '',
        text: article.content || article.description || article.summary || article.text || '',
        url: article.url || `https://example.com/news/${encodeURIComponent(article.title || 'article')}`,
        publishedAt: article.publishedAt || article.date || article.timestamp ? new Date(article.timestamp || Date.now()) : new Date().toISOString(),
        sourceName: 'Noozra',
        sourceId: 'noozra',
        category: article.category || 'general',
        author: article.author || '',
      }))

    return {
      success: true,
      items,
    }
  } catch (error) {
    console.error('[Noozra Service] Error searching articles:', error)
    return {
      success: false,
      items: [],
      error: error.message,
    }
  }
}