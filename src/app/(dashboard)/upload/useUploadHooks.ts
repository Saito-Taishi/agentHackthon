"use client";

import { useState } from "react";
import heic2any from "heic2any";

type UploadResult = {
  success: boolean;
  message: string;
  result: {
    companyName: string;
    position: string;
    name: string;
    mail: string;
    phoneNumber: string;
    companyAddress: string;
    companyUrl: string;
  };
  documentId: string;
};

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ----
  // HEICなどを含むファイル選択に対応するため、非同期関数に変更
  // ----
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImageUrls: string[] = [];

    // ファイルを1枚ずつ確認しながらプレビュー用URLを作成
    for (const file of Array.from(files)) {
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
          const convertedURL = URL.createObjectURL(convertedBlob as Blob);
          newImageUrls.push(convertedURL);
        } catch (err) {
          console.error("HEIC→JPEG変換中にエラー:", err);
          setError("HEICファイルの変換に失敗しました");
        }
      } else {
        // 通常の画像の場合はそのままURL化
        if (file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          newImageUrls.push(imageUrl);
        }
      }
    }
    setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
    setError(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      setError("画像が選択されていません");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      const files = fileInput.files;

      if (!files) {
        throw new Error("ファイルが選択されていません");
      }

      const totalFiles = files.length;
      let completedFiles = 0;

      // 各画像に対して個別にAPIリクエストを送信
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();

        // HEICファイルの場合はPNGに変換
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
            formData.append("file", convertedBlob as Blob, file.name.replace(/\.heic$/i, ".png"));
          } catch (err) {
            console.error("HEIC→PNG変換中にエラー:", err);
            throw new Error("HEICファイルの変換に失敗しました");
          }
        } else {
          formData.append("file", file);
        }

        const response = await fetch("/api/business_cards/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "アップロードに失敗しました");
        }

        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));

        return response.json() as Promise<UploadResult>;
      });

      // すべてのアップロードを待機
      const results = await Promise.all(uploadPromises);
      setUploadResults(results);
      console.log("アップロード結果:", results);
    } catch (error: unknown) {
      console.error("画像アップロードエラー:", error);
      if (error instanceof Error) setError(error.message);
      else setError("画像のアップロードに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedImages,
    isLoading,
    uploadProgress,
    uploadResults,
    error,
    handleImageSelect,
    handleRemoveImage,
    handleSubmit,
  };
}
