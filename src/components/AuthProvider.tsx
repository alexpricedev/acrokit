import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { db } from '../lib/instant';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';
import { User, Profile } from '../lib/instant';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => void;
  showDisplayNameModal: boolean;
  setDisplayNameAndCloseModal: (displayName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Real InstantDB auth with profile
  const { user, profile, isLoading, needsDisplayName } = useAuthWithProfile();

  // Display name modal state
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);

  const signInWithEmail = async (email: string) => {
    await db.auth.sendMagicCode({ email });
  };

  const verifyCode = async (email: string, code: string) => {
    await db.auth.signInWithMagicCode({ email, code });
  };

  const signOut = () => {
    db.auth.signOut();
  };

  // Check if user needs to set display name
  useEffect(() => {
    if (needsDisplayName) {
      setShowDisplayNameModal(true);
    }
  }, [needsDisplayName]);

  const handleDisplayNameSet = (_displayName: string) => {
    setShowDisplayNameModal(false);
    // The display name is handled by the useAuthWithProfile hook
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithEmail,
        verifyCode,
        signOut,
        showDisplayNameModal,
        setDisplayNameAndCloseModal: handleDisplayNameSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
