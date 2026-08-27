import { mockExtractSourceContent, getMockSources } from '../services/mockData'
import { generateSummary, generateGlobalDigest } from '../services/aiService'
import { fetchArticles as fetchNoozraArticles, fetchCategories as fetchNoozraCategories } from '../services/noozraService'

export const apiClient = {
  async getSources() {
    const STORAGE_KEY = 'sourcia-sources'
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { sources: [] }
  },

  async addSource(source) {
    const STORAGE_KEY = 'sourcia-sources'
    const stored = localStorage.getItem(STORAGE_KEY)
    const sources = stored ? JSON.parse(stored) : []
    const newSource = {
      id: Date.now().toString(),
      ...source,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...sources, newSource]))
    return { success: true, source: newSource }
  },

  async updateSource(id, updates) {
    const STORAGE_KEY = 'sourcia-sources'
    const stored = localStorage.getItem(STORAGE_KEY)
    const sources = stored ? JSON.parse(stored) : []
    const updated = sources.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return { success: true, sources: updated }
  },

  async deleteSource(id) {
    const STORAGE_KEY = 'sourcia-sources'
    const stored = localStorage.getItem(STORAGE_KEY)
    const sources = stored ? JSON.parse(stored) : []
    const filtered = sources.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return { success: true, sources: filtered }
  },

  /**
   * Extract content from a source
   * Supports: rss, website, noozra-api, noozra-category
   */
  async extractSourceContent(source) {
    // Handle Noozra API sources
    if (source.type === 'noozra-api') {
      return this.extractFromNoozra(source)
    }

    // Use mock extraction for RSS and website sources
    return mockExtractSourceContent(source)
  },

  /**
   * Extract articles from Noozra API
   */
  async extractFromNoozra(source) {
    const category = source.category || ''
    const limit = source.limit || 10

    const result = await fetchNoozraArticles(category, limit)

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to fetch from Noozra API',
      }
    }

    return {
      success: true,
      items: result.items,
      isReal: true,
      fromNoozra: true,
      source: source.name || 'Noozra',
      itemCount: result.items.length,
    }
  },

  /**
   * Fetch available Noozra categories
   */
  async fetchNoozraCategories() {
    const result = await fetchNoozraCategories()
    return result
  },

  async generateSummary(text, maxLength = 150) {
    return generateSummary(text, maxLength)
  },

  async generateDigest() {
    const sources = getMockSources()
    const allItems = []

    for (const source of sources) {
      const result = await this.extractSourceContent(source)
      if (result.success && result.items) {
        result.items.forEach((item, index) => {
          allItems.push({
            id: `${source.id}-${index}-${Date.now()}`,
            sourceId: source.id,
            sourceName: source.name,
            title: item.title,
            snippet: item.text,
            url: item.url,
            publishedAt: item.publishedAt,
            summary: null,
          })
        })
      }
    }

    // Sort by date
    allItems.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

    // Generate individual summaries (per item)
    for (const item of allItems) {
      const summaryResult = await this.generateSummary(item.snippet || item.title, 100)
      item.summary = summaryResult.summary
    }

    // Generate global digest summary
    const globalSummary = await generateGlobalDigest(allItems, 500)

    return {
      success: true,
      items: allItems,
      globalSummary: globalSummary.summary,
    }
  },
}