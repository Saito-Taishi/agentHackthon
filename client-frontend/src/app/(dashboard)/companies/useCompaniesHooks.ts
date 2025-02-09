"use client";
import { useState } from "react";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/config/firebase";

interface Company {
  id: string;
  name: string;
  domain: string;
  employeeCount: string;
  sales: string;
  businessActivities: string[];
  headOfficeAddress: string;
  capital: string;
  established: string;
}

interface Employee {
  id: string;
  companyID: string;
  name: string;
  affiliation: string;
  position: string;
  email: string;
}

export function useCompaniesHooks() {
  const employees: Employee[] = [
    // サンプル株式会社の従業員
    {
      id: "e1",
      companyID: "1",
      name: "山田 太郎",
      affiliation: "空間マーケティング部 キュレーション課",
      position: "エンジニア",
      email: "taro.yamada@example.com",
    },
    {
      id: "e2",
      companyID: "1",
      name: "佐藤 花子",
      affiliation: "総合支援部",
      position: "プロジェクトマネージャー",
      email: "hanako.sato@example.com",
    },
    // テスト合同会社の従業員
    {
      id: "e3",
      companyID: "2",
      name: "鈴木 一郎",
      affiliation: "パッケージイノベーション部",
      position: "物流マネージャー",
      email: "ichiro.suzuki@test.co.jp",
    },
    {
      id: "e4",
      companyID: "2",
      name: "高橋 次郎",
      affiliation: "パッケージイノベーション部",
      position: "ECサイト担当",
      email: "jiro.takahashi@test.co.jp",
    },
    // DEMO株式会社の従業員
    {
      id: "e5",
      companyID: "3",
      name: "田中 三郎",
      affiliation: "パッケージイノベーション部",
      position: "マーケティング担当",
      email: "saburo.tanaka@demo.jp",
    },
    {
      id: "e6",
      companyID: "3",
      name: "伊藤 四郎",
      affiliation: "パッケージイノベーション部",
      position: "コンサルタント",
      email: "shiro.ito@demo.jp",
    },
    // ABCホールディングスの従業員
    {
      id: "e7",
      companyID: "4",
      name: "渡辺 五郎",
      affiliation: "パッケージイノベーション部",
      position: "製造部長",
      email: "goro.watanabe@abc-holdings.co.jp",
    },
    {
      id: "e8",
      companyID: "4",
      name: "中村 六郎",
      affiliation: "パッケージイノベーション部",
      position: "ITソリューションエンジニア",
      email: "rokuro.nakamura@abc-holdings.co.jp",
    },
  ];

  const [open, setOpen] = useState<boolean>(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const where = [];
    const companiesRef = collection(db, "companies");
    const unsubscribe = onSnapshot(
      companiesRef,
      (snapshot) => {
        const companiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Company[];

        console.log("companies", companiesData);
        setCompanies(companiesData);
      },
      (error) => {
        console.error("Error fetching companies:", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const handleCompanyNameClick = (companyName: string, companyId: string) => {
    setSelectedCompanyName(companyName);
    setSelectedCompanyId(companyId);
    setOpen(true);
  };

  const getEmployeesByCompanyId = (companyId: string) => {
    //TODO デプロイ時にここでエラーが発生してしまうため。
    return employees.filter((employee) => employee.companyID === companyId);
  };

  return {
    companies,
    open,
    setOpen,
    selectedCompanyName,
    selectedCompanyId,
    handleCompanyNameClick,
    getEmployeesByCompanyId,
  };
}
