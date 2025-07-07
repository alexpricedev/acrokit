import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface LoginModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
}

export function LoginModal({ isOpen, mode, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');
  const { signInWithEmail, verifyCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      await signInWithEmail(email);
      setIsCodeSent(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to send code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      await verifyCode(email, code);
      onClose(); // Close modal on successful sign-in
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'Invalid code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setIsCodeSent(false);
    setIsLoading(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isCodeSent
              ? 'Check your email'
              : mode === 'login'
                ? 'Welcome back to AcroKit'
                : 'Create Your Free Account'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isCodeSent ? (
          <form onSubmit={handleVerifyCode}>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-12 h-12 text-gray-600"
                  fill="currentColor"
                >
                  <path d="M215.4 96L144 96l-36.2 0L96 96l0 8.8L96 144l0 40.4 0 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3 48 96c0-26.5 21.5-48 48-48l76.6 0 49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48 416 48c26.5 0 48 21.5 48 48l0 44.3 22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4l0-89 0-40.4 0-39.2 0-8.8-11.8 0L368 96l-71.4 0-81.3 0zM0 448L0 242.1 217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1 512 448s0 0 0 0c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64c0 0 0 0 0 0zM176 160l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                We&apos;ve sent a 6-digit code to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Enter the code below to sign in.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={e =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                onPaste={e => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text').trim();
                  if (pastedText.length === 6 && /^\d{6}$/.test(pastedText)) {
                    setCode(pastedText);
                    // Submit form after a brief delay to allow state to update
                    setTimeout(() => {
                      const form = (e.target as HTMLElement).closest('form');
                      if (form) {
                        form.requestSubmit();
                      }
                    }, 10);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => setIsCodeSent(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Magic Code'}
            </button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              {mode === 'login'
                ? "Welcome back! We'll send you a 6-digit code to access your flows and continue building your AcroYoga library."
                : "Save your flows, access them anywhere, and build your personal AcroYoga library. We'll send you a 6-digit code to get started!"}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
