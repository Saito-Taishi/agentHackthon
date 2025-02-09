import { auth, db } from "@/utils/config/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

interface BusinessCard {
  imageURL: string;
  websiteURL: string | null;
  companyName: string | null;
  companyAddress: string | null;
  personName: string | null;
  personEmail: string | null;
  personPhoneNumber: string | null;
  role: string | null;
  createdAt: Date;
}

export type SelectedRecords = {
  id: string;
  companyName: string;
  personEmail?: string;
  personName: string;
};

export function useRecordHooks() {
  const [records, setRecords] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<SelectedRecords[]>([]);
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false); // EmailDrawerの表示ロジック
  const user = auth.currentUser;

  console.log("records", records);

  useEffect(() => {
    if (!user) return;

    // users/{uid}/cards コレクションを参照
    const cardsRef = collection(db, `users/${user.uid}/cards`);
    const q = query(cardsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const businessCards = snapshot.docs.map((doc) => {
          const data = doc.data() as BusinessCard;
          return {
            ...data,
            id: doc.id,
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
      }
    );

    // クリーンアップ関数でリスナーを解除
    return () => unsubscribe();
  }, [user]);

  const handleCheckboxChange = (recordId: string, record: SelectedRecords) => {
    setSelectedRecords((prevSelectedRecords) => {
      const alreadySelected = prevSelectedRecords.some(
        (selectedRecord) => selectedRecord.id === recordId
      );

      if (alreadySelected) {
        // チェック解除: 該当レコードを削除
        return prevSelectedRecords.filter(
          (selectedRecord) => selectedRecord.id !== recordId
        );
      }

      // チェック: 新しいレコード情報を追加
      return [
        ...prevSelectedRecords,
        {
          id: recordId,
          companyName: record.companyName,
          personName: record.personName,
          personEmail: record.personEmail,
        },
      ];
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
    emailSubject,
    setEmailSubject,
  };
}
