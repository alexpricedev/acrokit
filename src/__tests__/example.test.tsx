import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';

// Mock the hook before importing components
vi.mock('../hooks/useAuthWithProfile');

const mockUseAuthWithProfile = vi.mocked(useAuthWithProfile);

// Simple test component that demonstrates testing setup
function TestComponent() {
  return <div>Test component loaded</div>;
}

describe('Vitest + MSW Testing Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('can render a basic component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test component loaded')).toBeInTheDocument();
  });

  it('can mock the auth hook', () => {
    mockUseAuthWithProfile.mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: {
        id: 'test-profile',
        displayName: 'Test User',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
      isLoading: false,
      needsDisplayName: false,
    });

    const result = useAuthWithProfile();
    expect(result.user).toEqual({ id: 'test-user', email: 'test@example.com' });
    expect(result.isLoading).toBe(false);
  });

  it('can mock loading state', () => {
    mockUseAuthWithProfile.mockReturnValue({
      user: null,
      profile: null,
      isLoading: true,
      needsDisplayName: false,
    });

    const result = useAuthWithProfile();
    expect(result.isLoading).toBe(true);
    expect(result.user).toBeNull();
  });
});
