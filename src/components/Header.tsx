import { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import { LoginModal } from './LoginModal'

interface HeaderProps {
  currentPage: 'builder' | 'gallery' | 'about'
  onPageChange: (page: 'builder' | 'gallery' | 'about') => void
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const desktopMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const clickedInsideMobile = mobileMenuRef.current && mobileMenuRef.current.contains(target)
      const clickedInsideDesktop = desktopMenuRef.current && desktopMenuRef.current.contains(target)
      
      if (!clickedInsideMobile && !clickedInsideDesktop) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showUserMenu])

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
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  Log in
                </button>
                <button 
                  onClick={() => setShowLoginModal(true)}
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
                <p className="text-sm text-gray-600 ml-3 hidden md:block">Build and share your acro flows</p>
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
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium hidden lg:inline">{user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}