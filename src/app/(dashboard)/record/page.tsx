"use client";

import Image from 'next/image';
import { useRecordHooks } from './useRecordHooks';

export default function RecordPage() {
    const {
        selectedRecords,
        handleSendMail,
        records,
        handleCheckboxChange,
        isDialogOpen,
        setIsDialogOpen,
        handleEmailSubmit,
        emailContent,
        setEmailContent
    } = useRecordHooks()
    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">アップロード履歴</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        名刺のアップロード履歴を確認できます
                    </p>
                </div>
                {selectedRecords.length > 0 && (
                    <div className="mt-4 sm:mt-0">
                        <button
                            type="button"
                            onClick={handleSendMail}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <title>メール</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            </svg>
                            選択したユーザーにメール送信
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                    <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
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
                                    <td className="relative px-7 sm:w-12 sm:px-6">
                                        <input
                                            type="checkbox"
                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedRecords.includes(record.id)}
                                            onChange={() => handleCheckboxChange(record.id)}
                                        />
                                    </td>
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
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${record.status
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
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

            {/* Email Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">メール作成</h3>
                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <title>件名</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    件名
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={emailContent.subject}
                                    onChange={(e) =>
                                        setEmailContent((prev) => ({
                                            ...prev,
                                            subject: e.target.value,
                                        }))
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-base bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="body"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    本文
                                </label>
                                <textarea
                                    id="body"
                                    rows={4}
                                    value={emailContent.body}
                                    onChange={(e) =>
                                        setEmailContent((prev) => ({
                                            ...prev,
                                            body: e.target.value,
                                        }))
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-base bg-gray-50"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    送信
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}