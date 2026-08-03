import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { site } from './content'
import './index.css'

/* Title and description come from content/site.yaml so the tab and the
   search snippet stay in step with the page without a second edit. */
document.title = site.meta.title
document
  .querySelector('meta[name="description"]')
  ?.setAttribute('content', site.meta.description)

const root = document.getElementById('root')
if (!root) throw new Error('No #root element in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
