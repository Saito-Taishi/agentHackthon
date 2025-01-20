"use client"


import { useState } from 'react';

// カスタムフック部分
export function useImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      // TODO: ここに画像処理のロジックを実装
      await new Promise(resolve => setTimeout(resolve, 2000)); // 仮の処理時間
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { selectedImage, isLoading, handleImageSelect, handleSubmit };
}
