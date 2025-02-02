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

	//名刺をスキャン
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
			console.log("selectedFileの数は", selectedFiles.length);
			for (const file of selectedFiles) {
				console.log("呼び出し");
				const response = await fetch("/api/business_cards/upload", {
					method: "POST",
					body: file,
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
			setIsLoading(false);
		} catch (error: unknown) {
			console.error("画像アップロードエラー:", error);
			setError(
				error instanceof Error
					? error.message
					: "アップロード中にエラーが発生しました。",
			);
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
