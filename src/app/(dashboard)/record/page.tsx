"use client";

import Image from "next/image";
import { useRecordHooks } from "./useRecordHooks";

export default function RecordPage() {
  const { records } = useRecordHooks();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="sm:flex sm:items-center justify-between mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">アップロード履歴</h1>
          <p className="mt-2 text-sm text-gray-700">名刺のアップロード履歴を確認できます</p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  画像
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  会社名
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  名前
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  役職
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  メールアドレス
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  電話番号
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  ステータス
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                  アップロード日時
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/next.svg" // デフォルト画像パスを設定
                        alt="名刺画像"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    {record.companyName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {record.employeeName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {record.position}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-600">
                    <a
                      href={`mailto:${record.email}`}
                      className="hover:text-blue-800 hover:underline"
                    >
                      {record.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{record.phoneNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        record.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status ? "完了" : "未処理"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {record.uploadedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
