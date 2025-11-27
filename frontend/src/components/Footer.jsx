import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900">RateMyManager</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link to="/search" className="hover:text-slate-900 transition-colors">
              Find Managers
            </Link>
            <span className="text-slate-300">|</span>
            <span>Anonymous & Verified Reviews</span>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} RateMyManager. POC Demo.
          </p>
        </div>
      </div>
    </footer>
  );
};
