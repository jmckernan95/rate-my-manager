import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/Card';
import { StarRating } from './StarRating';
import { Building2, Users, Briefcase } from 'lucide-react';

export const ManagerCard = ({ manager }) => {
  return (
    <Link to={`/manager/${manager.id}`}>
      <Card className="hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                {manager.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {manager.company}
                </span>
                {manager.department && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {manager.department}
                  </span>
                )}
              </div>
              {manager.title && (
                <p className="text-sm text-slate-500 mt-1">{manager.title}</p>
              )}
            </div>

            <div className="text-right flex-shrink-0 ml-4">
              <div className="flex items-center justify-end gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {manager.avg_rating?.toFixed(1) || '-'}
                </span>
              </div>
              <StarRating rating={manager.avg_rating || 0} size="sm" />
              <div className="flex items-center justify-end gap-1 mt-1 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                {manager.review_count} review{manager.review_count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const ManagerCardCompact = ({ manager, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-slate-900">{manager.name}</h4>
          <p className="text-sm text-slate-600">{manager.company}</p>
        </div>
        <div className="text-right">
          <div className="font-semibold text-slate-900">
            {manager.avg_rating?.toFixed(1) || '-'}
          </div>
          <div className="text-xs text-slate-500">
            {manager.review_count} reviews
          </div>
        </div>
      </div>
    </div>
  );
};
