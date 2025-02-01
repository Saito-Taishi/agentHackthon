"use client";

import HomeHeader from "@/components/homeHeader";
import { auth } from "@/utils/config/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.replace("/companies");
    }
  }, [router]);

  return (
    <>
      <HomeHeader />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              展示会での営業活動をよりシンプルに！
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              名刺を簡単にスキャンして、展示会後のフォローアップをスムーズに。革新的な営業支援サービスで、あなたのビジネスを加速させましょう。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </section>

        {/* 特長セクション */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              サービスの特長
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              名刺データを活用し、展示会後の営業活動を効率化するための機能が満載です。
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* カード1 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                名刺スキャンで簡単データ化
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                名刺をワンタッチでデジタル化し、顧客管理システムへ自動連携。展示会で集めた情報を即座に活用できます。
              </p>
            </div>

            {/* カード2 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                効率的なフォローアップ
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                展示会後の自動メール送信やリマインダー機能で、迅速な営業活動をサポート。新規顧客獲得を加速します。
              </p>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-blue-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl">
              名刺から始めるスマートな営業へ
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-300">
              展示会での名刺管理から営業活動まで、たった数クリックで実現。無料トライアルですぐに始められます。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/login"
                className="inline-block rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                今すぐ始める
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
