import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '', message = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 gap-3 ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} rounded-full border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 animate-spin`}
      ></div>
      {message && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="py-4 px-4"><div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
      <td className="py-4 px-4"><div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
      <td className="py-4 px-4 text-right"><div className="h-6 w-12 ml-auto bg-slate-200 dark:bg-slate-800 rounded"></div></td>
    </tr>
  );
};

export default { LoadingSpinner, TaskCardSkeleton, TableRowSkeleton };
