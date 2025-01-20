'use client';

import { useImageUpload } from '@/utils/hooks/useUploadHooks';
import Image from 'next/image';
import { v4 as uuidv4 } from "uuid";


// コンポーネント部分
export default function UploadPage() {
    const {
        selectedImages,
        isLoading,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
    } = useImageUpload();
    return (
        <div className="container mx-auto max-w-3xl">
            {/* ヘッダー部分 */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">名刺画像を選択</h1>
                {/* 実行ボタン */}
                <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={!selectedImages || isLoading}
                    className={`
                        px-6 py-2.5 rounded-lg font-medium text-white
                        ${!selectedImages || isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                        transition-colors
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <title>ローディング</title>
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            処理中...
                        </span>
                    ) : (
                        '実行する'
                    )}
                </button>
            </div>

            {/* 画像選択エリア */}
            <div className="mb-8">
                <label
                    htmlFor="image-upload"
                    className="block w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <svg
                            className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-labelledby="upload-icon-label"
                        >
                            <title>アップロードアイコン</title>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span className="text-gray-500 dark:text-gray-400">
                            クリックして画像を選択
                        </span>
                    </div>
                    <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                    />
                </label>
            </div>


            {/* 画像プレビューエリア */}
            {selectedImages.length > 0 && (
                <div className="mb-8 grid grid-cols-3 gap-4">
                    {selectedImages.map((image) => {
                        const imageWithId = { url: image, id: uuidv4() };
                        return (
                            <div
                                key={imageWithId.id}
                                className="relative p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                            >
                                <div className="space-y-3">
                                    <div className="relative w-full h-[160px]">
                                        <Image
                                            src={imageWithId.url}
                                            alt=""
                                            fill
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveImage(selectedImages.indexOf(imageWithId.url))}
                                        className="w-full bg-red-500 text-white rounded-lg px-3 py-1.5 hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 text-sm"
                                        type="button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            {/* TODO削除 */}
                                            <title>TODO削除</title>
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        削除する
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}