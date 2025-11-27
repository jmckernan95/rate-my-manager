import { useParams, Link } from 'react-router-dom';
import { useManager } from '../hooks/useManagers';
import { useReviews } from '../hooks/useReviews';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RatingBreakdown } from '../components/RatingBreakdown';
import { ReviewCard } from '../components/ReviewCard';
import { PageSpinner } from '../components/ui/Spinner';
import { useAuthStore } from '../stores/authStore';
import { Building2, Briefcase, Users, ThumbsUp, PenLine, ChevronLeft } from 'lucide-react';
import { calculateWouldWorkAgainPercentage } from '../utils/helpers';

export default function ManagerProfile() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { data: managerData, isLoading: managerLoading } = useManager(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(id);

  if (managerLoading) {
    return <PageSpinner />;
  }

  if (!managerData?.manager) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Manager Not Found</h1>
        <p className="text-slate-600 mb-6">
          The manager you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  const manager = managerData.manager;
  const reviews = reviewsData?.reviews || [];
  const wouldWorkAgainPercent = calculateWouldWorkAgainPercentage(
    manager.would_work_again_yes || 0,
    manager.would_work_again_no || 0,
    manager.would_work_again_maybe || 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        to="/search"
        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to search
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Manager Info & Rating Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          {/* Manager Info Card */}
          <Card>
            <CardContent>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {manager.name}
              </h1>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{manager.company}</span>
                </div>
                {manager.department && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{manager.department}</span>
                  </div>
                )}
                {manager.title && (
                  <p className="text-sm text-slate-500 mt-1">{manager.title}</p>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{manager.review_count} reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span>{manager.verified_count || 0} verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Rating Breakdown
              </h2>
            </CardHeader>
            <CardContent>
              <RatingBreakdown manager={manager} />

              {wouldWorkAgainPercent !== null && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-semibold text-slate-900">
                      {wouldWorkAgainPercent}%
                    </span>
                    <span className="text-slate-600 text-sm">
                      would work for again
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent>
              <h3 className="font-semibold text-slate-900 mb-2">
                Worked with {manager.name.split(' ')[0]}?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Share your experience to help others make informed decisions.
              </p>
              {isAuthenticated ? (
                <Link to={`/review/${manager.id}`}>
                  <Button className="w-full">
                    <PenLine className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </Link>
              ) : (
                <Link to={`/login?redirect=/review/${manager.id}`}>
                  <Button className="w-full">
                    <PenLine className="w-4 h-4 mr-2" />
                    Login to Review
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
          </div>

          {reviewsLoading ? (
            <PageSpinner />
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-slate-500 mb-4">
                  No reviews yet. Be the first to review {manager.name}!
                </p>
                {isAuthenticated ? (
                  <Link to={`/review/${manager.id}`}>
                    <Button>Write the First Review</Button>
                  </Link>
                ) : (
                  <Link to={`/login?redirect=/review/${manager.id}`}>
                    <Button>Login to Review</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
