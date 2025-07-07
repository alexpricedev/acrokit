import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  currentPage:
    | 'home'
    | 'builder'
    | 'gallery'
    | 'public-gallery'
    | 'poses-gallery'
    | 'pose-detail'
    | 'flow-viewer'
    | 'about'
    | 'account';
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

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);

  // Profile is now available from auth context
  const userProfile = profile;

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

  // Prevent body scroll when nav menu is open on mobile
  useEffect(() => {
    if (showNavMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showNavMenu]);

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  const handleNavClick = (
    page:
      | 'home'
      | 'builder'
      | 'gallery'
      | 'public-gallery'
      | 'poses-gallery'
      | 'about'
      | 'account'
  ) => {
    onPageChange(page);
    setShowNavMenu(false);
  };

  const navItems = [
    {
      id: 'builder',
      label: 'Flow Builder',
      description: 'Create seamless, connected acro sequences',
      icon: (
        <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
          <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
        </svg>
      ),
      page: 'builder' as const,
    },
    {
      id: 'gallery',
      label: 'Community Flows',
      description: 'Discover flows shared by the community',
      icon: (
        <svg width="20" height="20" viewBox="0 0 576 512" fill="currentColor">
          <path d="M160 80l352 0c8.8 0 16 7.2 16 16l0 224c0 8.8-7.2 16-16 16l-21.2 0L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336 160 336c-8.8 0-16-7.2-16-16l0-224c0-8.8 7.2-16 16-16zM96 96l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
      ),
      page: 'public-gallery' as const,
    },
    {
      id: 'poses',
      label: 'Poses Gallery',
      description: 'Explore all acroyoga poses with details and tips',
      icon: (
        <svg width="20" height="20" viewBox="0 0 576 512" fill="currentColor">
          <path d="M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z" />
        </svg>
      ),
      page: 'poses-gallery' as const,
    },
    {
      id: 'your-flows',
      label: 'Your Flows',
      description: 'View, practice and edit your saved flows',
      icon: (
        <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
          <path d="M256 64A64 64 0 1 0 128 64a64 64 0 1 0 128 0zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4L112 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96 32 0 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-258.4c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z" />
        </svg>
      ),
      page: 'gallery' as const,
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick('home')}
                className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                AcroKit<span className="text-blue-600">.</span>
              </button>
              <p className="text-sm text-gray-600 ml-3 hidden md:block">
                Build and share your acro flows
              </p>
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center gap-3">
              {/* Main Navigation Dropdown */}
              <div className="relative" ref={navMenuRef}>
                <button
                  onClick={() => {
                    setShowNavMenu(!showNavMenu);
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="hidden sm:inline">Menu</span>
                </button>

                {showNavMenu && (
                  <div
                    className="fixed left-4 right-4 mt-2 sm:absolute sm:left-auto sm:right-0 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50"
                    style={{ top: '60px' }}
                  >
                    <div className="space-y-2">
                      {navItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.page)}
                          className={`w-full flex items-start gap-4 px-4 py-3 text-left rounded-lg transition-all duration-200 hover:shadow-sm ${
                            currentPage === item.page ||
                            (item.page === 'public-gallery' &&
                              currentPage === 'flow-viewer') ||
                            (item.page === 'poses-gallery' &&
                              currentPage === 'pose-detail')
                              ? 'bg-blue-50 text-blue-700 border border-transparent shadow-sm hover:bg-blue-100'
                              : 'text-gray-700 border border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 mt-0.5 ${
                              currentPage === item.page ||
                              (item.page === 'public-gallery' &&
                                currentPage === 'flow-viewer') ||
                              (item.page === 'poses-gallery' &&
                                currentPage === 'pose-detail')
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Primary CTA - Sign up for non-logged users */}
              {!user && (
                <button
                  onClick={() => openLoginModal('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <span className="hidden sm:inline">
                    Create a Free Account
                  </span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              )}

              {/* Login Icon Button - for non-logged users */}
              {!user && (
                <button
                  onClick={() => openLoginModal('login')}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-700"
                  title="Sign in"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                  </svg>
                </button>
              )}

              {/* User Menu - Only for logged in users */}
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNavMenu(false);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center text-white font-semibold text-sm sm:text-base"
                  >
                    {userProfile?.displayName?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase()}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {userProfile?.displayName && (
                          <div className="font-medium text-gray-900 mb-1">
                            {userProfile.displayName}
                          </div>
                        )}
                        <div>{user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          handleNavClick('about');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        About AcroKit
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('account');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
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
