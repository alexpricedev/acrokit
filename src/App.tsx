import { useState, useEffect } from 'react';
import './App.css';
import { FlowBuilder } from './components/FlowBuilder';
import { FlowsGallery } from './components/FlowsGallery';
import { AboutPage } from './components/AboutPage';
import { PublicGallery } from './components/PublicGallery';
import { FlowViewer } from './components/FlowViewer';
import { AccountPage } from './components/AccountPage';
import { DisplayNameModal } from './components/DisplayNameModal';
import { Header } from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import { ToastProvider } from './components/ToastProvider';
import { useAuth } from './components/AuthProvider';
import { FlowStep } from './lib/instant';

// Inner component that has access to auth context
function AppContent() {
  const { user, showDisplayNameModal, setDisplayNameAndCloseModal } = useAuth();

  return (
    <>
      <AppRouter />

      {/* Display Name Modal */}
      <DisplayNameModal
        isOpen={showDisplayNameModal}
        onClose={setDisplayNameAndCloseModal}
        userEmail={user?.email || ''}
      />
    </>
  );
}

function AppRouter() {
  const [currentPage, setCurrentPage] = useState<
    | 'builder'
    | 'gallery'
    | 'public-gallery'
    | 'flow-viewer'
    | 'about'
    | 'account'
  >('builder');
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>();
  const [editingFlowId, setEditingFlowId] = useState<string | undefined>();
  const [viewingFlowId, setViewingFlowId] = useState<string | null>(null);

  // Check URL routing on app load
  useEffect(() => {
    const path = window.location.pathname;

    // Handle URL routing
    if (path === '/gallery') {
      setCurrentPage('public-gallery');
    } else if (path === '/flows') {
      setCurrentPage('gallery');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/account') {
      setCurrentPage('account');
    } else if (path.startsWith('/flow/')) {
      const flowId = path.split('/flow/')[1];
      if (flowId) {
        setViewingFlowId(flowId);
        setCurrentPage('flow-viewer');
      }
    } else {
      setCurrentPage('builder');
    }
  }, []);

  const handleLoadFlow = (flow: FlowStep[], flowId?: string) => {
    setLoadedFlow(flow);
    setEditingFlowId(flowId);
    setCurrentPage('builder');
    window.history.pushState({}, '', '/');
  };

  const handlePageChange = (
    page: 'builder' | 'gallery' | 'public-gallery' | 'about' | 'account'
  ) => {
    setCurrentPage(page);
    setViewingFlowId(null); // Clear flow viewer when changing pages

    if (page === 'builder') {
      setLoadedFlow(undefined); // Clear loaded flow when manually switching to builder
      setEditingFlowId(undefined); // Clear editing flow ID
      window.history.pushState({}, '', '/');
    } else if (page === 'public-gallery') {
      window.history.pushState({}, '', '/gallery');
    } else if (page === 'gallery') {
      window.history.pushState({}, '', '/flows');
    } else if (page === 'about') {
      window.history.pushState({}, '', '/about');
    } else if (page === 'account') {
      window.history.pushState({}, '', '/account');
    }
  };

  const handleViewFlow = (flowId: string) => {
    setViewingFlowId(flowId);
    setCurrentPage('flow-viewer');
    window.history.pushState({}, '', `/flow/${flowId}`);
  };

  const handleBackFromViewer = () => {
    setViewingFlowId(null);
    // Go back to public gallery by default - users can navigate if needed
    setCurrentPage('public-gallery');
    window.history.pushState({}, '', '/gallery');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {currentPage === 'builder' ? (
          <FlowBuilder initialFlow={loadedFlow} editingFlowId={editingFlowId} />
        ) : currentPage === 'gallery' ? (
          <FlowsGallery
            onLoadFlow={handleLoadFlow}
            onPageChange={setCurrentPage}
            onPracticeFlow={handleViewFlow}
          />
        ) : currentPage === 'public-gallery' ? (
          <PublicGallery
            onViewFlow={handleViewFlow}
            onLoadFlow={handleLoadFlow}
          />
        ) : currentPage === 'flow-viewer' && viewingFlowId ? (
          <FlowViewer
            flowId={viewingFlowId}
            onBack={handleBackFromViewer}
            onLoadFlow={handleLoadFlow}
          />
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'account' ? (
          <AccountPage />
        ) : (
          <FlowBuilder initialFlow={loadedFlow} editingFlowId={editingFlowId} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
