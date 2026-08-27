import React from 'react'
import { POPULAR_RSS_FEEDS, SOCIAL_POPULAR_SOURCES, NOOZRA_POPULAR_SOURCES, DEMO_SCENARIO } from '../services/mockData'

function toSource(entry, index) {
  return {
    id: `${entry.id}-${Date.now()}-${index}`,
    name: entry.name,
    url: entry.url || (entry.type === 'noozra-api' ? `noozra://${entry.category}` : ''),
    type: entry.type,
    category: entry.category,
    limit: entry.limit,
    description: entry.description,
    createdAt: new Date().toISOString(),
  }
}

export function PopularSources({ onAdd }) {
  const handleAddAll = (list) => {
    list.forEach((feed, index) => onAdd(toSource(feed, index)))
  }

  const handleAddDemo = () => {
    handleAddAll(DEMO_SCENARIO)
  }

  const handleAddOne = (feed) => {
    onAdd(toSource(feed, Date.now()))
  }

  return (
    <section className="section popular-sources">
      <h3>Sources populaires</h3>
      <p className="popular-sources-description">
        Choisissez des sources une à une, ou chargez un scénario complet en un clic.
      </p>

      <div className="popular-sources-actions">
        <button className="btn btn-demo" onClick={handleAddDemo}>
          🎬 Charger le scénario de démo complet
        </button>
      </div>

      {/* RSS Sources */}
      <div className="popular-sources-group">
        <h4 className="popular-sources-group-title">📰 Médias & RSS</h4>
        <div className="popular-sources-list">
          {POPULAR_RSS_FEEDS.map((feed) => (
            <div key={feed.id} className="popular-source-item">
              <div className="popular-source-info">
                <span className="popular-source-name">{feed.name}</span>
                <span className="popular-source-desc">{feed.description}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAddOne(feed)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Sources */}
      <div className="popular-sources-group">
        <h4 className="popular-sources-group-title">
          Réseaux sociaux <span className="roadmap-tag">feuille de route Apify</span>
        </h4>
        <div className="popular-sources-list">
          {SOCIAL_POPULAR_SOURCES.map((feed) => (
            <div key={feed.id} className="popular-source-item popular-source-social">
              <div className="popular-source-info">
                <span className="popular-source-name">{feed.name}</span>
                <span className="popular-source-desc">{feed.description}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAddOne(feed)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Noozra API Sources */}
      <div className="popular-sources-group">
        <h4 className="popular-sources-group-title">Noozra API (gratuit)</h4>
        <div className="popular-sources-list">
          {NOOZRA_POPULAR_SOURCES.map((feed) => (
            <div key={feed.id} className="popular-source-item">
              <div className="popular-source-info">
                <span className="popular-source-name">{feed.name}</span>
                <span className="popular-source-desc">{feed.description}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAddOne(feed)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
