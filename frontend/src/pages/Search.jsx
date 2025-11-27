import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ManagerCard } from '../components/ManagerCard';
import { useSearchManagers, useCompanies } from '../hooks/useManagers';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Filter, Plus, X } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, refetch } = useSearchManagers(query, company);
  const { data: companiesData } = useCompanies();

  useEffect(() => {
    const q = searchParams.get('q');
    const c = searchParams.get('company');
    if (q !== query) setQuery(q || '');
    if (c !== company) setCompany(c || '');
  }, [searchParams]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (company) params.set('company', company);
    setSearchParams(params);
  };

  const handleCompanyFilter = (newCompany) => {
    setCompany(newCompany);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (newCompany) params.set('company', newCompany);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQuery('');
    setCompany('');
    setSearchParams({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Find a Manager</h1>
        <SearchBar
          initialValue={query}
          onSearch={handleSearch}
          placeholder="Search by manager name or company..."
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {company && (
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              1
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => handleCompanyFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Companies</option>
                  {companiesData?.companies?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {(query || company) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-6"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.managers?.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {data.managers.length} manager{data.managers.length !== 1 ? 's' : ''} found
          </p>
          {data.managers.map((manager) => (
            <ManagerCard key={manager.id} manager={manager} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">
            No managers found. Try adjusting your search or add a new manager.
          </p>
          <Link to="/search">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add a Manager
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
