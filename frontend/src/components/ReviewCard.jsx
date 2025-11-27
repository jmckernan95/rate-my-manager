import { Card, CardContent } from './ui/Card';
import { StarRating } from './StarRating';
import { VerificationBadge } from './VerificationBadge';
import { formatRelativeTime, getWouldWorkAgainLabel } from '../utils/helpers';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const WouldWorkAgainIndicator = ({ value }) => {
  const config = {
    yes: {
      icon: ThumbsUp,
      text: 'Would work for again',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    no: {
      icon: ThumbsDown,
      text: 'Would not work for again',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    maybe: {
      icon: Minus,
      text: 'Maybe work for again',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  };

  const { icon: Icon, text, color, bg } = config[value] || config.maybe;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm ${color} ${bg}`}>
      <Icon className="w-4 h-4" />
      {text}
    </span>
  );
};

export const ReviewCard = ({ review }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <StarRating rating={review.overall_rating} showValue />
            <VerificationBadge verified={review.is_verified} size="sm" />
          </div>
          <span className="text-sm text-slate-500">
            {formatRelativeTime(review.created_at)}
          </span>
        </div>

        {review.text_review && (
          <p className="text-slate-700 mb-4 leading-relaxed">
            {review.text_review}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
          <WouldWorkAgainIndicator value={review.would_work_again} />

          <div className="flex gap-4 text-sm text-slate-500">
            <span>Comm: {review.communication}/5</span>
            <span>Fair: {review.fairness}/5</span>
            <span>Growth: {review.growth_support}/5</span>
            <span>WLB: {review.work_life_balance}/5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
