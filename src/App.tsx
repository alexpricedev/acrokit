import { useState } from 'react'
import './App.css'
import { FlowBuilder } from './components/FlowBuilder'
import { FlowsGallery } from './components/FlowsGallery'
import { Header } from './components/Header'
import { AuthProvider } from './components/AuthProvider'
import { FlowStep } from './lib/instant'

function App() {
  const [currentPage, setCurrentPage] = useState<'builder' | 'gallery'>('builder')
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>()

  const handleLoadFlow = (flow: FlowStep[]) => {
    setLoadedFlow(flow)
    setCurrentPage('builder')
  }

  const handlePageChange = (page: 'builder' | 'gallery') => {
    setCurrentPage(page)
    if (page === 'builder') {
      setLoadedFlow(undefined) // Clear loaded flow when manually switching to builder
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
        <main>
          {currentPage === 'builder' ? (
            <FlowBuilder initialFlow={loadedFlow} />
          ) : (
            <FlowsGallery onLoadFlow={handleLoadFlow} onPageChange={setCurrentPage} />
          )}
        </main>
      </div>
    </AuthProvider>
  )
}

export default App