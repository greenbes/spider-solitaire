import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW: (_swUrl, registration) => {
      registration?.update().catch(() => {
        // noop
      })
    },
    onRegisterError: (error) => {
      console.error('Service worker registration failed', error)
    },
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
