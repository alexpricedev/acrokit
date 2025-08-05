import { useAuth } from './AuthProvider';
import { useState } from 'react';
import { LoginModal } from './LoginModal';
import flowBuilderImage from '../assets/flow-builder.png';

interface HomePageProps {
  onPageChange: (
    page:
      | 'home'
      | 'builder'
      | 'gallery'
      | 'public-gallery'
      | 'poses-gallery'
      | 'about'
      | 'account'
  ) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('signup');

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  const handleGetStarted = () => {
    if (user) {
      onPageChange('builder');
    } else {
      openLoginModal('signup');
    }
  };

  const handleExploreFlows = () => {
    onPageChange('public-gallery');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 pb-2">
                Build & Share
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-4 leading-tight">
                  AcroYoga Flows
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Never wonder &apos;what comes next?&apos; again. Build flowing sequences,
                save your favorites, and discover amazing flows from the
                community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Build Your Flow
                </button>
                <button
                  onClick={handleExploreFlows}
                  className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-lg border border-gray-200 shadow-sm"
                >
                  Explore Community Flows
                </button>
              </div>

              {/* Hero image */}
              <div className="relative max-w-4xl mx-auto">
                <div className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  <img
                    src={flowBuilderImage}
                    alt="Interactive Flow Builder showing acro yoga poses and transitions"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                The AcroKit Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Other platforms give you poses and videos. AcroKit gives you the
                tools to create sequences that are uniquely yours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-600"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Constraint-Based Building
                </h3>
                <p className="text-gray-600">
                  Only see poses that can actually follow your current sequence.
                  No more impossible transitions.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-600"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Named Transitions
                </h3>
                <p className="text-gray-600">
                  Every connection has a proper name. Learn the vocabulary as
                  you build your flows.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-purple-600"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Share & Practice
                </h3>
                <p className="text-gray-600">
                  Save your flows, share them publicly, and practice with
                  step-by-step guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Trusted by AcroYoga Practitioners
              </h2>
              <p className="text-xl text-gray-600">
                From beginners to advanced practitioners, AcroKit helps create
                better flows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder testimonials */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Taking a flow and remixing it to include the poses I
                  love to do is a game changer!&rdquo;
                </p>
                <div className="font-medium text-gray-900">Sarah Chen</div>
                <div className="text-sm text-gray-500">Acroyoga Student</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4">
                  &ldquo;I love being able to share the flows I create with my
                  students.&rdquo;
                </p>
                <div className="font-medium text-gray-900">
                  Marcus Rodriguez
                </div>
                <div className="text-sm text-gray-500">Workshop Leader</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4">
                  &ldquo;My students love practicing the flows I create with
                  AcroKit. Everything just works!&rdquo;
                </p>
                <div className="font-medium text-gray-900">Emma Thompson</div>
                <div className="text-sm text-gray-500">Acro Teacher</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your First Flow?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start from scratch or check out what the community has already
              made.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg"
              >
                Build Your Flow
              </button>
              <button
                onClick={() => onPageChange('public-gallery')}
                className="bg-transparent text-white px-8 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors font-medium text-lg"
              >
                Explore Community Flows
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-3">AcroKit</h3>
                <p className="text-gray-400 mb-4 max-w-[400px]">
                  The community platform for creating and sharing AcroYoga
                  sequences.
                </p>
                <button
                  onClick={() => onPageChange('about')}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Learn More About AcroKit →
                </button>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => onPageChange('builder')}
                      className="hover:text-white transition-colors"
                    >
                      Flow Builder
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('public-gallery')}
                      className="hover:text-white transition-colors"
                    >
                      Community Flows
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('poses-gallery')}
                      className="hover:text-white transition-colors"
                    >
                      Poses Gallery
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Account</h4>
                <ul className="space-y-2 text-gray-400">
                  {user ? (
                    <>
                      <li>
                        <button
                          onClick={() => onPageChange('gallery')}
                          className="hover:text-white transition-colors"
                        >
                          Your Flows
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => onPageChange('account')}
                          className="hover:text-white transition-colors"
                        >
                          Settings
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button
                          onClick={() => openLoginModal('signup')}
                          className="hover:text-white transition-colors"
                        >
                          Sign Up
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => openLoginModal('login')}
                          className="hover:text-white transition-colors"
                        >
                          Sign In
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} AcroKit. Built with{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="inline-block w-3 h-3 mx-0.5 fill-current"
                >
                  <path d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z" />
                </svg>{' '}
                in Sheffield by{' '}
                <a
                  href="https://github.com/alexpricedev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Alex Price
                </a>
                .
              </p>
            </div>
          </div>
        </footer>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        mode={loginMode}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
