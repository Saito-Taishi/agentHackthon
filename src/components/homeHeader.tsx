"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * ホームページだけに表示するヘッダーコンポーネント
 * スクロールしても常に画面上部に表示されるように fixed で配置
 */
export default function HomeHeader() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow h-16 flex items-center">
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6">
        {/* サービス名 */}
        <div className="text-xl font-bold text-gray-800 dark:text-gray-100">MyServiceName</div>
        {/* ログインボタン */}
        <button
          onClick={() => {
            router.push("/login");
          }}
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          ログイン
        </button>
      </div>
    </header>
  );
}
