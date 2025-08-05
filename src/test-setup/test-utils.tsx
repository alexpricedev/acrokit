import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider } from '../components/AuthProvider';

// Mock the InstantDB library
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockProfile = {
  id: 'test-profile-id',
  displayName: 'Test User',
  userId: 'test-user-id',
};

// Mock db object
export const mockDb = {
  auth: {
    sendMagicCode: vi.fn().mockResolvedValue(undefined),
    signInWithMagicCode: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn(),
  },
  useAuth: vi.fn(),
  useQuery: vi.fn(),
  transact: vi.fn().mockResolvedValue(undefined),
};

// Mock the useAuthWithProfile hook
export const mockUseAuthWithProfile = vi.fn();

// Test wrapper with AuthProvider
const AuthTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Test wrapper for authenticated user
const AuthenticatedTestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Test wrapper for unauthenticated user
const UnauthenticatedTestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Test wrapper for loading state
const LoadingTestWrapper = ({ children }: { children: React.ReactNode }) => {
  // Mock loading state
  mockUseAuthWithProfile.mockReturnValue({
    user: null,
    profile: null,
    isLoading: true,
    needsDisplayName: false,
  });

  return <AuthProvider>{children}</AuthProvider>;
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AuthTestWrapper, ...options });

// Custom render with authenticated user
export const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AuthenticatedTestWrapper, ...options });

// Custom render with unauthenticated user
export const renderWithoutAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: UnauthenticatedTestWrapper, ...options });

// Custom render with loading state
export const renderWithLoading = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: LoadingTestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { mockUser, mockProfile };
