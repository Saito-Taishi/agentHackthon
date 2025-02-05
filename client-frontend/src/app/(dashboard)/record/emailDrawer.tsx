"use client"

import { useState, useRef } from "react"
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerRoot,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import type { SelectedRecords } from "./useRecordHooks"
import { Toaster, toaster } from "@/components/ui/toaster"



interface EmailDrawerProps {
    open: boolean
    setOpen: (open: boolean) => void
    selectedRecords: SelectedRecords[]

}

export const EmailDrawer = ({ open, setOpen, selectedRecords }: EmailDrawerProps) => {
    const [emailDraft, setEmailDraft] = useState("")
    const emailDraftRef = useRef<HTMLTextAreaElement>(null);
    // プレースホルダーを管理するステート
    const [placeholders] = useState([
        { key: 'companyName', label: '会社名', placeholder: '{会社名}' },
        { key: 'personName', label: '氏名', placeholder: '{氏名}' },
    ]);
    // ドロップダウンメニュー用の状態とオプションを追加
    const dropdownOptions = ["展示会", "営業・商談"];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedDropdown, setSelectedDropdown] = useState(dropdownOptions[0]);

    // 追加: dropdownの選択によってemailDraftの値を変更するためのマッピング
    const draftMapping: Record<string, string> = {
        "展示会": "{会社名}\n{氏名} 様\n\n拝啓\n\n時下ますますご清祥のこととお慶び申し上げます。\n\n本日開催されました「〇〇展示会」にて名刺交換をさせていただきました、〇〇と申します。\n\nご多忙の中、弊社ブースにお立ち寄りいただき、誠にありがとうございました。\n\n当ブースでは、弊社製品・サービスについてご案内させていただきました。\n詳しい資料につきましては、後日改めてご連絡させていただきます。\n\nご不明な点やご質問などございましたら、お気軽にご連絡ください。\n\n今後ともご愛顧賜りますよう、よろしくお願い申し上げます。\n\n敬具\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n株式会社□□\n営業部 山田 太郎\nTEL：03-XXXX-XXXX\nEmail：yamada@example.com\n━━━━━━━━━━━━━━━━━━━━━━━━",
        "営業・商談": "{会社名}\n{氏名} 様\n\nお世話になっております。本日貴社に伺いました〇〇でございます。ご多忙のなか、貴重なお時間を割いていただき誠にありがとうございました。名刺交換と弊社の製品に関する説明の機会を頂き恐縮です。\n\n本日ご説明させていただきました内容につきまして、下記の資料を添付させていただきます。\n\n【製品資料】\n・〇〇〇製品カタログ\n・導入事例集\n・概算見積書\n\nご多用のところ大変恐縮ではございますが、ご確認いただけますと幸いです。\n\nご不明な点やご質問等ございましたら、お気軽にご連絡ください。\n引き続きよろしくお願い申し上げます。\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n株式会社□□\n〇〇部 〇〇\nTEL：03-XXXX-XXXX\nEmail：yamada@example.com\n━━━━━━━━━━━━━━━━━━━━━━━━",
    };

    // プレースホルダーを実際の値に置換する関数
    const replacePlaceholders = (text: string, record: { personName: string | null, companyName: string | null }) => {
        let replacedText = text;
        for (const p of placeholders) {
            const replacementValue = record[p.key as keyof typeof record] ?? '';
            replacedText = replacedText.replace(p.placeholder, replacementValue);
        }
        return replacedText;
    };

    const insertPlaceholder = (placeholder: string) => {
        if (emailDraftRef.current) {
            const textarea = emailDraftRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const before = emailDraft.substring(0, start);
            const after = emailDraft.substring(end);
            const newText = before + placeholder + after;
            setEmailDraft(newText);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
            }, 0);
        } else {
            setEmailDraft(prevBody => prevBody + placeholder);
        }
    };

    const copyTextToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error("Failed to copy text", error);
        }
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
                        <div className="relative inline-block text-left">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="inline-flex justify-center w-80 px-4 py-2 bg-white text-sm font-medium text-gray-700 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                                >
                                    {selectedDropdown}
                                    <svg
                                        className="-mr-1 ml-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {dropdownOpen && (
                                <div className="origin-top absolute left-1/2 mt-2 w-80 transform -translate-x-1/2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        {dropdownOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSelectedDropdown(option);
                                                    setDropdownOpen(false);
                                                    // ドロップダウンの選択によりemailDraftの値を更新
                                                    setEmailDraft(draftMapping[option]);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                type="button" // 明示的にtype="button"を指定
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                ref={emailDraftRef}
                                value={emailDraft}
                                onChange={(e) => setEmailDraft(e.target.value)}
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールの本文を入力してください"
                            />
                            {/* プレビュー表示 */}
                            {emailDraft && (
                                <div>
                                    {selectedRecords.map((record, index) => (
                                        <div key={record.id} className="mb-4 flex gap-4">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-700 mb-1">
                                                    {`${index + 1}件目のプレビュー: ${record.personEmail}`}
                                                </div>
                                                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <p className="text-sm text-gray-800 whitespace-pre-line">
                                                        {replacePlaceholders(emailDraft, record)}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <Button
                                                        onClick={() => {
                                                            copyTextToClipboard(replacePlaceholders(emailDraft, record));
                                                            toaster.create({
                                                                title: `${record.personEmail}宛のメールをコピー`,
                                                                type: "success",
                                                                action: {
                                                                    label: "OK",
                                                                    onClick: () => console.log()
                                                                }
                                                            })
                                                        }}
                                                        className="px-2 py-1 text-xs font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600"
                                                    >
                                                        コピー
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
                </DrawerFooter>
                <DrawerCloseTrigger />
            </DrawerContent>
            <Toaster />
        </DrawerRoot>
    )
}