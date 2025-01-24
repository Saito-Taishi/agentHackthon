"use client";
import type React from "react";
import { useCompaniesHooks } from "./useCompaniesHooks";
import Image from 'next/image'

export default function CompaniesPage() {
  const {
    companies,
    open,
    setOpen,
    selectedCompanyName,
    selectedCompanyId,
    handleCompanyNameClick,
    getEmployeesByCompanyId
  } = useCompaniesHooks();

  const selectedEmployees = selectedCompanyId ? getEmployeesByCompanyId(selectedCompanyId) : [];

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
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 min-w-[160px]">
                  会社名
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[100px]">
                  上場区分
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[100px]">
                  従業員数
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[100px]">
                  売上
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[200px]">
                  本社住所
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[100px]">
                  資本金
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[120px]">
                  設立
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[200px]">
                  事業内容
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[140px]">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <button
                      className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      type="button"
                      onClick={() => {
                        handleCompanyNameClick(company.companyName, company.id)
                      }}
                    >
                      {company.companyName}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${company.IPO === "上場"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                      }`}>
                      {company.IPO}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {company.employeeCount.toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {company.sales}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {company.headOfficeAddress}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {company.capital}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {company.established}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1.5">
                      {company.businessActivities.map((business) => (
                        <span
                          key={`${company.companyName}-${business}`}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {business}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {company.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* サイドバー */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedCompanyName}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-label="閉じる"
                >
                  <title>close</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-label="従業員"
                >
                  <title>employee</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                従業員一覧
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {selectedEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4 p-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image
                          src={"public/vercel.svg"}
                          width={500}
                          height={500}
                          alt="名刺"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {employee.name}
                        </h4>
                        <div className="space-y-2">
                          <p className="flex items-center text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-label="役職"
                            >
                              <title>position</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                              />
                            </svg>
                            {employee.position}
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-label="メール"
                            >
                              <title>mail</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                              />
                            </svg>
                            <a
                              href={`mailto:${employee.email}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {employee.email}
                            </a>
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-label="所属"
                            >
                              <title>affiliation</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                              />
                            </svg>
                            {employee.affiliation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

