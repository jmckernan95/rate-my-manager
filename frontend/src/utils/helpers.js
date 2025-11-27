export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return formatDate(dateString);
};

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-blue-600';
  if (rating >= 2.5) return 'text-yellow-600';
  return 'text-red-600';
};

export const getRatingBgColor = (rating) => {
  if (rating >= 4.5) return 'bg-green-100';
  if (rating >= 3.5) return 'bg-blue-100';
  if (rating >= 2.5) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const getWouldWorkAgainLabel = (value) => {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    case 'maybe':
      return 'Maybe';
    default:
      return value;
  }
};

export const calculateWouldWorkAgainPercentage = (yes, no, maybe) => {
  const total = yes + no + maybe;
  if (total === 0) return null;
  return Math.round((yes / total) * 100);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
