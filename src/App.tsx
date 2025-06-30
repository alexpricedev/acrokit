import { useState, useEffect } from 'react'
import './App.css'
import { FlowBuilder } from './components/FlowBuilder'
import { FlowsGallery } from './components/FlowsGallery'
import { AboutPage } from './components/AboutPage'
import { Header } from './components/Header'
import { AuthProvider } from './components/AuthProvider'
import { ToastProvider } from './components/ToastProvider'
import { SharedFlowLoader } from './components/SharedFlowLoader'
import { FlowStep } from './lib/instant'

function App() {
  const [currentPage, setCurrentPage] = useState<'builder' | 'gallery' | 'about'>('builder')
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>()
  const [sharedFlowId, setSharedFlowId] = useState<string | null>(null)

  // Check for shared flow ID in URL on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shared = urlParams.get('shared')
    if (shared) {
      setSharedFlowId(shared)
      setCurrentPage('builder') // Go to builder to show the shared flow
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

  const handlePageChange = (page: 'builder' | 'gallery' | 'about') => {
    setCurrentPage(page)
    if (page === 'builder') {
      setLoadedFlow(undefined) // Clear loaded flow when manually switching to builder
      setSharedFlowId(null) // Clear shared flow ID
    }
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
            ) : (
              <AboutPage />
            )}
          </main>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App