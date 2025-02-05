"use client";

import { useState } from "react";
import type { Card } from "@/utils/types/card";
import type { APIResponse } from "@/utils/api/response";
import Compressor from "compressorjs";

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
			// TODO HEICを処理できるようにする。
			// const isHeic =
			// 	file.type.includes("heic") ||
			// 	file.type.includes("heif") ||
			// 	file.name.toLowerCase().endsWith(".heic") ||
			// 	file.name.toLowerCase().endsWith(".heif");
			// if (isHeic) {
			// }

			// 複数ファイルを配列化
			const filesArray = Array.from(e.target.files);
			// HEICファイルは除外（拡張子で判定）
			const filteredFiles = filesArray.filter(
				(file) => !file.name.toLowerCase().endsWith(".heic"),
			);

			// 各ファイルをbase64にエンコード
			const base64Promises = filteredFiles.map((file) => {
				return new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			});
			const base64Files = await Promise.all(base64Promises);

			// 状態に追加
			setSelectedImages((prev) => [...prev, ...base64Files]);
			setSelectedFiles((prev) => [...prev, ...filteredFiles]);
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

			// 全ファイルを圧縮してFormDataにまとめてアップロード
			const formData = new FormData();
			for (const file of selectedFiles) {
				const compressedFile = await compressImage(file, 0.7);
				formData.append("files", compressedFile);
			}

			const response = await fetch("/api/business_cards/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const data = (await response.json()) as UploadResponse;
			if (!response.ok || !data.success) {
				throw new Error(data.message || "アップロードに失敗しました");
			}
			results.push(data);

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
 * 画像を圧縮する関数（compressorjsを使用）
 * @param file 圧縮対象の画像ファイル（Blob）
 * @param quality 圧縮品質（0～1、例:0.7）
 * @returns 圧縮後のBlob（JPEG形式）
 */
const compressImage = async (file: Blob, quality = 0.7): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		new Compressor(file, {
			quality,
			success(result) {
				resolve(result);
			},
			error(err) {
				reject(new Error(err.message));
			},
		});
	});
};
