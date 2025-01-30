"use client"

import { useState } from "react"
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerRoot,
} from "@/components/ui/drawer"
import type { SelectedRecords } from "./useRecordHooks"



interface EmailDrawerProps {
    open: boolean
    setOpen: (open: boolean) => void
    selectedRecords: SelectedRecords[]
    sendEmail: () => Promise<void>
    googleLogin: () => Promise<void>
}

export const EmailDrawer = ({ open, setOpen, selectedRecords, sendEmail, googleLogin }: EmailDrawerProps) => {
    const [emailSubject, setEmailSubject] = useState("")
    const [emailBody, setEmailBody] = useState("")
    // プレースホルダーを管理するステート
    const [placeholders] = useState([
        { key: 'companyName', label: '会社名', placeholder: '{会社名}' },
        { key: 'personName', label: '氏名', placeholder: '{氏名}' },
    ]);

    const handleSendEmail = async () => {
        await sendEmail();
        setOpen(false);
    }


    // プレースホルダーを実際の値に置換する関数
    const replacePlaceholders = (text: string, record: { personName: string, companyName: string }) => {
        let replacedText = text;
        for (const p of placeholders) {
            const replacementValue = record[p.key as keyof typeof record] || '';
            replacedText = replacedText.replace(p.placeholder, replacementValue);
        }
        return replacedText;
    };

    // プレビュー表示用のメール本文
    const previewEmailBody = selectedRecords.length > 0 ? replacePlaceholders(emailBody, selectedRecords[0]) : emailBody;


    const insertPlaceholder = (placeholder: string) => {
        setEmailBody(prevBody => prevBody + placeholder);
    };


    return (
        <DrawerRoot size={"lg"} open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerBody className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 font-medium">
                            送信先: {selectedRecords.length}件
                        </div>
                        <div className="divide-y divide-gray-200">
                            {selectedRecords.map((record) => (
                                <div key={record.id} className="py-2">
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
                            {/* ラベル入力欄 */}
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
                            {/* メール内容入力欄 */}
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
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">1件目のプレビュー:</div>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <p className="text-sm text-gray-800 whitespace-pre-line">{previewEmailBody}</p>
                                    </div>
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
                            onClick={() => setOpen(false)}
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