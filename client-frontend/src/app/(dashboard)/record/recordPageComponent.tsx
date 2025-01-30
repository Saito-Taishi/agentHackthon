"use client"

import Image from "next/image";
import { useRecordHooks } from "./useRecordHooks";
import { EmailDrawer } from "./emailDrawer";

export default function RecordPageComponent() {
    const { records, handleCheckboxChange, selectedRecords, open, setOpen } = useRecordHooks();
    const hasSelectedRecords = selectedRecords.length > 0; // 選択されたレコードがあるかどうか
    const handleGoogleLogin = async () => {
        try {
            // 1. initiateエンドポイントにリクエストし、認可URLを取得
            const res = await fetch("/api/auth/oauth_google");
            if (!res.ok) {
                throw new Error("Failed to get authorization URL");
            }
            const data = await res.json();

            // 2. 取得したURLにリダイレクト (画面遷移)
            window.location.href = data.authorizationUrl;
        } catch (error) {
            console.error(error);
        }
    };
    const handleSendEmail = async () => {
        try {
            const response = await fetch("/api/send_emails", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error details:", data);
                throw new Error(data.message || 'Failed to send email');
            }

            console.log('Email sent successfully:', data);
            // 成功時のUI表示を追加
        } catch (error) {
            console.error("Error sending email:", error);
            // エラー時のUI表示を追加
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            {/* クリック時にAPIを呼んで認可URLを取得→リダイレクト */}
            <button type="button" onClick={handleGoogleLogin}>
                a
            </button>
            <button type="button" onClick={handleSendEmail}>
                メール送信テスト用
            </button>
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">アップロード履歴</h1>
                    <p className="mt-2 text-sm text-gray-700">名刺のアップロード履歴を確認できます</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    {/* 選択されている場合のみボタンをアクティブにする */}
                    <button
                        type="button"
                        disabled={!hasSelectedRecords} // 選択されていない場合はdisabled
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        メール送信
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="px-2 py-4 text-left text-sm font-semibold text-gray-900">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        disabled
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
                                    <td className="whitespace-nowrap px-2 py-4 text-sm">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            value={record.id}
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
                                        {record.personName}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {record.role || "N/A"}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-600">
                                        <a
                                            href={`mailto:${record.personEmail}`}
                                            className="hover:text-blue-800 hover:underline"
                                        >
                                            {record.personEmail || "N/A"}
                                        </a>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">{record.personPhoneNumber}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${record.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {record.status ? "完了" : "未処理"}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {record.createdAt?.toDate().toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <EmailDrawer open={open} onOpenChange={setOpen} selectedRecords={selectedRecords} onSendEmail={handleSendEmail} />
        </div>
    )
}