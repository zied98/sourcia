import React, { useState } from 'react'
import { useSources } from './hooks/useSources'
import { SourceForm } from './components/SourceForm'
import { SourceList } from './components/SourceList'
import { PopularSources } from './components/PopularSources'
import { apiClient } from './utils/api'
import { getPlatformMeta } from './services/mockData'

// "il y a 42 min", "il y a 3 h", "il y a 2 j"
function timeAgo(isoDate) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(isoDate).getTime()) / 60000))
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${Math.round(hours / 24)} j`
}

// 1240 -> "1 240", 23400 -> "23,4 k"
function formatCount(n) {
  if (!n && n !== 0) return ''
  if (n >= 1000) {
    const k = n / 1000
    return `${k.toFixed(1).replace('.', ',').replace(',0', '')} k`
  }
  return String(n)
}

function EngagementBar({ engagement }) {
  if (!engagement) return null
  return (
    <div className="engagement">
      {engagement.likes != null && <span>♥ {formatCount(engagement.likes)}</span>}
      {engagement.comments != null && <span>💬 {formatCount(engagement.comments)}</span>}
      {engagement.reposts != null && <span>🔁 {formatCount(engagement.reposts)}</span>}
    </div>
  )
}

function App() {
  const { sources, addSource, removeSource } = useSources()
  const [feedItems, setFeedItems] = useState([])
  const [globalDigest, setGlobalDigest] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isDigestLoading, setIsDigestLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddSource = (source) => {
    addSource(source)
  }

  const handleGenerateFeed = async () => {
    if (sources.length === 0) {
      setError('Ajoutez au moins une source avant de générer le flux.')
      return
    }

    // Clear previous feed before generating new one
    setFeedItems([])
    setGlobalDigest(null)
    setIsExtracting(true)
    setError(null)

    try {
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
                sourceType: source.type,
                title: item.title || `Item from ${source.name}`,
                snippet: item.text || item.content || item.description || 'No description available',
                url: item.url || source.url,
                publishedAt: item.publishedAt || new Date().toISOString(),
                author: item.author || null,
                engagement: item.engagement || null,
                summary: null,
              })
            })
          }
        } catch (err) {
          console.error(`Failed to extract from ${source.name}:`, err)
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
        await generateFinalDigest(extractedItems)
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
        if (item.summary && !item.summary.includes('failed')) {
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

  const generateFinalDigest = async (items) => {
    setIsDigestLoading(true)
    try {
      const combinedText = items
        .slice(0, 10) // Limit to top 10 for the global summary
        .map(item => `${item.sourceName} : ${item.title}. ${item.snippet}`)
        .join('\n\n')
      
      const result = await apiClient.generateSummary(combinedText, 500)
      setGlobalDigest(result.summary)
    } catch (err) {
      console.error('Final digest error:', err)
      setGlobalDigest('Résumé global indisponible pour le moment.')
    } finally {
      setIsDigestLoading(false)
    }
  }

  const handleRemoveItem = (id) => {
    setFeedItems(feedItems.filter((item) => item.id !== id))
  }

  return (
    <div className="app">
      <div className="demo-banner" title="Toutes les données affichées sont simulées pour cette démonstration">
        <span className="demo-banner-dot"></span> Mode démo — données simulées
      </div>

      <header className="app-header">
        <div className="header-content">
          <img src="/logo.png" alt="Sourcia Logo" className="logo" />
          <h1>Sourcia</h1>
        </div>
        <p className="tagline">Veille média intelligente pour les journalistes</p>
      </header>

      <main className="app-main">
        {/* Hero Section */}
        <section className="hero">
          <h2>Bienvenue sur Sourcia</h2>
          <p>
            Centralisez vos sources — médias, X, LinkedIn, Instagram, YouTube — et recevez
            un flux personnalisé avec résumés générés par l'IA. Fini de naviguer entre
            dix plateformes : votre veille quotidienne tient dans un seul fil.
          </p>
        </section>

        {/* Popular Sources Section */}
        <PopularSources onAdd={handleAddSource} />

        {/* Source Input Form */}
        <section className="section">
          <h3>Ajouter une source</h3>
          <SourceForm onAdd={handleAddSource} />
        </section>

        {/* Sources List */}
        <section className="section">
          <h3>Vos sources ({sources.length})</h3>
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
              ? '⏳ Extraction du contenu…'
              : isSummarizing
                ? '🧠 Génération des résumés…'
                : '⚡ Générer mon flux'}
          </button>
        </section>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Global AI Digest */}
        {(globalDigest || isDigestLoading) && (
          <section className="section global-digest">
            <div className="digest-card">
              <div className="digest-header">
                <span className="digest-icon">🧠</span>
                <h3>Résumé Global IA</h3>
              </div>
              <div className="digest-content">
                {isDigestLoading ? (
                  <div className="loading-placeholder">
                    <div className="pulse-line"></div>
                    <div className="pulse-line"></div>
                    <div className="pulse-line"></div>
                    <p>L'IA analyse votre veille du jour...</p>
                  </div>
                ) : (
                  <p>{globalDigest}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Feed Results */}
        {feedItems.length > 0 && (
          <section className="section">
            <h3>Votre flux ({feedItems.length} contenus)</h3>
            <div className="feed-list">
              {feedItems.map((item) => {
                const meta = getPlatformMeta(item.sourceType)
                return (
                  <div key={item.id} className="feed-item">
                    <div className="feed-item-header">
                      <span className={`source-badge ${meta.className}`} title={meta.label}>
                        {meta.short}
                      </span>
                      <h4>{item.title}</h4>
                      <span className="feed-item-source">{item.sourceName}</span>
                    </div>
                    <div className="feed-item-meta">
                      {item.author && <span className="feed-item-author">{item.author}</span>}
                      <span className="feed-item-time">{timeAgo(item.publishedAt)}</span>
                    </div>
                    <p className="feed-item-snippet">{item.snippet}</p>
                    <EngagementBar engagement={item.engagement} />
                    <div className="feed-item-summary">
                      <strong>IA :</strong> {item.summary || '⏳ génération…'}
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="feed-item-link">
                      Lire la source complète →
                    </a>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.id)}>
                      Retirer
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Feed Empty State */}
        {sources.length > 0 && !isExtracting && !isSummarizing && feedItems.length === 0 && !error && (
          <section className="section">
            <div className="empty-state">
              <p>Ajoutez des sources ci-dessus puis cliquez sur « Générer mon flux » pour voir votre veille du jour.</p>
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