import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'sourcia-sources'

export function useSources() {
  const [sources, setSources] = useState([])

  useEffect(() => {
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

  const addSource = useCallback((source) => {
    setSources((prevSources) => {
      // Check if source already exists (by URL or name)
      const exists = prevSources.some(
        (s) => (s.url && s.url === source.url) || (s.name && s.name === source.name)
      )

      if (exists) {
        console.log('[useSources] Source already exists, skipping:', source.name)
        return prevSources
      }

      const newSources = [...prevSources, source]
      console.log('[useSources] Added source:', source.name, 'Total sources:', newSources.length)
      persistSources(newSources)
      return newSources
    })
  }, [])

  const removeSource = useCallback((id) => {
    setSources((prevSources) => {
      const newSources = prevSources.filter((s) => s.id !== id)
      persistSources(newSources)
      return newSources
    })
  }, [])

  const updateSource = useCallback((id, updates) => {
    setSources((prevSources) => {
      const newSources = prevSources.map((s) => (s.id === id ? { ...s, ...updates } : s))
      persistSources(newSources)
      return newSources
    })
  }, [])

  const clearSources = useCallback(() => {
    setSources([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    sources,
    addSource,
    removeSource,
    updateSource,
    clearSources,
  }
}