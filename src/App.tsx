import { MotionConfig } from 'framer-motion'
import { lazy } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { SmoothScroll } from './components/layout/SmoothScroll'
import Home from './pages/Home'

// Secondary routes are code-split so the homepage loads first.
const Designs = lazy(() => import('./pages/Designs'))
const DesignDetail = lazy(() => import('./pages/DesignDetail'))
const Services = lazy(() => import('./pages/Services'))
const Projects = lazy(() => import('./pages/Projects'))
const BookVisit = lazy(() => import('./pages/BookVisit'))
const Privacy = lazy(() => import('./pages/Privacy'))
const StudioInquiries = lazy(() => import('./pages/StudioInquiries'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <SmoothScroll>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="designs" element={<Designs />} />
              <Route path="designs/:slug" element={<DesignDetail />} />
              <Route path="services" element={<Services />} />
              <Route path="projects" element={<Projects />} />
              <Route path="book-a-site-visit" element={<BookVisit />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="studio/inquiries" element={<StudioInquiries />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SmoothScroll>
      </Router>
    </MotionConfig>
  )
}
