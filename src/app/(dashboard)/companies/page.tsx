"use client"; // クライアントコンポーネントとして利用するための宣言

import type React from "react";

interface Company {
  会社名: string;
  url: string;
  上場区分: "上場" | "未上場";
  従業員人数: number;
  売上: string;
  事業内容: string[];
}

export default function CompaniesPage() {
  const companies: Company[] = [
    {
      会社名: "サンプル株式会社",
      url: "https://example.com",
      上場区分: "未上場",
      従業員人数: 50,
      売上: "5億円",
      事業内容: ["ITソリューションの提供", "システム開発", "クラウドサービス"],
    },
    {
      会社名: "テスト合同会社",
      url: "https://test.co.jp",
      上場区分: "上場",
      従業員人数: 1000,
      売上: "100億円",
      事業内容: ["ECサイト運営", "物流サービス"],
    },
    {
      会社名: "DEMO株式会社",
      url: "https://demo.jp",
      上場区分: "未上場",
      従業員人数: 200,
      売上: "20億円",
      事業内容: ["マーケティング支援", "コンサルティング", "広告運用"],
    },
    {
      会社名: "ABCホールディングス",
      url: "https://abc-holdings.co.jp",
      上場区分: "上場",
      従業員人数: 5000,
      売上: "500億円",
      事業内容: ["製造", "販売", "ITソリューション", "不動産"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">企業一覧</h1>
          <p className="mt-2 text-sm text-gray-700">
            登録されている企業の一覧です
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  会社名
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  URL
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  上場区分
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  従業員数
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  売上
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  事業内容
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company) => (
                <tr
                  key={company.会社名}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {company.会社名}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {company.url}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${company.上場区分 === "上場"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                      {company.上場区分}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {company.従業員人数.toLocaleString()}名
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {company.売上}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1.5">
                      {company.事業内容.map((business) => (
                        <span
                          key={`${company.会社名}-${business}`}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {business}
                        </span>
                      ))}
                    </div>
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

