import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the hooks and db before importing components
vi.mock('../hooks/useAuthWithProfile');
vi.mock('../lib/instant', () => ({
  db: {
    useQuery: vi.fn(),
    transact: vi.fn().mockResolvedValue(undefined),
    tx: {
      profiles: {
        'test-profile-id': {
          update: vi.fn(),
        },
      },
    },
  },
}));

// Import after mocking
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';
import { db } from '../lib/instant';
import { AccountPage } from '../components/AccountPage';
import { AuthProvider } from '../components/AuthProvider';
import { ToastProvider } from '../components/ToastProvider';

const mockUseAuthWithProfile = vi.mocked(useAuthWithProfile);
const mockUseQuery = vi.mocked(db.useQuery);

// Test wrapper that includes all necessary providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}

// Mock user and profile data
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockProfile = {
  id: 'test-profile-id',
  displayName: 'Test User',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockFlowsData = {
  $users: [
    {
      id: 'test-user-id',
      email: 'test@example.com',
      flows: [
        { id: 'flow1', name: 'Flow 1', isPublic: true },
        { id: 'flow2', name: 'Flow 2', isPublic: false },
        { id: 'flow3', name: 'Flow 3', isPublic: true },
      ],
    },
  ],
};

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseAuthWithProfile.mockReturnValue({
        user: null,
        profile: null,
        isLoading: false,
        needsDisplayName: false,
      });
      mockUseQuery.mockReturnValue({
        data: null,
        error: undefined,
        pageInfo: undefined,
      } as any);
    });

    it('shows sign in required message', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.getByText('Sign in required')).toBeInTheDocument();
      expect(
        screen.getByText(
          'You need to be signed in to view your account settings.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('does not show account settings content', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.queryByText('Account Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Profile Information')).not.toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseAuthWithProfile.mockReturnValue({
        user: mockUser,
        profile: mockProfile,
        isLoading: false,
        needsDisplayName: false,
      });
      mockUseQuery.mockReturnValue({
        data: mockFlowsData,
        error: undefined,
        pageInfo: undefined,
      } as any);
    });

    it('renders the account page with user information', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(
        screen.getByText('Manage your account information and preferences')
      ).toBeInTheDocument();
    });

    it('displays user email (read-only)', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(
        screen.getByText('Your email address cannot be changed')
      ).toBeInTheDocument();
    });

    it('displays current display name in input field', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.getByText('Display Name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    it('shows account statistics correctly', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(screen.getByText('Account Statistics')).toBeInTheDocument();

      // Total flows (3)
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total Flows')).toBeInTheDocument();

      // Public flows (2)
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Community Flows')).toBeInTheDocument();

      // Member since date
      expect(screen.getByText('1/1/2025')).toBeInTheDocument();
      expect(screen.getByText('Member Since')).toBeInTheDocument();
    });

    it('allows updating display name', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      const displayNameInput = screen.getByDisplayValue('Test User');
      const updateButton = screen.getByRole('button', { name: /update/i });

      // Initially update button should be disabled (no change)
      expect(updateButton).toBeDisabled();

      // Change the display name
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'New Display Name');

      // Update button should now be enabled
      expect(updateButton).toBeEnabled();

      // Click update button
      await user.click(updateButton);

      // Wait for the update to complete and check for success toast
      await waitFor(() => {
        expect(
          screen.getByText('Display name updated successfully!')
        ).toBeInTheDocument();
      });
    });

    it('validates display name length', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      const displayNameInput = screen.getByDisplayValue('Test User');
      const updateButton = screen.getByRole('button', { name: /update/i });

      // Try with too short name
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'ab');

      // Update button should be disabled
      expect(updateButton).toBeDisabled();

      // Submit the form to trigger validation
      const form = displayNameInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(
          screen.getByText('Display name must be at least 3 characters long')
        ).toBeInTheDocument();
      });
    });

    it('shows helpful text about display name usage', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      expect(
        screen.getByText(
          'This name will be shown in the public gallery when you share flows. Minimum 3 characters, must be unique.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when user has no flows', () => {
    beforeEach(() => {
      mockUseAuthWithProfile.mockReturnValue({
        user: mockUser,
        profile: mockProfile,
        isLoading: false,
        needsDisplayName: false,
      });
      mockUseQuery.mockReturnValue({
        data: {
          $users: [
            {
              id: 'test-user-id',
              email: 'test@example.com',
              flows: [],
            },
          ],
        },
        error: undefined,
        pageInfo: undefined,
      } as any);
    });

    it('shows zero statistics', () => {
      render(
        <TestWrapper>
          <AccountPage />
        </TestWrapper>
      );

      // Should show 0 for both total and public flows
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements).toHaveLength(2);
      expect(screen.getByText('Total Flows')).toBeInTheDocument();
      expect(screen.getByText('Community Flows')).toBeInTheDocument();
    });
  });
});
