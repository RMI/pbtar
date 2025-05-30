import React from 'react';

interface ColophonProps {
  className?: string;
}

const Colophon: React.FC<ColophonProps> = ({ className = '' }) => {
  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      <p>Build Info:</p>
      <ul className="list-none text-xs">
        <li>Git SHA: {import.meta.env.VITE_GIT_SHA || 'N/A'}</li>
        <li>Branch: {import.meta.env.VITE_GIT_BRANCH || 'N/A'}</li>
        <li>Working Directory: {import.meta.env.VITE_GIT_CLEAN === 'true' ? 'Clean' : 'Modified'}</li>
        <li>Environment: {import.meta.env.VITE_ENVIRONMENT || 'development'}</li>
      </ul>
    </div>
  );
};

export default Colophon;