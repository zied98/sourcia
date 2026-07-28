import React from 'react'

export function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sourcia</h1>
        <p className="tagline">Media intelligence for journalists</p>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Sourcia</p>
      </footer>
    </div>
  )
}