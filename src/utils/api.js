const API_BASE = '/api'

export const apiClient = {
  async getSources() {
    const response = await fetch(`${API_BASE}/sources`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to fetch sources')
    return response.json()
  },

  async addSource(source) {
    const response = await fetch(`${API_BASE}/sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(source),
    })
    if (!response.ok) throw new Error('Failed to add source')
    return response.json()
  },

  async updateSource(id, updates) {
    const response = await fetch(`${API_BASE}/sources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update source')
    return response.json()
  },

  async deleteSource(id) {
    const response = await fetch(`${API_BASE}/sources/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to delete source')
    return response.json()
  },

  async extractSourceContent(source) {
    const response = await fetch(`${API_BASE}/extract-source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: source.url,
        sourceType: source.type,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to extract source content')
    }

    return response.json()
  },

  async generateSummary(text, maxLength = 150) {
    const response = await fetch(`${API_BASE}/generate-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        maxLength,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate summary')
    }

    return response.json()
  },

  async generateDigest() {
    const response = await fetch(`${API_BASE}/digest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to generate digest')
    return response.json()
  },
}