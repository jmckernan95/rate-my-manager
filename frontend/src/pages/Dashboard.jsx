import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/StarRating';
import { VerificationBadge } from '../components/VerificationBadge';
import { PageSpinner } from '../components/ui/Spinner';
import { formatDate, formatRelativeTime } from '../utils/helpers';
import { PenLine, ShieldCheck, Building2, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
  });

  if (isLoading) {
    return <PageSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Dashboard</h1>
        <p className="text-slate-600">{error.message}</p>
      </div>
    );
  }

  const { user, reviews, verifications, stats } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back, {user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-slate-900">{stats.total_reviews}</div>
            <div className="text-sm text-slate-600">Reviews Written</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600">{stats.verified_reviews}</div>
            <div className="text-sm text-slate-600">Verified Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-slate-900">
              {verifications.filter(v => v.verified_at).length}
            </div>
            <div className="text-sm text-slate-600">Verifications</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your Reviews</h2>
          <Link to="/search">
            <Button size="sm">
              <PenLine className="w-4 h-4 mr-1" />
              Write Review
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        to={`/manager/${review.manager_id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {review.manager_name}
                      </Link>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {review.manager_company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <VerificationBadge verified={review.is_verified} size="sm" />
                      {!review.is_verified && (
                        <Link to={`/verify/${review.manager_id}`}>
                          <Button size="sm" variant="outline">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <StarRating rating={review.overall_rating} size="sm" />
                    <span className="text-sm text-slate-500">
                      {formatRelativeTime(review.created_at)}
                    </span>
                  </div>

                  {review.text_review && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {review.text_review}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">You haven't written any reviews yet.</p>
              <Link to="/search">
                <Button>Find a Manager to Review</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verifications Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">Employment Verifications</h2>
        </CardHeader>
        <CardContent>
          {verifications.length > 0 ? (
            <div className="space-y-3">
              {verifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{verification.manager_name}</p>
                    <p className="text-sm text-slate-600">{verification.manager_company}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {verification.employment_start && formatDate(verification.employment_start)}
                      {verification.employment_end && ` - ${formatDate(verification.employment_end)}`}
                    </div>
                  </div>
                  <div>
                    {verification.verified_at ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-4">
              No verifications yet. Verify your employment after leaving a review.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <div className="mt-8 p-4 bg-slate-100 rounded-lg text-sm text-slate-600">
        <p>
          <strong>Account created:</strong> {formatDate(user.created_at)}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
