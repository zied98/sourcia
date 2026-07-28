import React, { useState } from 'react'
import { useSources } from './hooks/useSources'
import { SourceForm } from './components/SourceForm'
import { SourceList } from './components/SourceList'
import { apiClient } from './utils/api'

function App() {
  const { sources, addSource, removeSource } = useSources()
  const [feedItems, setFeedItems] = useState([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState(null)

  const handleAddSource = (source) => {
    const newSource = {
      id: Date.now(),
      ...source,
      createdAt: new Date().toISOString(),
    }
    addSource(newSource)
  }

  const handleGenerateFeed = async () => {
    if (sources.length === 0) {
      setError('Please add at least one source first.')
      return
    }

    setIsExtracting(true)
    setIsSummarizing(false)
    setError(null)

    try {
      // Extract content from each source using Apify
      const extractedItems = []

      for (const source of sources) {
        try {
          const result = await apiClient.extractSourceContent(source)

          if (result.success && result.items && result.items.length > 0) {
            result.items.forEach((item, index) => {
              extractedItems.push({
                id: `${source.id}-${index}-${Date.now()}`,
                sourceId: source.id,
                sourceName: source.name,
                title: item.title || `Item from ${source.name}`,
                snippet: item.text || item.content || item.description || 'No description available',
                url: item.url || source.url,
                publishedAt: item.publishedAt || new Date().toISOString(),
                summary: null, // Will be filled by AI summarization
              })
            })
          }
        } catch (err) {
          console.error(`Failed to extract from ${source.name}:`, err)
          // Add a placeholder item for failed extractions
          extractedItems.push({
            id: `${source.id}-placeholder-${Date.now()}`,
            sourceId: source.id,
            sourceName: source.name,
            title: `Unable to fetch from ${source.name}`,
            snippet: err.message || 'Failed to fetch content',
            url: source.url,
            publishedAt: new Date().toISOString(),
            summary: 'Extraction failed - check source URL',
          })
        }
      }

      // Sort by published date (newest first)
      extractedItems.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

      setFeedItems(extractedItems)

      // Generate AI summaries for extracted items
      if (extractedItems.length > 0) {
        await generateSummaries(extractedItems)
      }
    } catch (err) {
      setError('Failed to generate feed. Please try again.')
      console.error('Feed generation error:', err)
    } finally {
      setIsExtracting(false)
    }
  }

  const generateSummaries = async (items) => {
    setIsSummarizing(true)

    try {
      const itemsWithSummaries = []

      for (const item of items) {
        // Skip items that already have a summary (failed extractions)
        if (item.summary && !item.summary.includes('Extracted from')) {
          itemsWithSummaries.push(item)
          continue
        }

        try {
          const summaryResult = await apiClient.generateSummary(
            item.snippet || item.title,
            100
          )

          itemsWithSummaries.push({
            ...item,
            summary: summaryResult.summary,
          })
        } catch (err) {
          console.error(`Failed to generate summary for ${item.title}:`, err)
          itemsWithSummaries.push({
            ...item,
            summary: 'AI summary unavailable',
          })
        }
      }

      setFeedItems(itemsWithSummaries)
    } catch (err) {
      console.error('Summary generation error:', err)
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleRemoveItem = (id) => {
    setFeedItems(feedItems.filter((item) => item.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sourcia</h1>
        <p className="tagline">Media intelligence for journalists</p>
      </header>

      <main className="app-main">
        {/* Hero Section */}
        <section className="hero">
          <h2>Welcome to Sourcia</h2>
          <p>
            A lightweight media intelligence tool that helps you monitor multiple
            sources and receive a daily personalized feed of relevant posts and summaries.
          </p>
        </section>

        {/* Source Input Form */}
        <section className="section">
          <h3>Add a Source</h3>
          <SourceForm onAdd={handleAddSource} />
        </section>

        {/* Sources List */}
        <section className="section">
          <h3>Your Sources ({sources.length})</h3>
          <SourceList sources={sources} onRemove={removeSource} />
        </section>

        {/* Generate Feed Button */}
        <section className="section">
          <button
            className="btn btn-primary"
            onClick={handleGenerateFeed}
            disabled={isExtracting || isSummarizing || sources.length === 0}
          >
            {isExtracting
              ? 'Extracting Content...'
              : isSummarizing
                ? 'Generating Summaries...'
                : 'Generate Feed'}
          </button>
        </section>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Feed Results */}
        {feedItems.length > 0 && (
          <section className="section">
            <h3>Feed Results ({feedItems.length} items)</h3>
            <div className="feed-list">
              {feedItems.map((item) => (
                <div key={item.id} className="feed-item">
                  <div className="feed-item-header">
                    <h4>{item.title}</h4>
                    <span className="feed-item-source">{item.sourceName}</span>
                  </div>
                  <p className="feed-item-snippet">{item.snippet}</p>
                  <div className="feed-item-summary">
                    <strong>AI Summary:</strong> {item.summary}
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="feed-item-link">
                    Read full article
                  </a>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Sourcia</p>
      </footer>
    </div>
  )
}

export default App