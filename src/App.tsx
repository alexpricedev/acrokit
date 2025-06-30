import { useState, useEffect } from 'react'
import './App.css'
import { FlowBuilder } from './components/FlowBuilder'
import { FlowsGallery } from './components/FlowsGallery'
import { PublicGallery } from './components/PublicGallery'
import { FlowViewer } from './components/FlowViewer'
import { Header } from './components/Header'
import { AuthProvider } from './components/AuthProvider'
import { ToastProvider } from './components/ToastProvider'
import { SharedFlowLoader } from './components/SharedFlowLoader'
import { FlowStep } from './lib/instant'

function App() {
  const [currentPage, setCurrentPage] = useState<'builder' | 'gallery' | 'public-gallery' | 'flow-viewer'>('builder')
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>()
  const [sharedFlowId, setSharedFlowId] = useState<string | null>(null)
  const [viewingFlowId, setViewingFlowId] = useState<string | null>(null)

  // Check URL routing on app load
  useEffect(() => {
    const path = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    
    // Handle legacy shared flow URLs
    const shared = urlParams.get('shared')
    if (shared) {
      setSharedFlowId(shared)
      setCurrentPage('builder') // Go to builder to show the shared flow
      return
    }
    
    // Handle new URL routing
    if (path === '/gallery') {
      setCurrentPage('public-gallery')
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
    setSharedFlowId(null) // Clear shared flow when loading a regular flow
    setCurrentPage('builder')
  }

  const handleSharedFlowLoad = (flow: FlowStep[]) => {
    setLoadedFlow(flow)
    setSharedFlowId(null) // Clear shared flow ID after loading
  }

  const handlePageChange = (page: 'builder' | 'gallery' | 'public-gallery') => {
    setCurrentPage(page)
    setViewingFlowId(null) // Clear flow viewer when changing pages
    
    if (page === 'builder') {
      setLoadedFlow(undefined) // Clear loaded flow when manually switching to builder
      setSharedFlowId(null) // Clear shared flow ID
      window.history.pushState({}, '', '/')
    } else if (page === 'public-gallery') {
      window.history.pushState({}, '', '/gallery')
    } else if (page === 'gallery') {
      window.history.pushState({}, '', '/')
    }
  }

  const handleViewFlow = (flowId: string) => {
    setViewingFlowId(flowId)
    setCurrentPage('flow-viewer')
    window.history.pushState({}, '', `/flow/${flowId}`)
  }

  const handleBackFromViewer = () => {
    setViewingFlowId(null)
    setCurrentPage('public-gallery')
    window.history.pushState({}, '', '/gallery')
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} onPageChange={handlePageChange} />
          <main>
            {sharedFlowId ? (
              <SharedFlowLoader 
                flowId={sharedFlowId} 
                onFlowLoad={handleSharedFlowLoad}
                onError={() => setSharedFlowId(null)}
              />
            ) : currentPage === 'builder' ? (
              <FlowBuilder initialFlow={loadedFlow} />
            ) : currentPage === 'gallery' ? (
              <FlowsGallery onLoadFlow={handleLoadFlow} onPageChange={setCurrentPage} />
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