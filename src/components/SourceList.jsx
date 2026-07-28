import React from 'react'

export function SourceList({ sources, onRemove }) {
  if (sources.length === 0) {
    return (
      <div className="empty-state">
        <p>No sources added yet.</p>
        <p>Add your first source to get started.</p>
      </div>
    )
  }

  return (
    <ul className="source-list">
      {sources.map((source) => (
        <li key={source.id} className="source-item">
          <div className="source-info">
            <h3>{source.name}</h3>
            <p className="source-url">{source.url}</p>
            <span className={`source-type ${source.type}`}>{source.type}</span>
          </div>
          <button className="btn btn-danger" onClick={() => onRemove(source.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}