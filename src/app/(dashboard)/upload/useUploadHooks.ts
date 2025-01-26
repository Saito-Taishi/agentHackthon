"use client";

import { useState } from 'react';
import heic2any from 'heic2any';

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ----
  // HEICなどを含むファイル選択に対応するため、非同期関数に変更
  // ----
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImageUrls: string[] = [];

    // ファイルを1枚ずつ確認しながらプレビュー用URLを作成
    for (const file of Array.from(files)) {
      const isHeic = file.type.includes('heic') || file.type.includes('heif')
        || file.name.toLowerCase().endsWith('.heic')
        || file.name.toLowerCase().endsWith('.heif');

      if (isHeic) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/png',
          });
          const convertedURL = URL.createObjectURL(convertedBlob as Blob);

          newImageUrls.push(convertedURL);
        } catch (err) {
          console.error('HEIC→JPEG変換中にエラー:', err);
        }
      } else {
        // 通常の画像の場合はそのままURL化
        if (file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          newImageUrls.push(imageUrl);
        }
      }
    }
    setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };


  const handleSubmit = async () => {
    if (selectedImages.length === 0) return;

    setIsLoading(true);
    try {
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      const files = fileInput.files;

      if (!files) {
        throw new Error("No files selected");
      }

      // 各画像に対して個別にAPIリクエストを送信
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        
        // HEICファイルの場合はPNGに変換
        const isHeic = file.type.includes('heic') || file.type.includes('heif')
          || file.name.toLowerCase().endsWith('.heic')
          || file.name.toLowerCase().endsWith('.heif');

        if (isHeic) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/png',
            });
            formData.append("file", convertedBlob as Blob, file.name.replace(/\.heic$/i, '.png'));
          } catch (err) {
            console.error('HEIC→PNG変換中にエラー:', err);
            throw err;
          }
        } else {
          formData.append("file", file);
        }

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      });

      // すべてのアップロードを待機
      const results = await Promise.all(uploadPromises);
      console.log("Upload results:", results);

    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedImages,
    isLoading,
    handleImageSelect,
    handleRemoveImage,
    handleSubmit,
  };
}
