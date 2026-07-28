import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sourcia-sources'

export function useSources() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load sources from local storage
    const storedSources = localStorage.getItem(STORAGE_KEY)
    if (storedSources) {
      try {
        setSources(JSON.parse(storedSources))
      } catch (e) {
        console.error('Failed to parse sources from localStorage:', e)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const persistSources = (updatedSources) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSources))
  }

  const addSource = (source) => {
    const newSources = [...sources, source]
    setSources(newSources)
    persistSources(newSources)
  }

  const removeSource = (id) => {
    const newSources = sources.filter((s) => s.id !== id)
    setSources(newSources)
    persistSources(newSources)
  }

  const updateSource = (id, updates) => {
    const newSources = sources.map((s) => (s.id === id ? { ...s, ...updates } : s))
    setSources(newSources)
    persistSources(newSources)
  }

  const clearSources = () => {
    setSources([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    sources,
    loading,
    error,
    addSource,
    removeSource,
    updateSource,
    clearSources,
  }
}