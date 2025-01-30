"use client"

import { useState } from "react"
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
} from "@/components/ui/drawer"

interface EmailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedRecords: string[]
    onSendEmail: () => Promise<void>
}
// ダミーデータ
const dummyRecords = [
    { companyName: "株式会社ABC", personName: "山田 太郎", personEmail: "taro.yamada@abc.co.jp" },
    { companyName: "株式会社XYZ", personName: "佐藤 花子", personEmail: "hanako.sato@xyz.co.jp" },
    { companyName: "株式会社123", personName: "鈴木 一郎", personEmail: "ichiro.suzuki@123.co.jp" },
];

export const EmailDrawer = ({ open, onOpenChange, selectedRecords, onSendEmail }: EmailDrawerProps) => {
    const [emailSubject, setEmailSubject] = useState("")
    const [emailBody, setEmailBody] = useState("")
    // プレースホルダーを管理するステート
    const [placeholders] = useState([
        { key: 'personName', label: '氏名', placeholder: '{氏名}' },
        { key: 'companyName', label: '会社名', placeholder: '{会社名}' },
    ]);

    const handleSendEmail = async () => {
        await onSendEmail();
        onOpenChange(false);
    }

    const recordsToDisplay = dummyRecords;

    // プレースホルダーを実際の値に置換する関数
    const replacePlaceholders = (text: string, record: { personName: string, companyName: string }) => {
        let replacedText = text;
        placeholders.forEach(p => {
            const replacementValue = record[p.key as keyof typeof record] || ''; // recordにキーが存在しない場合も考慮
            replacedText = replacedText.replace(p.placeholder, replacementValue);
        });
        return replacedText;
    };

    // プレビュー表示用のメール本文
    const previewEmailBody = recordsToDisplay.length > 0 ? replacePlaceholders(emailBody, recordsToDisplay[0]) : emailBody;


    const insertPlaceholder = (placeholder: string) => {
        setEmailBody(prevBody => prevBody + placeholder);
    };


    return (
        <DrawerRoot size={"lg"} open={open} onOpenChange={(e) => onOpenChange(e.open)}>
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerBody className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 font-medium">
                            送信先: {recordsToDisplay.length}件
                        </div>
                        <div className="divide-y divide-gray-200">
                            {recordsToDisplay.map((record, index) => (
                                <div key={index} className="py-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-900 w-40">
                                            {record.companyName}
                                        </span>
                                        <span className="text-sm text-gray-600 w-32">
                                            {record.personName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {record.personEmail}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                件名
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールの件名を入力してください"
                            />
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                                本文
                            </label>
                            <div className="flex items-center gap-2 mb-1">
                                {placeholders.map((p) => (
                                    <button
                                        key={p.key}
                                        type="button"
                                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        onClick={() => insertPlaceholder(p.placeholder)}
                                    >
                                        {p.label}挿入 ({p.placeholder})
                                    </button>
                                ))}
                            </div>
                            <textarea
                                id="body"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールの本文を入力してください"
                            />
                            {/* プレビュー表示 */}
                            {emailBody && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="text-sm font-medium text-gray-700 mb-1">プレビュー (一件目):</div>
                                    <p className="text-sm text-gray-800 whitespace-pre-line">{previewEmailBody}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        送信ボタンを押すと、上記メールアドレス宛に一斉送信されます。
                        送信前に内容を再度ご確認ください。
                    </p>
                </DrawerBody>
                <DrawerFooter>
                    <DrawerActionTrigger asChild>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => onOpenChange(false)}
                        >
                            キャンセル
                        </button>
                    </DrawerActionTrigger>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-300"
                        onClick={handleSendEmail}
                        disabled={!emailSubject.trim() || !emailBody.trim()}
                    >
                        送信する
                    </button>
                </DrawerFooter>
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    )
}