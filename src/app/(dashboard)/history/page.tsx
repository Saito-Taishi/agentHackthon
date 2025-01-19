'use client';

import { useState } from 'react';
import Image from 'next/image';

type UploadHistory = {
    id: string;
    companyName: string;
    name: string;
    department: string;
    position: string;
    phone: string;
    mobile: string;
    email: string;
    address: string;
    cardImage: string;
};

type DialogState = {
    isOpen: boolean;
    type: 'confirm' | 'success' | 'error';
    message?: string;
};

type EmailForm = {
    subject: string;
    body: string;
};

type ImageModalState = {
    isOpen: boolean;
    imageUrl: string | null;
};

// テーブル値の挿入用のプレースホルダーを定義
const TABLE_FIELDS = [
    { key: 'companyName', label: '会社名' },
    { key: 'name', label: '氏名' },
    { key: 'position', label: '役職' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'phone', label: '電話番号' },
    { key: 'listingStatus', label: '上場区分' },
    { key: 'companyUrl', label: '会社URL' },
] as const;

export default function HistoryPage() {
    const [histories, setHistories] = useState<UploadHistory[]>([
        {
            id: '1',
            companyName: '株式会社MIRS',
            name: '田中 太郎',
            department: 'メディア事業部',
            position: '部長',
            phone: '03-1234-5678',
            mobile: '090-1234-5678',
            email: 'tanaka@mirs.example.com',
            address: '東京都千代田区丸の内1-1-1',
            cardImage: '/sample-card-1.jpg',
        },
        {
            id: '2',
            companyName: '株式会社MIRS',
            name: '鈴木 花子',
            department: '営業部',
            position: '営業部長',
            phone: '03-1234-5678',
            mobile: '090-8765-4321',
            email: 'suzuki@mirs.example.com',
            address: '東京都千代田区丸の内1-1-1',
            cardImage: '/sample-card-2.jpg',
        },
    ]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [dialog, setDialog] = useState<DialogState>({
        isOpen: false,
        type: 'confirm',
    });
    const [emailForm, setEmailForm] = useState<EmailForm>({
        subject: '',
        body: '',
    });
    const [imageModal, setImageModal] = useState<ImageModalState>({
        isOpen: false,
        imageUrl: null,
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(histories.map(h => h.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    // テーブル値を本文に挿入する関数
    const insertFieldToBody = (fieldKey: keyof UploadHistory) => {
        const placeholder = `{{${fieldKey}}}`;
        const textArea = document.getElementById('body') as HTMLTextAreaElement;

        if (textArea) {
            const start = textArea.selectionStart;
            const end = textArea.selectionEnd;
            const currentBody = emailForm.body;

            const newBody =
                currentBody.substring(0, start) +
                placeholder +
                currentBody.substring(end);

            setEmailForm(prev => ({ ...prev, body: newBody }));

            // カーソル位置を挿入したプレースホルダーの後ろに移動
            setTimeout(() => {
                textArea.focus();
                textArea.setSelectionRange(
                    start + placeholder.length,
                    start + placeholder.length
                );
            }, 0);
        }
    };

    const handleSendEmail = async () => {
        if (selectedIds.length === 0) return;

        try {
            setIsSending(true);
            const selectedHistories = histories.filter(h => selectedIds.includes(h.id));

            // 各選択されたユーザーごとにプレースホルダーを置換
            const emailPromises = selectedHistories.map(history => {
                let personalizedBody = emailForm.body;

                // 各フィールドのプレースホルダーを実際の値に置換
                TABLE_FIELDS.forEach(field => {
                    const placeholder = `{{${field.key}}}`;
                    personalizedBody = personalizedBody.replace(
                        new RegExp(placeholder, 'g'),
                        history[field.key] ?? ''
                    );
                });

                // TODO: 実際のメール送信処理
                console.log('Sending personalized email:', {
                    to: history.email,
                    subject: emailForm.subject,
                    body: personalizedBody,
                });
            });

            await Promise.all(emailPromises);

            setDialog({
                isOpen: true,
                type: 'success',
                message: `${selectedIds.length}件のメールを送信しました。`,
            });
            setSelectedIds([]); // 選択をクリア
            setEmailForm({ subject: '', body: '' }); // フォームをリセット
        } catch (error) {
            setDialog({
                isOpen: true,
                type: 'error',
                message: 'メールの送信に失敗しました。',
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleConfirmSend = () => {
        setDialog({
            isOpen: true,
            type: 'confirm',
        });
        // デフォルトの件名と本文を設定
        setEmailForm({
            subject: '名刺情報の確認依頼',
            body: '先日お預かりした名刺情報をご確認ください。\n\n',
        });
    };

    const closeDialog = () => {
        setDialog(prev => ({ ...prev, isOpen: false }));
    };

    // 画像モーダルを開く関数
    const openImageModal = (imageUrl: string) => {
        setImageModal({
            isOpen: true,
            imageUrl,
        });
    };

    // 画像モーダルを閉じる関数
    const closeImageModal = () => {
        setImageModal({
            isOpen: false,
            imageUrl: null,
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    アップロード履歴
                </h1>
                <button
                    onClick={handleConfirmSend}
                    disabled={selectedIds.length === 0 || isSending}
                    className={`
                        relative inline-flex items-center justify-center px-5 py-2.5
                        rounded-md font-medium focus:outline-none focus:ring-2
                        focus:ring-offset-2 transition-colors
                        ${selectedIds.length === 0 || isSending
                            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                        }
                    `}
                >
                    {isSending ? '送信中...' : `選択したメンバーにメール送信 (${selectedIds.length})`}
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === histories.length && histories.length > 0}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                                名刺画像
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                                会社名
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                                氏名
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                                部署・役職
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                                連絡先
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {histories.map((history) => (
                            <tr
                                key={history.id}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(history.id)}
                                        onChange={() => handleSelect(history.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <button
                                        type="button"
                                        onClick={() => openImageModal(history.cardImage)}
                                        className="relative w-20 h-20 overflow-hidden rounded-lg flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm group"
                                    >
                                        <Image
                                            src={history.cardImage}
                                            alt={`${history.name}の名刺`}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-base font-semibold text-blue-700 dark:text-blue-400">
                                        {history.companyName}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-100">
                                        {history.name}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="mb-1 font-medium text-gray-900 dark:text-gray-100">
                                        {history.department}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        {history.position}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                            <span className="w-5">📞</span> {history.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                            <span className="w-5">📱</span> {history.mobile}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                            <span className="w-5">✉️</span>
                                            <a
                                                href={`mailto:${history.email}`}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {history.email}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ダイアログ */}
            {dialog.isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50
                               transition-opacity"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
                        {dialog.type === 'confirm' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                    メール送信
                                </h3>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                                        >
                                            件名
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={emailForm.subject}
                                            onChange={(e) =>
                                                setEmailForm(prev => ({ ...prev, subject: e.target.value }))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                       shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="body"
                                            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                                        >
                                            本文
                                        </label>
                                        {/* 挿入ボタン群 */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {TABLE_FIELDS.map(field => (
                                                <button
                                                    key={field.key}
                                                    onClick={() => insertFieldToBody(field.key)}
                                                    type="button"
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300
                                                               text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50
                                                               dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600
                                                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {field.label}を挿入
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            id="body"
                                            rows={6}
                                            value={emailForm.body}
                                            onChange={(e) =>
                                                setEmailForm(prev => ({ ...prev, body: e.target.value }))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            ※ 挿入されたフィールドは送信時に各ユーザーの情報に置換されます
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeDialog}
                                        className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={!emailForm.subject || !emailForm.body}
                                        className={`
                                            px-4 py-2 rounded-md font-medium text-white
                                            transition-colors focus:outline-none
                                            ${!emailForm.subject || !emailForm.body
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                            }
                                        `}
                                    >
                                        送信する
                                    </button>
                                </div>
                            </>
                        )}

                        {(dialog.type === 'success' || dialog.type === 'error') && (
                            <>
                                <div
                                    className={`mb-4 flex justify-center text-${dialog.type === 'success' ? 'green' : 'red'
                                        }-600`}
                                >
                                    {dialog.type === 'success' ? (
                                        <svg
                                            className="w-10 h-10"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-10 h-10"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-center mb-6 text-gray-900 dark:text-gray-100">
                                    {dialog.message}
                                </p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={closeDialog}
                                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300
                                                   dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 画像モーダル */}
            {imageModal.isOpen && imageModal.imageUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 cursor-pointer
                               transition-opacity"
                    onClick={closeImageModal}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg
                                   transition-transform transform hover:scale-105 sm:hover:scale-100"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="閉じる"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={imageModal.imageUrl}
                                alt="名刺拡大画像"
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
