"use client";

import { useState } from "react";
import type { Card } from "@/utils/types/card";
import type { APIResponse } from "@/utils/api/response";
import Compressor from "compressorjs";
// Add Firebase Storage imports
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth } from "@/utils/config/firebase";

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
        (file) => !file.name.toLowerCase().endsWith(".heic")
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
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
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
      // Assume auth UID is available here; replace with actual auth UID retrieval.
      const authUid = auth.currentUser?.uid;
      if (!authUid) {
        throw new Error("ログインしてください");
      }

      const results: UploadResponse[] = [];

      // 全ファイルを圧縮してFormDataにまとめてアップロード
      const formData = new FormData();
      for (const file of selectedFiles) {
        const compressedFile = await compressImage(file, 0.7);
        // Upload to Firebase Storage with the associated auth UID using SDK
        await uploadToCloudStorage(compressedFile, authUid);
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
          : "アップロード中にエラーが発生しました。"
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

/**
 * Firebase Storageを活用してAuthのUIDと紐付けてアップロードするための関数
 * @param file 圧縮後の画像ファイル（Blob）
 * @param uid 認証済みユーザーのUID
 */
const uploadToCloudStorage = async (file: Blob, uid: string): Promise<void> => {
  const storage = getStorage();
  // Create a unique file path including the user's UID
  const filePath = `${uid}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.jpg`;
  const metadata = {
    customMetadata: {
      userId: uid, // We already have the verified UID from the parameter
    },
  };
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file, metadata);
};
