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
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "@/components/ui/accordion"

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
    const [isRecipientListOpen, setIsRecipientListOpen] = useState(false)

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
                <DrawerBody className="flex flex-col gap-6">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">
                            送信先: {recordsToDisplay.length}件
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRecipientListOpen(!isRecipientListOpen)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            {isRecipientListOpen ? '閉じる' : '詳細を表示'}
                        </button>
                    </div>

                    {isRecipientListOpen && (
                        <div className="bg-white border rounded-md p-2 max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                                {recordsToDisplay.map((record, index) => (
                                    <li key={`${record.email}-${index}`} className="text-sm p-2 hover:bg-gray-50 rounded">
                                        <span className="font-medium">{record.companyName}</span>
                                        <span className="text-gray-600 mx-2">{record.personName}</span>
                                        <span className="text-gray-500">{record.email}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

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
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールの本文を入力してください"
                            />
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