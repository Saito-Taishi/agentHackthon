"use client"


import { useState } from 'react';

export function useImageUpload() {
    const [selectedImages, setSelectedImages] = useState<string[]>([]); // 複数画像対応
    const [isLoading, setIsLoading] = useState(false);
  
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const imageUrls = Array.from(files)
          .filter((file) => file.type.startsWith("image/")) // 画像ファイルのみフィルタリング
          .map((file) => URL.createObjectURL(file));
        setSelectedImages((prevImages) => [...prevImages, ...imageUrls]);
      }
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
        const formData = new FormData();

        // URL.createObjectURL で作成した URL は Blob URL なので、元の File オブジェクトが必要
        // ここでは、input 要素から File オブジェクトを再度取得して FormData に追加する
        const fileInput = document.getElementById(
          "image-upload"
        ) as HTMLInputElement;
        const files = fileInput.files;
  
        if (files) {
          for (let i = 0; i < files.length; i++) {
            // 選択された画像の数だけ繰り返し
            if (selectedImages.includes(URL.createObjectURL(files[i]))) {
              formData.append("images", files[i]); // 'images' というキーで複数の画像を追加
            }
          }
        }
  
        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // TODO: レスポンスに応じた処理 (例: 成功メッセージの表示)
        console.log("Images uploaded successfully!");
      } catch (error) {
        console.error("Error uploading images:", error);
        // TODO: エラーハンドリング (例: エラーメッセージの表示)
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