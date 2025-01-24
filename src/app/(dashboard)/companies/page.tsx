"use client"; // クライアントコンポーネントとして利用するための宣言

import type React from "react";
import { useCompaniesHooks } from "./useCompaniesHooks";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer"


export default function CompaniesPage() {

  const { companies, open, setOpen, selectedCompanyName, handleCompanyNameClick } = useCompaniesHooks()

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
                        handleCompanyNameClick(company.companyName)
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
      <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedCompanyName}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </div>
  );
}

