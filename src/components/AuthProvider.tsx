import { createContext, useContext, ReactNode } from 'react';
import { db } from '../lib/instant';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use real InstantDB auth
  const { user, isLoading } = db.useAuth();

  const signInWithEmail = async (email: string) => {
    await db.auth.sendMagicCode({ email });
  };

  const verifyCode = async (email: string, code: string) => {
    await db.auth.signInWithMagicCode({ email, code });
  };

  const signOut = () => {
    db.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithEmail, verifyCode, signOut }}
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
