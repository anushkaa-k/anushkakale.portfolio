import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { caseStudyAlive, site } from './content'
import './index.css'
import { CaseStudyAlive } from './pages/CaseStudyAlive'

document.title = `${caseStudyAlive.title} — Case Study — ${site.meta.name}`

const root = document.getElementById('root')
if (!root) throw new Error('No #root element in case-study-alive.html')

createRoot(root).render(
  <StrictMode>
    <CaseStudyAlive data={caseStudyAlive} backHref={`${import.meta.env.BASE_URL}#projects`} />
  </StrictMode>,
)
