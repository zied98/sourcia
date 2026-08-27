import React, { useState, useEffect } from 'react'
import { apiClient } from '../utils/api'

const SOCIAL_TYPES = ['x', 'linkedin', 'instagram', 'youtube']

export function SourceForm({ onAdd }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState('rss')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState(10)
  const [availableCategories, setAvailableCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    // Load Noozra categories
    const loadCategories = async () => {
      setLoadingCategories(true)
      const result = await apiClient.fetchNoozraCategories()
      if (result.success) {
        setAvailableCategories(result.categories)
      }
      setLoadingCategories(false)
    }

    if (type === 'noozra-api') {
      loadCategories()
    }
  }, [type])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name) {
      const sourceToAdd = { name, type }

      if ((type === 'rss' || SOCIAL_TYPES.includes(type) || type === 'website') && url) {
        sourceToAdd.url = url
      }

      if (type === 'noozra-api') {
        sourceToAdd.category = category
        sourceToAdd.limit = parseInt(limit, 10) || 10
      }

      onAdd(sourceToAdd)
      setName('')
      setUrl('')
      setType('rss')
      setCategory('')
      setLimit(10)
    }
  }

  const getHelpText = () => {
    switch (type) {
      case 'rss':
        return 'URL du flux RSS à suivre (détection automatique si non renseignée)'
      case 'x':
        return 'URL du compte X, ex : https://x.com/compte — extraction via Apify (bientôt)'
      case 'linkedin':
        return 'URL de la page LinkedIn, ex : https://linkedin.com/company/… (via Apify)'
      case 'instagram':
        return 'URL du profil Instagram (via Apify)'
      case 'youtube':
        return 'URL de la chaîne YouTube (via Apify)'
      case 'website':
        return 'URL du site web à surveiller'
      case 'noozra-api':
        return 'Source de nouvelles gratuite sans clé API'
      default:
        return 'URL de la source'
    }
  }

  const needsUrl = type !== 'noozra-api'

  return (
    <form className="source-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom de la source</label>
        <input
          id="name"
          type="text"
          placeholder="ex : Le Monde Afrique, @GeoMaghreb_Intel…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Type de source</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="rss">Flux RSS</option>
          <option value="x">X / Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="website">Site web</option>
          <option value="noozra-api">Noozra API (gratuit)</option>
        </select>
      </div>

      {needsUrl && (
        <div className="form-group">
          <label htmlFor="url">URL de la source</label>
          <input
            id="url"
            type="url"
            placeholder={type === 'rss' ? 'https://exemple.com/feed.xml' : 'https://…'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      {type === 'noozra-api' && (
        <>
          <div className="form-group">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loadingCategories || availableCategories.length === 0}
            >
              <option value="">Choisir une catégorie</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="limit">Nombre d'articles max</label>
            <input
              id="limit"
              type="number"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <small className="help-text">100 articles maximum par requête</small>
          </div>
        </>
      )}

      {SOCIAL_TYPES.includes(type) && (
        <small className="help-text help-text-demo">
          🔮 Aperçu de la feuille de route : ces plateformes seront connectées via des
          scrapers Apify. Pour l'instant, les contenus affichés sont simulés.
        </small>
      )}
      {!SOCIAL_TYPES.includes(type) && <small className="help-text">{getHelpText()}</small>}

      <button type="submit" className="btn btn-primary">
        Ajouter la source
      </button>
    </form>
  )
}
