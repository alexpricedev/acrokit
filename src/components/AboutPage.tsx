export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          About AcroKit
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Born from frustration with broken flows and impossible transitions
        </p>
      </div>

      {/* Personal Story Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          The Story Behind AcroKit
        </h2>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            Hi, I&apos;m the creator of AcroKit. Like many acroyoga
            practitioners, I spent years frustrated with flow builders that let
            you create impossible sequences. You&apos;d spend time crafting what
            looked like a beautiful flow, only to discover during practice that
            half the transitions were physically impossible or awkward.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The breaking point came during a workshop where I spent 30 minutes
            building a &ldquo;perfect&rdquo; flow for my students, only to
            realize mid-session that there was no logical way to get from Bird
            Pose to Standing Hand-to-Hand without an uncomfortable dismount and
            reset. My students were confused, I was embarrassed, and the flow
            was ruined.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            That night, I had a simple idea: what if the tool only showed you
            poses you could actually transition to? What if building flows was
            constrained by real biomechanics and physics, not just wishful
            thinking?
          </p>

          <p className="text-gray-700 leading-relaxed">
            AcroKit was born from that frustration and that insight. Every
            transition has been carefully curated to ensure it actually works in
            practice. Every pose suggestion is filtered by what&apos;s
            physically possible from your current position. The result? Flows
            that work the first time, every time.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🏗️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Flow Builder
          </h2>
          <p className="text-gray-600">
            Create beautiful acroyoga sequences with our intelligent flow
            builder. Only compatible poses appear as options, ensuring every
            transition is seamless and logical.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">💾</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Save & Share
          </h2>
          <p className="text-gray-600">
            Build your personal library of flows. Save them privately for
            practice or share them publicly to inspire the community. Each
            public flow gets its own shareable link.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🌟</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Community Flows
          </h2>
          <p className="text-gray-600">
            Discover flows shared by the community. Browse, practice, and remix
            flows created by other acro enthusiasts. Find inspiration for your
            next session.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Practice Mode
          </h2>
          <p className="text-gray-600">
            Step through flows pose by pose with our guided practice mode.
            Navigate forward and backward, jump to specific poses, and focus on
            perfecting each transition.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Favorite Poses
          </h2>
          <p className="text-gray-600">
            Mark your favorite poses with a heart to build your personal
            collection. Filter flows to show only your favorites, making it easy
            to find and use your go-to poses. Sign in to start building your
            favorites collection.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Named Transitions
          </h2>
          <p className="text-gray-600">
            Every transition has a proper name (like &ldquo;Prasarita
            Twist&rdquo;). Learn the vocabulary while you build, making it
            easier to teach and remember flows.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🔄</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Remix & Customize
          </h2>
          <p className="text-gray-600">
            Found a flow you like? Remix it to your collection and make it your
            own. Modify existing flows or use them as starting points for new
            creations.
          </p>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">
          Ready to start building safer, more connected flows?
        </p>
        <button
          onClick={() => (window.location.href = '/builder')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          Start Building Flows
        </button>
      </div>
    </div>
  );
}
