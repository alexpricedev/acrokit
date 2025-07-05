import { useState, useEffect } from 'react';
import './App.css';
import { HomePage } from './components/HomePage';
import { FlowBuilder } from './components/FlowBuilder';
import { FlowsGallery } from './components/FlowsGallery';
import { AboutPage } from './components/AboutPage';
import { PublicGallery } from './components/PublicGallery';
import { FlowViewer } from './components/FlowViewer';
import { AccountPage } from './components/AccountPage';
import { PosesGallery } from './components/PosesGallery';
import { PoseDetail } from './components/PoseDetail';
import { DisplayNameModal } from './components/DisplayNameModal';
import { Header } from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import { ToastProvider } from './components/ToastProvider';
import { useAuth } from './components/AuthProvider';
import { FlowStep, Flow } from './lib/instant';

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
    | 'home'
    | 'builder'
    | 'gallery'
    | 'public-gallery'
    | 'poses-gallery'
    | 'pose-detail'
    | 'flow-viewer'
    | 'about'
    | 'account'
  >('home');
  const [loadedFlow, setLoadedFlow] = useState<FlowStep[] | undefined>();
  const [editingFlowId, setEditingFlowId] = useState<string | undefined>();
  const [viewingFlowId, setViewingFlowId] = useState<string | null>(null);
  const [viewingPoseId, setViewingPoseId] = useState<string | null>(null);

  // URL routing function
  const handleRouting = () => {
    const path = window.location.pathname;

    // Handle URL routing
    if (path === '/') {
      setCurrentPage('home');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/builder') {
      setCurrentPage('builder');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/community') {
      setCurrentPage('public-gallery');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/flows') {
      setCurrentPage('gallery');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/poses') {
      setCurrentPage('poses-gallery');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/about') {
      setCurrentPage('about');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path === '/account') {
      setCurrentPage('account');
      setViewingFlowId(null);
      setViewingPoseId(null);
    } else if (path.startsWith('/flow/')) {
      const flowId = path.split('/flow/')[1];
      if (flowId) {
        setViewingFlowId(flowId);
        setCurrentPage('flow-viewer');
        setViewingPoseId(null);
      }
    } else if (path.startsWith('/pose/')) {
      const poseId = path.split('/pose/')[1];
      if (poseId) {
        setViewingPoseId(poseId);
        setCurrentPage('pose-detail');
        setViewingFlowId(null);
      }
    } else {
      setCurrentPage('home');
      setViewingFlowId(null);
      setViewingPoseId(null);
    }
  };

  // Handle URL routing on app load and browser navigation
  useEffect(() => {
    // Handle initial URL routing
    handleRouting();

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      handleRouting();
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLoadFlow = (flow: FlowStep[], flowId?: string) => {
    setLoadedFlow(flow);
    setEditingFlowId(flowId);
    setCurrentPage('builder');
    window.history.pushState({}, '', '/builder');
  };

  const handleEditFlow = (flow: Flow) => {
    try {
      const steps = JSON.parse(flow.stepsData) as FlowStep[];
      handleLoadFlow(steps, flow.id);
    } catch (error) {
      // Silently ignore parsing errors - flow will not load
    }
  };

  const handlePageChange = (
    page:
      | 'home'
      | 'builder'
      | 'gallery'
      | 'public-gallery'
      | 'poses-gallery'
      | 'about'
      | 'account'
  ) => {
    setCurrentPage(page);
    setViewingFlowId(null); // Clear flow viewer when changing pages
    setViewingPoseId(null); // Clear pose viewer when changing pages

    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'builder') {
      setLoadedFlow(undefined); // Clear loaded flow when manually switching to builder
      setEditingFlowId(undefined); // Clear editing flow ID
      window.history.pushState({}, '', '/builder');
    } else if (page === 'public-gallery') {
      window.history.pushState({}, '', '/community');
    } else if (page === 'gallery') {
      window.history.pushState({}, '', '/flows');
    } else if (page === 'poses-gallery') {
      window.history.pushState({}, '', '/poses');
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

  const handleViewPose = (poseId: string) => {
    setViewingPoseId(poseId);
    setCurrentPage('pose-detail');
    window.history.pushState({}, '', `/pose/${poseId}`);
  };

  const handleBackFromViewer = () => {
    setViewingFlowId(null);
    // Go back to public gallery by default - users can navigate if needed
    setCurrentPage('public-gallery');
    window.history.pushState({}, '', '/community');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {currentPage === 'home' ? (
          <HomePage onPageChange={handlePageChange} />
        ) : currentPage === 'builder' ? (
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
        ) : currentPage === 'poses-gallery' ? (
          <PosesGallery onViewPose={handleViewPose} />
        ) : currentPage === 'pose-detail' && viewingPoseId ? (
          <PoseDetail poseId={viewingPoseId} />
        ) : currentPage === 'flow-viewer' && viewingFlowId ? (
          <FlowViewer
            flowId={viewingFlowId}
            onBack={handleBackFromViewer}
            onLoadFlow={handleLoadFlow}
            onEditFlow={handleEditFlow}
          />
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'account' ? (
          <AccountPage />
        ) : (
          <HomePage onPageChange={handlePageChange} />
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
