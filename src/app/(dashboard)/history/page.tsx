'use client';

import { useState } from 'react';

type UploadHistory = {
    id: string;
    companyName: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    uploadDate: string;
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

// テーブル値の挿入用のプレースホルダーを定義
const TABLE_FIELDS = [
    { key: 'companyName', label: '会社名' },
    { key: 'name', label: '氏名' },
    { key: 'position', label: '役職' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'phone', label: '電話番号' },
] as const;

export default function HistoryPage() {
    const [histories, setHistories] = useState<UploadHistory[]>([
        {
            id: '1',
            companyName: '株式会社サンプル',
            name: '山田太郎',
            position: '営業部長',
            email: 'yamada@example.com',
            phone: '03-1234-5678',
            uploadDate: '2024-03-20',
        },
        {
            id: '2',
            companyName: '株式会社テスト',
            name: '鈴木花子',
            position: 'マネージャー',
            email: 'suzuki@example.com',
            phone: '03-8765-4321',
            uploadDate: '2024-03-19',
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
                        history[field.key]
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

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">アップロード履歴</h1>
                <button
                    onClick={handleConfirmSend}
                    disabled={selectedIds.length === 0 || isSending}
                    className={`
                        px-4 py-2 rounded-lg font-medium text-white
                        ${selectedIds.length === 0 || isSending
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                        transition-colors
                    `}
                >
                    {isSending ? '送信中...' : `選択したメンバーにメール送信 (${selectedIds.length})`}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === histories.length}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                会社名
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                氏名
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                役職
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                メールアドレス
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                電話番号
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                アップロード日
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {histories.map((history) => (
                            <tr key={history.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(history.id)}
                                        onChange={() => handleSelect(history.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.companyName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.position}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {history.uploadDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ダイアログ */}
            {dialog.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                        {dialog.type === 'confirm' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">メール送信</h3>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            件名
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={emailForm.subject}
                                            onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="body"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                                >
                                                    {field.label}を挿入
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            id="body"
                                            rows={6}
                                            value={emailForm.body}
                                            onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            ※ 挿入されたフィールドは送信時に各ユーザーの情報に置換されます
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeDialog}
                                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={!emailForm.subject || !emailForm.body}
                                        className={`
                                            px-4 py-2 rounded-lg text-white
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
                                <div className={`mb-4 text-${dialog.type === 'success' ? 'green' : 'red'}-600`}>
                                    {dialog.type === 'success' ? (
                                        <svg className="w-6 h-6 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-center mb-6">{dialog.message}</p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={closeDialog}
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
