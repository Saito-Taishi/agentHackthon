import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/config/firebase";
import type { BusinessCardData } from "@/utils/db/business-card";

interface BusinessCard extends BusinessCardData {
  id: string;
  status: boolean;
  imageUrl: string;
}

export function useRecordHooks() {
  const [records, setRecords] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);


  const [open, setOpen] = useState<boolean>(false) // EmailDrawerの表示ロジック
  console.log("records", records);

  useEffect(() => {
    const businessCardsRef = collection(db, "business_cards");
    const q = query(businessCardsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const businessCards = snapshot.docs.map((doc) => {
          const data = doc.data() as BusinessCardData;
          return {
            ...data,
            id: doc.id,
            imageUrl: "https://via.placeholder.com/150", // TODO: 実際の画像URLを設定
            status: false, // TODO: ステータスの管理方法を検討
          };
        });
        setRecords(businessCards);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching business cards:", err);
        setError("名刺データの取得中にエラーが発生しました");
        setLoading(false);
      },
    );

    // クリーンアップ関数でリスナーを解除
    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedRecords((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((recordId) => recordId !== id);
      }
      return [...prevSelected, id];
    });
  };

  return {
    selectedRecords,
    open,
    setOpen,
    records,
    loading,
    error,
    handleCheckboxChange,
  };
}
