export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          About AcroKit
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your companion for building safe, connected acroyoga flows
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🤸‍♀️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Constrained Flow Building
          </h2>
          <p className="text-gray-600">
            Only add poses that have valid transitions from your current sequence. 
            No more guessing - AcroKit ensures every move flows naturally into the next.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Named Transitions
          </h2>
          <p className="text-gray-600">
            Every transition has a proper name (like "Prasarita Twist"). 
            Learn the vocabulary while you build, making it easier to teach and remember flows.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🌟</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Public Gallery
          </h2>
          <p className="text-gray-600">
            Discover flows shared by the community. Browse, practice, and remix flows 
            created by other acro enthusiasts. Find inspiration for your next session.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Practice Mode
          </h2>
          <p className="text-gray-600">
            Step through flows pose by pose with our guided practice mode. 
            Navigate forward and backward, jump to specific poses, and focus on perfecting each transition.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">💾</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Save & Share
          </h2>
          <p className="text-gray-600">
            Build your personal library of flows. Save them privately for practice 
            or share them publicly to inspire the community. Each public flow gets its own shareable link.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🔄</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Remix & Customize
          </h2>
          <p className="text-gray-600">
            Found a flow you like? Remix it to your collection and make it your own. 
            Modify existing flows or use them as starting points for new creations.
          </p>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">
          Ready to start building safer, more connected flows?
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          Start Building Flows
        </button>
      </div>
    </div>
  )
}