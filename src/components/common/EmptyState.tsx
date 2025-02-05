import React from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "Oops, there's nothing here",
  icon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <p className="text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
