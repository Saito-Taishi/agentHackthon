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
    { companyName: "株式会社ABC", personName: "山田 太郎", email: "taro.yamada@abc.co.jp" },
    { companyName: "株式会社XYZ", personName: "佐藤 花子", email: "hanako.sato@xyz.co.jp" },
    { companyName: "株式会社123", personName: "鈴木 一郎", email: "ichiro.suzuki@123.co.jp" },
    // ... 必要に応じてダミーデータを追加
];

export const EmailDrawer = ({ open, onOpenChange, selectedRecords, onSendEmail }: EmailDrawerProps) => {
    const [emailSubject, setEmailSubject] = useState("")
    const [emailBody, setEmailBody] = useState("")

    const handleSendEmail = async () => {
        await onSendEmail();
        onOpenChange(false);
    }

    const recordsToDisplay = dummyRecords;

    return (
        <DrawerRoot size={"lg"} open={open} onOpenChange={(e) => onOpenChange(e.open)}>
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>メール送信確認</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                    <p className="text-gray-600 mb-4">
                        選択された {recordsToDisplay.length} 件の名刺データに対してメールを送信します。
                        送信先は以下の通りです。
                    </p>

                    <ul className="space-y-2 mb-6">
                        {recordsToDisplay.map((record, index) => (
                            <li key={index} className="p-4 border rounded-md shadow-sm">
                                <div className="font-semibold">{record.companyName}</div>
                                <div className="text-gray-700">{record.personName}</div>
                                <div className="text-blue-500 text-sm">{record.email}</div>
                            </li>
                        ))}
                    </ul>

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
                            <textarea
                                id="body"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールの本文を入力してください"
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
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