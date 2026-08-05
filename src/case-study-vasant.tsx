import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { caseStudyVasant, site } from './content'
import './index.css'
import { CaseStudy } from './pages/CaseStudy'

document.title = `${caseStudyVasant.title} — Case Study — ${site.meta.name}`

const root = document.getElementById('root')
if (!root) throw new Error('No #root element in case-study-vasant.html')

createRoot(root).render(
  <StrictMode>
    <CaseStudy data={caseStudyVasant} backHref={`${import.meta.env.BASE_URL}#projects`} />
  </StrictMode>,
)
