import { useState } from "react";
interface BusinessCard {
    id: string;
    uploadedAt: string;
    companyName: string;
    employeeName: string;
    position: string;
    email: string;
    imageUrl: string;
    status: boolean;
}

export function useRecordHooks(){
    // 後でAPIから取得する形に変更
    const [records] = useState<BusinessCard[]>([
        {
            id: "1",
            uploadedAt: "2024-03-15 14:30:25",
            companyName: "サンプル株式会社",
            employeeName: "山田 太郎",
            position: "開発部長",
            email: "taishi.saito@onesteps.net",
            imageUrl: "https://via.placeholder.com/150",
            status: false,
        },
        {
            id: "2",
            uploadedAt: "2024-03-15 14:28:10",
            companyName: "テスト合同会社",
            employeeName: "鈴木 花子",
            position: "シニアエンジニア",
            email: "taichi.saito@algomatic.jp",
            imageUrl: "https://via.placeholder.com/150",
            status: false,
        },
        {
            id: "3",
            uploadedAt: "2024-03-15 14:25:00",
            companyName: "株式会社ABC",
            employeeName: "佐藤 次郎",
            position: "営業部長",
            email: "sato@abc.co.jp",
            imageUrl: "https://via.placeholder.com/150",
            status: false,
        },
    ]);

    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

    const handleCheckboxChange = (id: string) => {
        setSelectedRecords((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((recordId) => recordId !== id);
            }
            return [...prevSelected, id];
        });
    };

    return{
        selectedRecords,
        records,
        handleCheckboxChange,
    }
}