'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/utils/config/firebase';
// Firebase Authentication関連のインポート
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// firebase.jsに書かれた初期化処理からauthをインポート


export default function GoogleLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Googleログイン用の関数
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // ポップアップでGoogleログイン
      const result = await signInWithPopup(auth, provider);
      console.log('ログイン成功:', result.user);
      // ログイン後の処理（リダイレクトなど）をここで実行
      // 例: router.push('/dashboard') など
    } catch (error) {
      console.error('ログインエラー:', error);
      // エラー時の画面表示や通知を行う場合はここで処理
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Googleアカウントでログイン
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          または{' '}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            新規アカウントを作成
          </Link>
        </p>
      </div>

      {/* Googleログインボタン */}
      <div className="mt-8 space-y-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-400"
        >
          {isLoading ? 'ログイン中...' : 'Googleでログイン'}
        </button>
      </div>
    </>
  );
}
