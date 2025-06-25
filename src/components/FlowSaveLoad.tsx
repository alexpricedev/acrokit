import { useState } from 'react'
import { Pose, Transition } from '../lib/instant'

interface FlowStep {
  pose: Pose
  transition?: Transition
}

interface SavedFlow {
  id: string
  name: string
  description?: string
  steps: FlowStep[]
  isPublic: boolean
  createdAt: number
}

interface FlowSaveLoadProps {
  currentFlow: FlowStep[]
  onLoadFlow: (flow: FlowStep[]) => void
}

export function FlowSaveLoad({ currentFlow, onLoadFlow }: FlowSaveLoadProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [flowName, setFlowName] = useState('')
  const [flowDescription, setFlowDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [savedFlows, setSavedFlows] = useState<SavedFlow[]>([])

  // Load saved flows from localStorage on component mount
  useState(() => {
    const saved = localStorage.getItem('acrokit-saved-flows')
    if (saved) {
      try {
        setSavedFlows(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved flows:', error)
      }
    }
  })

  const saveFlow = () => {
    if (!flowName.trim() || currentFlow.length === 0) return

    const newFlow: SavedFlow = {
      id: `flow-${Date.now()}`,
      name: flowName.trim(),
      description: flowDescription.trim() || undefined,
      steps: currentFlow,
      isPublic,
      createdAt: Date.now()
    }

    const updatedFlows = [...savedFlows, newFlow]
    setSavedFlows(updatedFlows)
    localStorage.setItem('acrokit-saved-flows', JSON.stringify(updatedFlows))

    // Reset form
    setFlowName('')
    setFlowDescription('')
    setIsPublic(false)
    setShowSaveModal(false)
  }

  const loadFlow = (flow: SavedFlow) => {
    onLoadFlow(flow.steps)
    setShowLoadModal(false)
  }

  const deleteFlow = (flowId: string) => {
    const updatedFlows = savedFlows.filter(flow => flow.id !== flowId)
    setSavedFlows(updatedFlows)
    localStorage.setItem('acrokit-saved-flows', JSON.stringify(updatedFlows))
  }

  const getFlowPreview = (steps: FlowStep[]) => {
    return steps.map(step => step.pose.name).join(' → ')
  }

  const shareFlow = (flow: SavedFlow) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${flow.id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Shareable link copied to clipboard!')
    }).catch(() => {
      prompt('Copy this link to share:', shareUrl)
    })
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowSaveModal(true)}
        disabled={currentFlow.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Flow
      </button>
      
      <button
        onClick={() => setShowLoadModal(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Load Flow
      </button>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Flow</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flow Name *
                </label>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter flow name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={flowDescription}
                  onChange={(e) => setFlowDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make public (shareable)
                </label>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Preview:</strong> {getFlowPreview(currentFlow)}
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={saveFlow}
                disabled={!flowName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Load Saved Flow</h3>
            
            {savedFlows.length === 0 ? (
              <p className="text-gray-500 italic">No saved flows found.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {savedFlows.map((flow) => (
                  <div key={flow.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{flow.name}</h4>
                        {flow.description && (
                          <p className="text-sm text-gray-600 mt-1">{flow.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {getFlowPreview(flow.steps)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(flow.createdAt).toLocaleDateString()}
                          {flow.isPublic && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              Public
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => loadFlow(flow)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Load
                        </button>
                        {flow.isPublic && (
                          <button
                            onClick={() => shareFlow(flow)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            Share
                          </button>
                        )}
                        <button
                          onClick={() => deleteFlow(flow.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}