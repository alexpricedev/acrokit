import { useState, useEffect } from 'react'
import { Pose, Transition, FlowStep } from '../lib/instant'
import { PoseCard } from './PoseCard'
import { FlowSaveModal } from './FlowSaveModal'
import { RandomFlowModal } from './RandomFlowModal'
import { useAuth } from './AuthProvider'
import { useToast } from './ToastProvider'
import { samplePoses, sampleTransitions } from '../data/sampleData'

interface FlowBuilderProps {
  initialFlow?: FlowStep[]
}

export function FlowBuilder({ initialFlow }: FlowBuilderProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [currentFlow, setCurrentFlow] = useState<FlowStep[]>(initialFlow || [])
  const [availablePoses, setAvailablePoses] = useState<Pose[]>([])
  const [availableTransitions, setAvailableTransitions] = useState<Transition[]>([])
  const [isStartingPose, setIsStartingPose] = useState(true)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showRandomModal, setShowRandomModal] = useState(false)

  // Initialize with sample data for demo
  useEffect(() => {
    // Convert sample data to have IDs and timestamps
    const posesWithIds: Pose[] = samplePoses.map((pose, index) => ({
      ...pose,
      id: pose.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: Date.now() - index * 1000
    }))

    const transitionsWithIds: Transition[] = sampleTransitions.map((transition, index) => ({
      ...transition,
      id: `${transition.fromPoseId}-to-${transition.toPoseId}`,
      createdAt: Date.now() - index * 1000
    }))

    setAvailablePoses(posesWithIds)
    setAvailableTransitions(transitionsWithIds)
  }, [])

  // Update flow state when initialFlow changes
  useEffect(() => {
    if (initialFlow) {
      setCurrentFlow(initialFlow)
      setIsStartingPose(initialFlow.length === 0)
    }
  }, [initialFlow])

  const getValidNextPoses = () => {
    if (isStartingPose) {
      // Show all poses that can be starting poses (have transitions from shin-to-shin)
      return availablePoses.filter(pose => 
        availableTransitions.some(t => t.toPoseId === pose.id && t.fromPoseId === 'shin-to-shin')
      )
    }

    if (currentFlow.length === 0) return []

    const lastPose = currentFlow[currentFlow.length - 1].pose
    const validTransitions = availableTransitions.filter(t => t.fromPoseId === lastPose.id)
    
    return validTransitions.map(transition => ({
      pose: availablePoses.find(p => p.id === transition.toPoseId),
      transition
    })).filter(item => item.pose) as { pose: Pose, transition: Transition }[]
  }

  const addPoseToFlow = (pose: Pose, transition?: Transition) => {
    setCurrentFlow(prev => [...prev, { pose, transition }])
    setIsStartingPose(false)
  }

  const removeLastPose = () => {
    setCurrentFlow(prev => {
      const newFlow = prev.slice(0, -1)
      if (newFlow.length === 0) {
        setIsStartingPose(true)
      }
      return newFlow
    })
  }

  const clearFlow = () => {
    setCurrentFlow([])
    setIsStartingPose(true)
  }

  const handleSaveFlow = () => {
    if (!user) {
      showToast('Please sign in to save flows', 'info')
      return
    }
    setShowSaveModal(true)
  }

  const generateRandomFlow = async (moveCount: number) => {
    try {
      // Clear existing flow
      setCurrentFlow([])
      setIsStartingPose(true)
      
      const newFlow: FlowStep[] = []
      let currentPoseOptions = availablePoses.filter(pose => 
        availableTransitions.some(t => t.fromPoseId === 'shin-to-shin' && t.toPoseId === pose.id)
      )
      
      for (let i = 0; i < moveCount; i++) {
        if (currentPoseOptions.length === 0) break
        
        // Select random pose from valid options
        const randomPose = currentPoseOptions[Math.floor(Math.random() * currentPoseOptions.length)]
        
        // Find transition for this pose (if not the first pose)
        let transition: Transition | undefined
        if (newFlow.length > 0) {
          const lastPose = newFlow[newFlow.length - 1].pose
          transition = availableTransitions.find(t => 
            t.fromPoseId === lastPose.id && t.toPoseId === randomPose.id
          )
        }
        
        // Add to flow
        newFlow.push({ pose: randomPose, transition })
        
        // Get next valid poses for the next iteration
        currentPoseOptions = availablePoses.filter(pose => 
          availableTransitions.some(t => t.fromPoseId === randomPose.id && t.toPoseId === pose.id)
        )
      }
      
      setCurrentFlow(newFlow)
      setIsStartingPose(newFlow.length === 0)
      
      showToast(`Generated random flow with ${newFlow.length} moves!`, 'success')
    } catch (error) {
      console.error('Error generating random flow:', error)
      showToast('Error generating random flow. Please try again.', 'error')
    }
  }

  const validOptions = getValidNextPoses()

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Your Flow */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your flow</h2>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                {currentFlow.length}
              </span>
            </div>
            
            {currentFlow.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-gray-600 mb-4">Add your first move or load a flow to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentFlow.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.pose.name}</div>
                      {step.transition && (
                        <div className="text-sm text-gray-500">via {step.transition.name}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {currentFlow.length === 0 && (
                <button
                  onClick={() => setShowRandomModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Create random flow
                </button>
              )}
              
              <button
                onClick={handleSaveFlow}
                disabled={currentFlow.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17,21 17,13 7,13 7,21"/>
                  <polyline points="7,3 7,8 15,8"/>
                </svg>
                {user ? 'Save flow' : 'Sign in to save'}
              </button>
              
              {currentFlow.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={removeLastPose}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove last
                  </button>
                  <button
                    onClick={clearFlow}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Available Moves */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                {isStartingPose ? 'Starting moves' : 'Available next moves'}
              </h2>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                {validOptions.length}
              </span>
            </div>
            
            {/* Difficulty Filter Pills */}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Easy</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">Medium</span>
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Hard</span>
            </div>
          </div>
          
          {validOptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-3">🤸‍♀️</div>
              <p className="text-gray-600">
                {isStartingPose 
                  ? 'Loading poses...' 
                  : 'No valid transitions available from current pose.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isStartingPose 
                ? (validOptions as Pose[]).map((pose) => (
                    <PoseCard
                      key={pose.id}
                      pose={pose}
                      onClick={() => addPoseToFlow(pose)}
                    />
                  ))
                : (validOptions as { pose: Pose, transition: Transition }[]).map(({ pose, transition }) => (
                    <div key={pose.id} className="space-y-2">
                      <div className="text-sm text-gray-500 font-medium px-1">
                        Via: {transition.name}
                      </div>
                      <PoseCard
                        pose={pose}
                        onClick={() => addPoseToFlow(pose, transition)}
                      />
                    </div>
                  ))
              }
            </div>
          )}
        </div>
      </div>

      <FlowSaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentFlow={currentFlow}
        user={user}
      />
      
      <RandomFlowModal
        isOpen={showRandomModal}
        onClose={() => setShowRandomModal(false)}
        onGenerate={generateRandomFlow}
      />
    </div>
  )
}