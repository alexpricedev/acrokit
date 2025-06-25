import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { LoginModal } from './LoginModal'

interface HeaderProps {
  currentPage: 'builder' | 'gallery'
  onPageChange: (page: 'builder' | 'gallery') => void
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                AcroKit<span className="text-blue-600">.</span>
              </h1>
              <p className="text-sm text-gray-600 ml-3">Build and share your acro flows</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => onPageChange('builder')}
              className={`font-medium ${currentPage === 'builder' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
            >
              Flow builder
            </button>
            {user && (
              <button 
                onClick={() => onPageChange('gallery')}
                className={`font-medium ${currentPage === 'gallery' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              >
                My flows
              </button>
            )}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user.email}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
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
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}