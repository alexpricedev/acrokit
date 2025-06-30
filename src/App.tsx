import { useState, useEffect } from 'react'
import './App.css'
import { FlowBuilder } from './components/FlowBuilder'
import { FlowsGallery } from './components/FlowsGallery'
import { PublicGallery } from './components/PublicGallery'
import { FlowViewer } from './components/FlowViewer'
import { Header } from './components/Header'
import { AuthProvider } from './components/AuthProvider'
import { ToastProvider } from './components/ToastProvider'
import { FlowStep } from './lib/instant'

function App() {
  const [currentPage, setCurrentPage] = useState<'builder' | 'gallery' | 'public-gallery' | 'flow-viewer'>('builder')
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>()
  const [viewingFlowId, setViewingFlowId] = useState<string | null>(null)

  // Check URL routing on app load
  useEffect(() => {
    const path = window.location.pathname
    
    // Handle URL routing
    if (path === '/gallery') {
      setCurrentPage('public-gallery')
    } else if (path === '/my-flows') {
      setCurrentPage('gallery')
    } else if (path.startsWith('/flow/')) {
      const flowId = path.split('/flow/')[1]
      if (flowId) {
        setViewingFlowId(flowId)
        setCurrentPage('flow-viewer')
      }
    } else {
      setCurrentPage('builder')
    }
  }, [])

  const handleLoadFlow = (flow: FlowStep[]) => {
    setLoadedFlow(flow)
    setCurrentPage('builder')
  }

  const handlePageChange = (page: 'builder' | 'gallery' | 'public-gallery') => {
    setCurrentPage(page)
    setViewingFlowId(null) // Clear flow viewer when changing pages
    
    if (page === 'builder') {
      setLoadedFlow(undefined) // Clear loaded flow when manually switching to builder
      window.history.pushState({}, '', '/')
    } else if (page === 'public-gallery') {
      window.history.pushState({}, '', '/gallery')
    } else if (page === 'gallery') {
      window.history.pushState({}, '', '/my-flows')
    }
  }

  const handleViewFlow = (flowId: string) => {
    setViewingFlowId(flowId)
    setCurrentPage('flow-viewer')
    window.history.pushState({}, '', `/flow/${flowId}`)
  }

  const handleBackFromViewer = () => {
    setViewingFlowId(null)
    // Go back to public gallery by default - users can navigate if needed
    setCurrentPage('public-gallery')
    window.history.pushState({}, '', '/gallery')
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} onPageChange={handlePageChange} />
          <main>
            {currentPage === 'builder' ? (
              <FlowBuilder initialFlow={loadedFlow} />
            ) : currentPage === 'gallery' ? (
              <FlowsGallery onLoadFlow={handleLoadFlow} onPageChange={setCurrentPage} onPracticeFlow={handleViewFlow} />
            ) : currentPage === 'public-gallery' ? (
              <PublicGallery onViewFlow={handleViewFlow} />
            ) : currentPage === 'flow-viewer' && viewingFlowId ? (
              <FlowViewer flowId={viewingFlowId} onBack={handleBackFromViewer} />
            ) : (
              <FlowBuilder initialFlow={loadedFlow} />
            )}
          </main>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App