"use client"

import { useState } from 'react';

export function useImageUpload() {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const imageUrls = Array.from(files)
          .filter((file) => file.type.startsWith("image/"))
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
        const fileInput = document.getElementById("image-upload") as HTMLInputElement;
        const files = fileInput.files;
  
        if (!files) {
          throw new Error("No files selected");
        }

        // 各画像に対して個別にAPIリクエストを送信
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file); // キーを'file'に変更

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