import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ManagerCard } from '../components/ManagerCard';
import { useTrendingManagers } from '../hooks/useManagers';
import { Spinner } from '../components/ui/Spinner';
import { Shield, Eye, TrendingUp, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="text-center p-6">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default function Landing() {
  const { data, isLoading } = useTrendingManagers(5);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Know Your Manager Before You Accept the Job
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              Anonymous, verified reviews from real employees. Make informed career decisions
              with honest feedback about management quality.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar size="lg" placeholder="Search for a manager or company..." />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={Eye}
              title="Search Managers"
              description="Find managers by name or company to see their ratings and reviews."
            />
            <FeatureCard
              icon={Shield}
              title="Verified Reviews"
              description="Reviews are verified through work email to ensure authenticity."
            />
            <FeatureCard
              icon={Users}
              title="Anonymous Feedback"
              description="Share honest experiences without fear of retaliation."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Make Better Choices"
              description="Use real data to make informed career decisions."
            />
          </div>
        </div>
      </section>

      {/* Trending Managers */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Trending Managers
            </h2>
            <Link
              to="/search"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : data?.managers?.length > 0 ? (
            <div className="grid gap-4">
              {data.managers.map((manager) => (
                <ManagerCard key={manager.id} manager={manager} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              No trending managers yet. Be the first to leave a review!
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Had a Great (or Terrible) Manager?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Help others make better career decisions by sharing your experience.
            All reviews can be anonymous and verified.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Your Manager & Leave a Review
          </Link>
        </div>
      </section>
    </div>
  );
}
