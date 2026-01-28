import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// App version - increment this to force cache clear on deployment
const APP_VERSION = '2.0.0'
const VERSION_KEY = 'spider-solitaire-version'

// Force service worker update and clear caches if version changed
async function forceUpdateIfNeeded() {
  const storedVersion = localStorage.getItem(VERSION_KEY)

  if (storedVersion !== APP_VERSION) {
    console.log(`Version changed from ${storedVersion} to ${APP_VERSION}, clearing caches...`)

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      console.log('All caches cleared')
    }

    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(reg => reg.unregister()))
      console.log('Service workers unregistered')
    }

    // Store new version
    localStorage.setItem(VERSION_KEY, APP_VERSION)

    // Reload to get fresh assets
    if (storedVersion !== null) {
      console.log('Reloading to apply updates...')
      window.location.reload()
      return false
    }
  }

  return true
}

// Also check for service worker updates on every load
async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      // Force check for updates
      registration.update()
    }
  }
}

// Initialize app
forceUpdateIfNeeded().then(shouldRender => {
  if (shouldRender) {
    checkForUpdates()

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
})
