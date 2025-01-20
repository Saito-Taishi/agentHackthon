'use client';

import { useImageUpload } from '@/utils/hooks/useUploadHooks';
import Image from 'next/image';


// コンポーネント部分
export default function UploadPage() {
    const { selectedImage, isLoading, handleImageSelect, handleSubmit } = useImageUpload();

    return (
        <div className="container mx-auto max-w-3xl">
            <h1 className="text-2xl font-bold mb-8">画像アップロード</h1>

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
            {selectedImage && (
                <div className="mb-8">
                    <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                            src={selectedImage}
                            alt="Selected image preview"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}

            {/* 実行ボタン */}
            <div className="flex justify-center">
                <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={!selectedImage || isLoading}
                    className={`
              px-6 py-3 rounded-lg font-medium text-white
              ${!selectedImage || isLoading
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
        </div>
    );
}