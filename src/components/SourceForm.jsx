import React, { useState } from 'react'

export function SourceForm({ onAdd }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState('rss')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && url) {
      onAdd({ name, url, type })
      setName('')
      setUrl('')
    }
  }

  return (
    <form className="source-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Source Name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g., BBC News, Le Monde"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">Source URL</label>
        <input
          id="url"
          type="url"
          placeholder="https://example.com/feed.xml"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Source Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="rss">RSS Feed</option>
          <option value="website">Website</option>
          <option value="social">Social Media</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Source
      </button>
    </form>
  )
}