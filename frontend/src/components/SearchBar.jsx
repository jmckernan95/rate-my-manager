import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';

export const SearchBar = ({
  initialValue = '',
  placeholder = 'Search managers by name or company...',
  size = 'md',
  onSearch,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const sizes = {
    sm: 'py-2 pl-10 pr-4 text-sm',
    md: 'py-3 pl-12 pr-4 text-base',
    lg: 'py-4 pl-14 pr-6 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4 left-3',
    md: 'w-5 h-5 left-4',
    lg: 'w-6 h-6 left-5',
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="relative flex-grow">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${iconSizes[size]}`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full border border-slate-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder:text-slate-400
            ${sizes[size]}
          `}
        />
      </div>
      <Button type="submit" size={size === 'lg' ? 'lg' : 'md'}>
        Search
      </Button>
    </form>
  );
};
