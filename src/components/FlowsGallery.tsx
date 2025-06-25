import { useState, useEffect } from 'react'
import { Flow, FlowStep, db } from '../lib/instant'
import { useAuth } from './AuthProvider'
import { useToast } from './ToastProvider'

interface FlowsGalleryProps {
  onLoadFlow: (flow: FlowStep[]) => void
  onPageChange: (page: 'builder' | 'gallery') => void
}

export function FlowsGallery({ onLoadFlow, onPageChange }: FlowsGalleryProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [flows, setFlows] = useState<Flow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load flows from InstantDB
  const { isLoading: dbLoading, data } = db.useQuery({
    flows: {
      $: {
        where: {
          userId: user?.id
        }
      }
    }
  })

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }
    
    if (!dbLoading && data?.flows) {
      setFlows(data.flows as Flow[])
      setIsLoading(false)
    }
  }, [user, dbLoading, data])

  const handleLoadFlow = (flow: Flow) => {
    try {
      const steps = JSON.parse(flow.stepsData) as FlowStep[]
      onLoadFlow(steps)
      // Don't call onPageChange - onLoadFlow already handles page navigation
    } catch (error) {
      console.error('Error loading flow:', error)
    }
  }

  const handleDeleteFlow = async (flowId: string) => {
    try {
      await db.transact(
        db.tx.flows[flowId].delete()
      )
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      console.error('Error deleting flow:', error)
      showToast('Error deleting flow. Please try again.', 'error')
    }
  }

  const togglePublic = async (flowId: string) => {
    try {
      const flow = flows.find(f => f.id === flowId)
      if (!flow) return
      
      await db.transact(
        db.tx.flows[flowId].update({
          isPublic: !flow.isPublic,
          updatedAt: Date.now()
        })
      )
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      console.error('Error updating flow:', error)
      showToast('Error updating flow. Please try again.', 'error')
    }
  }

  const getFlowPreview = (stepsData: string) => {
    try {
      const steps = JSON.parse(stepsData) as FlowStep[]
      return steps.map(step => step.pose.name).join(' → ')
    } catch {
      return 'Invalid flow data'
    }
  }

  const shareFlow = (flow: Flow) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${flow.id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Shareable link copied to clipboard!', 'success')
    }).catch(() => {
      showToast('Failed to copy to clipboard. Check console for link.', 'error')
      console.log('Share link:', shareUrl)
    })
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-600">You need to be signed in to view your saved flows.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your flows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My flows</h1>
          <p className="text-gray-600">Manage your saved acroyoga flow sequences</p>
        </div>
        
        <button
          onClick={() => onPageChange('builder')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create new flow
        </button>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🤸‍♀️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No flows yet</h2>
          <p className="text-gray-600 mb-6">Create your first acroyoga flow sequence to get started.</p>
          <button
            onClick={() => onPageChange('builder')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start building
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{flow.name}</h3>
                    {flow.description && (
                      <p className="text-gray-600 text-sm mb-3">{flow.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mb-3">
                      {getFlowPreview(flow.stepsData)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(flow.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublic(flow.id)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        flow.isPublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {flow.isPublic ? 'Public' : 'Private'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadFlow(flow)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Load & Edit
                  </button>
                  
                  {flow.isPublic && (
                    <button
                      onClick={() => shareFlow(flow)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Share
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteFlow(flow.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Gradient bottom border */}
              <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}