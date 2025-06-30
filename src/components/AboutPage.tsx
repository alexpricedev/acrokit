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
          <div className="text-3xl mb-4">💾</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Save & Share
          </h2>
          <p className="text-gray-600">
            Build your personal library of flows. Save them privately for practice 
            or share them publicly to inspire the community.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">📱</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Access Anywhere
          </h2>
          <p className="text-gray-600">
            Practice at home, in the park, or at the studio. Your flows are 
            available on any device, whenever inspiration strikes.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Why Constrained Building?
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Traditional flow building can lead to unsafe transitions or awkward sequences. 
          AcroKit's constraint-based approach ensures every flow is not only beautiful 
          but also safe and achievable. Focus on creativity, not safety concerns.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
            ✓ Safer practice
          </span>
          <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
            ✓ Smooth transitions
          </span>
          <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
            ✓ Learn proper names
          </span>
          <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
            ✓ Build confidence
          </span>
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