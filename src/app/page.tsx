"use client";

import HomeHeader from "@/components/homeHeader";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <HomeHeader />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              バックオフィス業務をもっとラクに！
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              煩雑な経理・人事・総務業務をスムーズにする
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                クラウドソリューション
              </span>
              で、あなたのビジネスを加速させましょう。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  router.push("/login");
                }}
                type="button"
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                無料で始める
              </button>
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
              面倒な経理・人事・総務を一元管理し、 バックオフィス業務の効率化を実現します。
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* カード1 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                請求書の自動作成
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                登録データを元に、請求書を自動で作成・送付。支払い状況もリアルタイムで確認できます。
              </p>
            </div>

            {/* カード2 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                従業員管理の一元化
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                従業員の入退社手続きや給与計算をひとつのシステムで対応。ワークフローに沿って自動化できます。
              </p>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-blue-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-24 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl">
              バックオフィスをラクにしませんか？
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-300">
              たった数クリックで、あの煩雑だった処理が一気に短縮。
              無料トライアルですぐに始められます。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  router.push("/login");
                }}
                type="button"
                className="inline-block rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                今すぐ始める
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
