"use client";

import { useState } from "react";
import heic2any from "heic2any";
import type { Card } from "@/utils/types/card";
import type { APIResponse } from "@/utils/api/response";

type UploadResponse = APIResponse<Card>;

export function useImageUpload() {
	const [selectedFiles, setSelectedFiles] = useState<Blob[]>([]);
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	// const [uploadProgress, setUploadProgress] = useState(0);
	// const [uploadResults, setUploadResults] = useState<UploadResponse[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newImageUrls: string[] = [];
			const newFiles: Blob[] = [];
			const file = e.target.files[0];
			const isHeic =
				file.type.includes("heic") ||
				file.type.includes("heif") ||
				file.name.toLowerCase().endsWith(".heic") ||
				file.name.toLowerCase().endsWith(".heif");
			if (isHeic) {
				try {
					const convertedBlob = await heic2any({
						blob: file,
						toType: "image/png",
					});
					newFiles.push(convertedBlob as Blob);
					setSelectedFiles((prev) => [...prev, ...newFiles]);
					const convertedURL = URL.createObjectURL(convertedBlob as Blob);
					newImageUrls.push(convertedURL);
				} catch {
					return console.log("");
				}
			} else {
				const imageUrl = URL.createObjectURL(file);
				newFiles.push(file as Blob);
				setSelectedFiles((prev) => [...prev, ...newFiles]);
				newImageUrls.push(imageUrl);
			}
			setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
		}
	};

	const handleRemoveImage = (indexToRemove: number) => {
		setSelectedFiles((prevFiles) =>
			prevFiles.filter((_, index) => index !== indexToRemove),
		);
		setSelectedImages((prevImages) =>
			prevImages.filter((_, index) => index !== indexToRemove),
		);
	};

	// 圧縮 -> 送信
	const handleSubmit = async () => {
		if (selectedImages.length === 0) {
			setError("画像が選択されていません");
			return;
		}
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const results: UploadResponse[] = [];

			// 各ファイルを圧縮してアップロード
			for (const file of selectedFiles) {
				const compressedFile = await compressImage(file, 0.7);

				// ここでサーバーへ送信する準備
				// fetchでバイナリデータを送る場合の一例
				const response = await fetch("/api/business_cards/upload", {
					method: "POST",
					// 任意のヘッダーなど追加したい場合はここに記述
					// headers: {
					//   "Content-Type": "image/jpeg",
					// },
					body: compressedFile,
					credentials: "include",
				});

				const data = (await response.json()) as UploadResponse;
				if (!response.ok || !data.success) {
					throw new Error(data.message || "アップロードに失敗しました");
				}
				results.push(data);
			}

			console.log("アップロード結果:", results);
			setSuccessMessage("名刺の登録が完了しました");
			setSelectedImages([]);
			setSelectedFiles([]);
		} catch (error: unknown) {
			console.error("画像アップロードエラー:", error);
			setError(
				error instanceof Error
					? error.message
					: "アップロード中にエラーが発生しました。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		selectedImages,
		error,
		successMessage,
		handleImageSelect,
		handleRemoveImage,
		handleSubmit,
	};
}

/**
 * canvasを使って画像を圧縮する関数
 * @param file 圧縮対象の画像ファイル（Blob）
 * @param quality 圧縮品質（0～1、例:0.7）
 * @returns 圧縮後のBlob（JPEG形式）
 */
const compressImage = async (file: Blob, quality = 0.7): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = URL.createObjectURL(file);

		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return reject(new Error("Canvasのコンテキストが取得できませんでした"));
			}

			// ここでリサイズも可能（必要があれば width / height を適切に計算）
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

			// JPEGで再エンコードしてBlob化
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("画像の圧縮に失敗しました"));
					}
				},
				"image/jpeg",
				quality,
			);
		};

		image.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
	});
};
