import { StarRating } from './StarRating';

const RatingBar = ({ label, value, maxValue = 5 }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 w-32 flex-shrink-0">{label}</span>
      <div className="flex-grow h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-700 w-8 text-right">
        {value?.toFixed(1) || '-'}
      </span>
    </div>
  );
};

export const RatingBreakdown = ({ manager }) => {
  const categories = [
    { label: 'Communication', value: manager.avg_communication },
    { label: 'Fairness', value: manager.avg_fairness },
    { label: 'Growth Support', value: manager.avg_growth_support },
    { label: 'Work-Life Balance', value: manager.avg_work_life_balance },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="text-4xl font-bold text-slate-900">
          {manager.avg_rating?.toFixed(1) || '-'}
        </div>
        <div>
          <StarRating rating={manager.avg_rating || 0} size="lg" />
          <p className="text-sm text-slate-500 mt-1">
            Based on {manager.review_count} review{manager.review_count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <RatingBar
            key={category.label}
            label={category.label}
            value={category.value}
          />
        ))}
      </div>
    </div>
  );
};
