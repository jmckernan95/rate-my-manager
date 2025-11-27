import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useManager } from '../hooks/useManagers';
import { useCreateReview } from '../hooks/useReviews';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { RatingInput } from '../components/StarRating';
import { PageSpinner } from '../components/ui/Spinner';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

const steps = [
  { id: 1, name: 'Confirm Manager' },
  { id: 2, name: 'Rate' },
  { id: 3, name: 'Review' },
  { id: 4, name: 'Complete' },
];

const ProgressBar = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${
                currentStep > step.id
                  ? 'bg-green-600 text-white'
                  : currentStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }
            `}
          >
            {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-2 ${
                currentStep > step.id ? 'bg-green-600' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      {steps.map((step) => (
        <span
          key={step.id}
          className={`text-xs ${
            currentStep === step.id ? 'text-blue-600 font-medium' : 'text-slate-500'
          }`}
        >
          {step.name}
        </span>
      ))}
    </div>
  </div>
);

export default function SubmitReview() {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const { data: managerData, isLoading: managerLoading } = useManager(managerId);
  const createReview = useCreateReview();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({
    overall_rating: 0,
    communication: 0,
    fairness: 0,
    growth_support: 0,
    work_life_balance: 0,
  });
  const [textReview, setTextReview] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [wouldWorkAgain, setWouldWorkAgain] = useState('');

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

  const handleRatingChange = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const isStep2Valid = Object.values(ratings).every((r) => r > 0) && wouldWorkAgain;
  const isStep3Valid = !textReview || (textReview.length >= 50 && textReview.length <= 2000);

  const handleSubmit = async () => {
    setError('');
    try {
      await createReview.mutateAsync({
        manager_id: parseInt(managerId),
        ...ratings,
        text_review: textReview || undefined,
        is_anonymous: isAnonymous,
        would_work_again: wouldWorkAgain,
      });
      setStep(4);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to={`/manager/${managerId}`}
        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to profile
      </Link>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 4 ? 'Review Submitted!' : `Review ${manager.name}`}
          </h1>
        </CardHeader>

        <CardContent>
          <ProgressBar currentStep={step} />

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Confirm Manager */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-600">
                You're about to review the following manager:
              </p>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900">{manager.name}</h3>
                <p className="text-slate-600">{manager.company}</p>
                {manager.department && (
                  <p className="text-sm text-slate-500">{manager.department}</p>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Please ensure this is the correct manager before proceeding.
              </p>
            </div>
          )}

          {/* Step 2: Ratings */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <RatingInput
                  label="Overall Rating"
                  value={ratings.overall_rating}
                  onChange={(v) => handleRatingChange('overall_rating', v)}
                  required
                />
                <RatingInput
                  label="Communication"
                  value={ratings.communication}
                  onChange={(v) => handleRatingChange('communication', v)}
                  required
                />
                <RatingInput
                  label="Fairness"
                  value={ratings.fairness}
                  onChange={(v) => handleRatingChange('fairness', v)}
                  required
                />
                <RatingInput
                  label="Growth Support"
                  value={ratings.growth_support}
                  onChange={(v) => handleRatingChange('growth_support', v)}
                  required
                />
                <RatingInput
                  label="Work-Life Balance"
                  value={ratings.work_life_balance}
                  onChange={(v) => handleRatingChange('work_life_balance', v)}
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Would you work for this manager again? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {['yes', 'maybe', 'no'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setWouldWorkAgain(option)}
                      className={`
                        flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors
                        ${
                          wouldWorkAgain === option
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }
                      `}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Written Review */}
          {step === 3 && (
            <div className="space-y-6">
              <Textarea
                label="Written Review (Optional)"
                value={textReview}
                onChange={(e) => setTextReview(e.target.value)}
                placeholder="Share your experience working with this manager. What did they do well? What could they improve? (50-2000 characters)"
                rows={6}
                error={
                  textReview && textReview.length < 50
                    ? 'Review must be at least 50 characters'
                    : textReview && textReview.length > 2000
                    ? 'Review must be less than 2000 characters'
                    : ''
                }
              />
              {textReview && (
                <p className="text-sm text-slate-500">
                  {textReview.length}/2000 characters
                </p>
              )}

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="text-sm text-slate-700">
                  Post anonymously (recommended)
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Thank you for your review!
              </h2>
              <p className="text-slate-600 mb-6">
                Your feedback helps others make better career decisions.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to={`/manager/${managerId}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
                <Link to={`/verify/${managerId}`}>
                  <Button>Verify Employment</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>

        {step < 4 && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 2 && !isStep2Valid}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={createReview.isPending}
                disabled={!isStep3Valid}
              >
                Submit Review
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
