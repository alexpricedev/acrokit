import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { db } from '../lib/instant';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => void;
  fakeLogin?: () => void; // For testing only
  showDisplayNameModal: boolean;
  setDisplayNameAndCloseModal: (displayName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check if we're in development mode and want to use fake auth for testing
  const useFakeAuth = window.location.search.includes('fake-auth');

  // Real InstantDB auth with profile
  const { user: realUser, profile: realProfile, isLoading: realIsLoading, needsDisplayName } = useAuthWithProfile();

  // Fake auth state for testing
  const [fakeUser, setFakeUser] = useState<any>(null);

  // Display name modal state
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);

  // Load fake user from localStorage on mount
  useEffect(() => {
    if (useFakeAuth) {
      const stored = localStorage.getItem('fake-auth-user');
      if (stored) {
        setFakeUser(JSON.parse(stored));
      }
    }
  }, [useFakeAuth]);

  const signInWithEmail = async (email: string) => {
    if (useFakeAuth) {
      // For fake auth, just pretend to send the code
      return;
    }
    await db.auth.sendMagicCode({ email });
  };

  const verifyCode = async (email: string, code: string) => {
    if (useFakeAuth) {
      // For fake auth, accept any 6-digit code
      if (code.length === 6) {
        const user = {
          id: 'fake-user-id',
          email: email,
          createdAt: Date.now(),
        };
        setFakeUser(user);
        localStorage.setItem('fake-auth-user', JSON.stringify(user));
        return;
      } else {
        throw new Error('Invalid code');
      }
    }
    await db.auth.signInWithMagicCode({ email, code });
  };

  const signOut = () => {
    if (useFakeAuth) {
      setFakeUser(null);
      localStorage.removeItem('fake-auth-user');
      return;
    }
    db.auth.signOut();
  };

  const fakeLogin = () => {
    if (useFakeAuth) {
      const user = {
        id: 'fake-user-id',
        email: 'test@example.com',
        createdAt: Date.now(),
      };
      setFakeUser(user);
      localStorage.setItem('fake-auth-user', JSON.stringify(user));
    }
  };

  // Use fake auth if enabled, otherwise use real auth
  const user = useFakeAuth ? fakeUser : realUser;
  const profile = useFakeAuth ? fakeUser?.profile : realProfile;
  const isLoading = useFakeAuth ? false : realIsLoading;

  // Check if user needs to set display name
  useEffect(() => {
    if (!useFakeAuth && needsDisplayName) {
      setShowDisplayNameModal(true);
    }
  }, [needsDisplayName, useFakeAuth]);

  const handleDisplayNameSet = (displayName: string) => {
    setShowDisplayNameModal(false);
    // Update the user object to include the display name
    if (useFakeAuth && fakeUser) {
      const updatedUser = { ...fakeUser, displayName };
      setFakeUser(updatedUser);
      localStorage.setItem('fake-auth-user', JSON.stringify(updatedUser));
    }
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
        ...(useFakeAuth && { fakeLogin }),
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
