import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  currentPage:
    | 'builder'
    | 'gallery'
    | 'public-gallery'
    | 'flow-viewer'
    | 'about';
  onPageChange: (
    page: 'builder' | 'gallery' | 'public-gallery' | 'about'
  ) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideMobile =
        mobileMenuRef.current && mobileMenuRef.current.contains(target);
      const clickedInsideDesktop =
        desktopMenuRef.current && desktopMenuRef.current.contains(target);

      if (!clickedInsideMobile && !clickedInsideDesktop) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserMenu]);

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between sm:hidden">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                AcroKit<span className="text-blue-600">.</span>
              </h1>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative" ref={mobileMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-700">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {user.email}
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openLoginModal('login')}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  Log in
                </button>
                <button
                  onClick={() => openLoginModal('signup')}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-start space-x-3 sm:space-x-6 mt-3 sm:hidden">
            <button
              onClick={() => onPageChange('about')}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors min-h-[40px] flex items-center ${
                currentPage === 'about'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => onPageChange('builder')}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors min-h-[40px] flex items-center ${
                currentPage === 'builder'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Flow builder
            </button>
            <button
              onClick={() => onPageChange('public-gallery')}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors min-h-[40px] flex items-center ${
                currentPage === 'public-gallery' ||
                currentPage === 'flow-viewer'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Gallery
            </button>
            {user && (
              <button
                onClick={() => onPageChange('gallery')}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors min-h-[40px] flex items-center ${
                  currentPage === 'gallery'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                My flows
              </button>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  AcroKit<span className="text-blue-600">.</span>
                </h1>
                <p className="text-sm text-gray-600 ml-3 hidden md:block">
                  Build and share your acro flows
                </p>
              </div>
            </div>

            <nav className="flex items-center space-x-6">
              <button
                onClick={() => onPageChange('about')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'about'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                About
              </button>
              <button
                onClick={() => onPageChange('builder')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'builder'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                Flow builder
              </button>
              <button
                onClick={() => onPageChange('public-gallery')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'public-gallery' ||
                  currentPage === 'flow-viewer'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                Gallery
              </button>
              {user && (
                <button
                  onClick={() => onPageChange('gallery')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 'gallery'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  My flows
                </button>
              )}

              {user ? (
                <div className="relative" ref={desktopMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {user.email}
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openLoginModal('login')}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openLoginModal('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        mode={loginMode}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
