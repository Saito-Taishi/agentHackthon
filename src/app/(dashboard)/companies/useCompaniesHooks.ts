"use client"
import { useState } from "react";

interface Company {
    id:string
    companyName: string;
    url: string;
    IPO: "上場" | "未上場";
    employeeCount:string;
    sales: string;
    businessActivities: string[];
    headOfficeAddress: string;
    capital: string;
    established: string;
}


export function useCompaniesHooks(){
    const companies: Company[] = [
        {
            id:"1",
            companyName: "サンプル株式会社",
            url: "https://example.com",
            IPO: "未上場",
            employeeCount: "50",
            sales: "5億円",
            businessActivities: ["ITソリューションの提供", "システム開発", "クラウドサービス"],
            headOfficeAddress: "東京都渋谷区神宮前1-1-1",
            capital: "1億円",
            established: "2015年4月1日",
        },
        {
            id:"2",
            companyName: "テスト合同会社",
            url: "https://test.co.jp",
            IPO: "上場",
            employeeCount: "1000",
            sales: "100億円",
            businessActivities: ["ECサイト運営", "物流サービス"],
            headOfficeAddress: "東京都港区六本木3-2-1",
            capital: "10億円",
            established: "2010年7月1日",
        },
        {
            id:"3",
            companyName: "DEMO株式会社",
            url: "https://demo.jp",
            IPO: "未上場",
            employeeCount: "200",
            sales: "20億円",
            businessActivities: ["マーケティング支援", "コンサルティング", "広告運用"],
            headOfficeAddress: "大阪府大阪市北区梅田2-2-2",
            capital: "5億円",
            established: "2018年1月15日",
        },
        {
            id:"4",
            companyName: "ABCホールディングス",
            url: "https://abc-holdings.co.jp",
            IPO: "上場",
            employeeCount: "5000",
            sales: "500億円",
            businessActivities: ["製造", "販売", "ITソリューション", "不動産"],
            headOfficeAddress: "東京都千代田区丸の内1-1-1",
            capital: "100億円",
            established: "1995年10月1日",
        },
    ];


    const[open, setOpen] = useState<boolean>(false)
    const [selectedCompanyName, setSelectedCompanyName] = useState(""); 
    const handleCompanyNameClick = (companyName: string) => {
      setSelectedCompanyName(companyName); // 会社名をstateにセット
      setOpen(true); // ドロワーを開く
    };
  

    return{
        companies,
        open,
        setOpen,
        selectedCompanyName,
        handleCompanyNameClick
    }
}