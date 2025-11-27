import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useManager } from '../hooks/useManagers';
import { api } from '../utils/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageSpinner } from '../components/ui/Spinner';
import { ChevronLeft, Mail, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export default function Verification() {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const { data: managerData, isLoading: managerLoading } = useManager(managerId);

  const [step, setStep] = useState(1);
  const [workEmail, setWorkEmail] = useState('');
  const [employmentStart, setEmploymentStart] = useState('');
  const [employmentEnd, setEmploymentEnd] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [debugCode, setDebugCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (managerLoading) {
    return <PageSpinner />;
  }

  if (!managerData?.manager) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Manager Not Found</h1>
        <Link to="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  const manager = managerData.manager;

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.requestVerification(
        parseInt(managerId),
        workEmail,
        employmentStart || undefined,
        employmentEnd || undefined
      );
      // For POC, we get the code back for testing
      setDebugCode(data.debug_code);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.confirmVerification(parseInt(managerId), verificationCode);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link
        to={`/manager/${managerId}`}
        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to profile
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Verify Employment</h1>
              <p className="text-sm text-slate-600">for {manager.name}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Request Code */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-slate-600 text-sm">
                Verify your employment to add a verified badge to your review.
                We'll send a code to your work email.
              </p>

              <Input
                label="Work Email"
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder={`you@${manager.company.toLowerCase().replace(/\s+/g, '')}.com`}
                required
              />

              <Input
                label="Employment Start Date (Optional)"
                type="date"
                value={employmentStart}
                onChange={(e) => setEmploymentStart(e.target.value)}
              />

              <Input
                label="Employment End Date (Optional)"
                type="date"
                value={employmentEnd}
                onChange={(e) => setEmploymentEnd(e.target.value)}
              />

              <Button type="submit" className="w-full" loading={isLoading}>
                <Mail className="w-4 h-4 mr-2" />
                Send Verification Code
              </Button>
            </form>
          )}

          {/* Step 2: Enter Code */}
          {step === 2 && (
            <form onSubmit={handleConfirmCode} className="space-y-4">
              <p className="text-slate-600 text-sm">
                We've sent a verification code to <strong>{workEmail}</strong>.
                Enter it below to verify your employment.
              </p>

              {debugCode && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                  <p className="font-medium text-yellow-800">POC Demo Mode</p>
                  <p className="text-yellow-700">
                    Your verification code is: <strong>{debugCode}</strong>
                  </p>
                </div>
              )}

              <Input
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />

              <Button type="submit" className="w-full" loading={isLoading}>
                Verify
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-600 hover:text-slate-900"
              >
                Didn't receive the code? Try again
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Employment Verified!
              </h2>
              <p className="text-slate-600 mb-6">
                Your review now has a verified badge, adding credibility to your feedback.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to={`/manager/${managerId}`}>
                  <Button>View Profile</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
