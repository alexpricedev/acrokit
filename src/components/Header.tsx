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
  const { user, signOut, fakeLogin } = useAuth();
  const useFakeAuth = window.location.search.includes('fake-auth');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideUserMenu =
        userMenuRef.current && userMenuRef.current.contains(target);
      const clickedInsideNavMenu =
        navMenuRef.current && navMenuRef.current.contains(target);

      if (!clickedInsideUserMenu && !clickedInsideNavMenu) {
        setShowUserMenu(false);
        setShowNavMenu(false);
      }
    }

    if (showUserMenu || showNavMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserMenu, showNavMenu]);

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  const handleNavClick = (page: 'builder' | 'gallery' | 'public-gallery' | 'about') => {
    onPageChange(page);
    setShowNavMenu(false);
  };

  const navItems = [
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      page: 'about' as const
    },
    {
      id: 'builder',
      label: 'Flow Builder',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      page: 'builder' as const
    },
    {
      id: 'gallery',
      label: 'Public Gallery',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      ),
      page: 'public-gallery' as const
    },
    ...(user ? [{
      id: 'my-flows',
      label: 'My Flows',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      page: 'gallery' as const
    }] : [])
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                AcroKit<span className="text-blue-600">.</span>
              </h1>
              <p className="text-sm text-gray-600 ml-3 hidden md:block">
                Build and share your acro flows
              </p>
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center gap-3">
              {/* Main Navigation Dropdown */}
              <div className="relative" ref={navMenuRef}>
                <button
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  <span className="hidden sm:inline">Menu</span>
                </button>

                {showNavMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.page)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          currentPage === item.page ||
                          (item.page === 'public-gallery' && currentPage === 'flow-viewer')
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          currentPage === item.page ||
                          (item.page === 'public-gallery' && currentPage === 'flow-viewer')
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary CTA - Conditional based on user state */}
              {user ? (
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span className="hidden sm:inline">View my flows</span>
                  <span className="sm:hidden">My flows</span>
                </button>
              ) : (
                <button
                  onClick={() => openLoginModal('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <span className="hidden sm:inline">Create a free account</span>
                  <span className="sm:hidden">Sign up</span>
                </button>
              )}

              {/* User Menu - Only for logged in users */}
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-700">
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
              )}

              {/* Log in link for non-logged in users */}
              {!user && (
                <button
                  onClick={() => openLoginModal('login')}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  Log in
                </button>
              )}

              {/* Fake login for development */}
              {!user && useFakeAuth && fakeLogin && (
                <button
                  onClick={fakeLogin}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  🧪 Fake Login
                </button>
              )}
            </div>
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