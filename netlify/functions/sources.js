/**
 * Netlify Function for sources management
 * Usage:
 *   GET /api/sources - Get all sources
 *   POST /api/sources - Add a new source
 *   PUT /api/sources/:id - Update a source
 *   DELETE /api/sources/:id - Remove a source
 */

const STORAGE_KEY = 'sourcia-sources'

// Simple in-memory storage (for demo purposes)
// In production, use Supabase or another database
let sources = []

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // GET - Retrieve all sources
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sources }),
    }
  }

  // POST - Add a new source
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body)
      const newSource = {
        id: Date.now().toString(),
        name: body.name,
        url: body.url,
        type: body.type || 'rss',
        createdAt: new Date().toISOString(),
      }

      sources = [...sources, newSource]

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, source: newSource }),
      }
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' }),
      }
    }
  }

  // PUT - Update a source
  if (event.httpMethod === 'PUT') {
    try {
      const pathParts = event.path.split('/')
      const id = pathParts[pathParts.length - 1]
      const body = JSON.parse(event.body)

      const index = sources.findIndex((s) => s.id === id)
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Source not found' }),
        }
      }

      sources[index] = { ...sources[index], ...body, updatedAt: new Date().toISOString() }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, source: sources[index] }),
      }
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' }),
      }
    }
  }

  // DELETE - Remove a source
  if (event.httpMethod === 'DELETE') {
    try {
      const pathParts = event.path.split('/')
      const id = pathParts[pathParts.length - 1]

      const index = sources.findIndex((s) => s.id === id)
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Source not found' }),
        }
      }

      const removed = sources.splice(index, 1)[0]
      sources = sources // Update reference

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, source: removed }),
      }
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request' }),
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  }
}