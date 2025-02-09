"use client";

import Compressor from "compressorjs";
import { useState } from "react";
// Add Firebase Storage imports
import { auth } from "@/utils/config/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

      for (const file of selectedFiles) {
        const compressedFile = await compressImage(file, 1);
        await uploadToCloudStorage(compressedFile, authUid);
      }

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
 * 画像を1MB以下に圧縮する関数（compressorjsを使用）
 * @param file 圧縮対象の画像ファイル（Blob）
 * @param maxSizeInMB 最大ファイルサイズ（MB）
 * @returns 圧縮後のBlob（JPEG形式）
 */
const compressImage = async (file: Blob, initialQuality = 1): Promise<Blob> => {
  const maxSizeInBytes = 1 * 1024 * 1024; // 1MB in bytes

  const compress = async (quality: number): Promise<Blob> => {
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

  let result = await compress(initialQuality);
  let quality = initialQuality;

  // If still over 1MB, keep compressing with lower quality
  while (result.size > maxSizeInBytes && quality > 0.1) {
    quality -= 0.1;
    result = await compress(quality);
  }

  if (result.size > maxSizeInBytes) {
    throw new Error("画像を1MB以下に圧縮できませんでした");
  }

  return result;
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

  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
};
