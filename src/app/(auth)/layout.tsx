'use client';

import type React from 'react';


export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        {/* ここでサービス名を中央上に表示 */}
        <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          My Awesome Service
        </h1>
  
        {/* 中央のボックス (カード) */}
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {children}
        </div>
      </div>
    );
  }