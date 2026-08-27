import React from 'react'
import { getPlatformMeta } from '../services/mockData'

export function SourceList({ sources, onRemove }) {
  if (sources.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucune source pour le moment.</p>
        <p>Choisissez des sources populaires ci-dessus ou ajoutez la vôtre.</p>
      </div>
    )
  }

  const getTypeInfo = (source) => {
    if (source.type === 'noozra-api') {
      return source.category ? `Noozra • ${source.category}` : 'Noozra API'
    }
    return getPlatformMeta(source.type).label
  }

  const getAdditionalInfo = (source) => {
    if (source.type === 'noozra-api' && source.limit) {
      return `Limite : ${source.limit} articles`
    }
    return null
  }

  return (
    <ul className="source-list">
      {sources.map((source) => {
        const meta = getPlatformMeta(source.type)
        return (
          <li key={source.id} className="source-item">
            <div className="source-info">
              <h3>
                <span className={`source-badge ${meta.className}`} title={meta.label}>
                  {meta.short}
                </span>{' '}
                {source.name}
              </h3>
              {source.url && <p className="source-url">{source.url}</p>}
              <span className={`source-type ${source.type}`}>{getTypeInfo(source)}</span>
              {getAdditionalInfo(source) && (
                <p className="source-limit">{getAdditionalInfo(source)}</p>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => onRemove(source.id)}>
              Retirer
            </button>
          </li>
        )
      })}
    </ul>
  )
}
