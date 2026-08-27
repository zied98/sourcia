import React, { useState } from 'react'
import { DigestView } from '../components/DigestView'
import { useSources } from '../hooks/useSources'
import { apiClient } from '../utils/api'

export function Digest() {
  const { sources } = useSources()
  const [digestItems, setDigestItems] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const generateDigest = async () => {
    if (sources.length === 0) {
      setError('No sources available. Add sources first.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const allItems = []

      for (const source of sources) {
        try {
          const result = await apiClient.extractSourceContent(source)

          if (result.success && result.items && result.items.length > 0) {
            result.items.forEach((item, index) => {
              allItems.push({
                id: `${source.id}-${index}-${Date.now()}`,
                sourceId: source.id,
                sourceName: source.name,
                title: item.title || `Item from ${source.name}`,
                snippet: item.text || item.content || item.description || 'No description available',
                url: item.url || source.url,
                publishedAt: item.publishedAt || new Date().toISOString(),
                summary: null,
              })
            })
          }
        } catch (err) {
          console.error(`Failed to extract from ${source.name}:`, err)
          allItems.push({
            id: `${source.id}-error-${Date.now()}`,
            sourceId: source.id,
            sourceName: source.name,
            title: `Unable to fetch from ${source.name}`,
            snippet: err.message || 'Failed to fetch content',
            url: source.url,
            publishedAt: new Date().toISOString(),
            summary: 'Extraction failed',
          })
        }
      }

      // Sort by date
      allItems.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

      // Generate summaries
      const itemsWithSummaries = []
      for (const item of allItems) {
        try {
          const summaryResult = await apiClient.generateSummary(
            item.snippet || item.title,
            100
          )
          itemsWithSummaries.push({ ...item, summary: summaryResult.summary })
        } catch (err) {
          console.error('Summary generation failed:', err)
          itemsWithSummaries.push({ ...item, summary: 'AI summary unavailable' })
        }
      }

      setDigestItems(itemsWithSummaries)
    } catch (err) {
      setError('Failed to generate digest. Please try again.')
      console.error('Digest generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="digest">
      <h2>Daily Digest</h2>

      {!digestItems.length && (
        <>
          <p>Generate a daily digest from your sources.</p>

          <button
            className="btn btn-primary"
            onClick={generateDigest}
            disabled={isGenerating || sources.length === 0}
          >
            {isGenerating ? 'Generating Digest...' : 'Generate Daily Digest'}
          </button>

          {sources.length === 0 && (
            <div className="empty-state">
              <p>Add sources to create your daily digest.</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </>
      )}

      {digestItems.length > 0 && <DigestView items={digestItems} />}
    </section>
  )
}