import { ShieldCheck, Shield } from 'lucide-react';

export const VerificationBadge = ({ verified, size = 'md' }) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (verified) {
    return (
      <span
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-full
          bg-green-100 text-green-700 font-medium
          ${sizes[size]}
        `}
      >
        <ShieldCheck className={iconSizes[size]} />
        Verified
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        bg-slate-100 text-slate-600 font-medium
        ${sizes[size]}
      `}
    >
      <Shield className={iconSizes[size]} />
      Unverified
    </span>
  );
};
