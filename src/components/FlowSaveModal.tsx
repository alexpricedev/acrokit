import { useState } from 'react'
import { FlowStep } from '../lib/instant'

interface FlowSaveModalProps {
  isOpen: boolean
  onClose: () => void
  currentFlow: FlowStep[]
  user: any
}

export function FlowSaveModal({ isOpen, onClose, currentFlow, user }: FlowSaveModalProps) {
  const [flowName, setFlowName] = useState('')
  const [flowDescription, setFlowDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const getFlowPreview = (steps: FlowStep[]) => {
    return steps.map(step => step.pose.name).join(' → ')
  }

  const handleSave = async () => {
    if (!flowName.trim() || currentFlow.length === 0 || !user) return

    setIsSaving(true)
    
    try {
      const newFlow = {
        id: `flow-${Date.now()}`,
        name: flowName.trim(),
        description: flowDescription.trim() || undefined,
        steps: currentFlow,
        isPublic,
        userId: user.id,
        createdAt: Date.now()
      }

      // Save to localStorage for now (in real app, this would be InstantDB)
      const savedFlows = JSON.parse(localStorage.getItem('acrokit-saved-flows') || '[]')
      const updatedFlows = [...savedFlows, newFlow]
      localStorage.setItem('acrokit-saved-flows', JSON.stringify(updatedFlows))

      // Reset form and close
      setFlowName('')
      setFlowDescription('')
      setIsPublic(false)
      onClose()
      
      alert('Flow saved successfully!')
    } catch (error) {
      console.error('Error saving flow:', error)
      alert('Error saving flow. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setFlowName('')
    setFlowDescription('')
    setIsPublic(false)
    setIsSaving(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Save flow</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flow name *
            </label>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter flow name"
              disabled={isSaving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Optional description"
              disabled={isSaving}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
              disabled={isSaving}
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make public (shareable with others)
            </label>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-1">Preview:</div>
            <div className="text-sm text-gray-600">{getFlowPreview(currentFlow)}</div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!flowName.trim() || isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save flow'}
          </button>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}