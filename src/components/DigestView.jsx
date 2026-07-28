import React from 'react'

export function DigestView({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <p>No feed items available.</p>
        <p>Generate a feed first to see your daily digest.</p>
      </div>
    )
  }

  // Group items by source
  const itemsBySource = items.reduce((acc, item) => {
    if (!acc[item.sourceName]) {
      acc[item.sourceName] = []
    }
    acc[item.sourceName].push(item)
    return acc
  }, {})

  // Sort items by published date within each source
  Object.keys(itemsBySource).forEach((sourceName) => {
    itemsBySource[sourceName].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  })

  // Sort sources by most recent item
  const sortedSources = Object.keys(itemsBySource).sort((a, b) => {
    const latestA = new Date(itemsBySource[a][0].publishedAt)
    const latestB = new Date(itemsBySource[b][0].publishedAt)
    return latestB - latestA
  })

  return (
    <div className="digest-view">
      <h3>Daily Digest</h3>
      <p className="digest-summary">
        {items.length} items from {sortedSources.length} sources
      </p>

      {sortedSources.map((sourceName) => {
        const sourceItems = itemsBySource[sourceName]

        return (
          <div key={sourceName} className="digest-source">
            <h4 className="digest-source-title">{sourceName}</h4>

            <div className="digest-items">
              {sourceItems.map((item, index) => (
                <div key={item.id} className="digest-item">
                  <div className="digest-item-header">
                    <h5 className="digest-item-title">
                      {index + 1}. {item.title}
                    </h5>
                    <span className="digest-item-date">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="digest-item-summary">
                    <strong>Summary:</strong> {item.summary}
                  </div>

                  <p className="digest-item-snippet">{item.snippet}</p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="digest-item-link"
                  >
                    Read full article
                  </a>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}