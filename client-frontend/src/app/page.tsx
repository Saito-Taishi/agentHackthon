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
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
          <div className="mt-10 mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              名刺を撮るだけで商談獲得率UP！
              <span className="block text-xl sm:text-2xl mt-4">
                名刺から企業をAIが自動解析し、優先順位＋メールまで作成
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              展示会で集めた名刺を最大限活用。AIが自動で優先順位をつけ、
              最適なフォローアップメールを提案します。
            </p>

            {/* プロセスフロー */}
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <svg
                    className="h-8 w-8 text-blue-600 dark:text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">名刺をスキャン</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  たった1タップで完了
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <svg
                    className="h-8 w-8 text-blue-600 dark:text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">AIが自動解析</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  優先度を自動判定
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <svg
                    className="h-8 w-8 text-blue-600 dark:text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">メール作成＆送信</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  最適な文面を自動提案
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 animate-bounce">
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </section>

        {/* 特長セクション */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              導入企業の97%が工数削減を実感
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              名刺管理からフォローアップまで、面倒な作業を自動化
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 transform hover:scale-105 transition-all">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                工数を最大85%削減
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                名刺の手入力や個別メール作成の手間を大幅カット。
                展示会後のフォローアップ業務を効率化します。
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 transform hover:scale-105 transition-all">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                メール開封率1.5倍
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AIが最適なタイミングと文面を提案。
                顧客の関心に合わせた効果的なアプローチを実現します。
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 transform hover:scale-105 transition-all">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                幅広い活用シーン
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                展示会はもちろん、営業訪問やオンライン商談など、
                あらゆるビジネスシーンで活用できます。
              </p>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              今すぐ始めて、営業の効率を劇的に改善
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl text-blue-100">
              14日間の無料トライアルで、すべての機能を体験できます。
            </p>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-block rounded-xl bg-white px-8 py-4 text-xl font-bold text-blue-600 shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all"
              >
                無料トライアルを始める
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
