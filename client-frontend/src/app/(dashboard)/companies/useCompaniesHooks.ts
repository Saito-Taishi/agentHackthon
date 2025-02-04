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
	// const companies: Company[] = [
	//   {
	//     id: "1",
	//     companyName: "サンプル株式会社",
	//     url: "https://example.com",
	//     IPO: "未上場",
	//     employeeCount: "50",
	//     sales: "5億円",
	//     businessActivities: [
	//       "ITソリューションの提供",
	//       "システム開発",
	//       "クラウドサービス",
	//     ],
	//     headOfficeAddress: "東京都渋谷区神宮前1-1-1",
	//     capital: "1億円",
	//     established: "2015年4月1日",
	//   },
	//   {
	//     id: "2",
	//     companyName: "テスト合同会社",
	//     url: "https://test.co.jp",
	//     IPO: "上場",
	//     employeeCount: "1000",
	//     sales: "100億円",
	//     businessActivities: ["ECサイト運営", "物流サービス"],
	//     headOfficeAddress: "東京都港区六本木3-2-1",
	//     capital: "10億円",
	//     established: "2010年7月1日",
	//   },
	//   {
	//     id: "3",
	//     companyName: "DEMO株式会社",
	//     url: "https://demo.jp",
	//     IPO: "未上場",
	//     employeeCount: "200",
	//     sales: "20億円",
	//     businessActivities: [
	//       "マーケティング支援",
	//       "コンサルティング",
	//       "広告運用",
	//     ],
	//     headOfficeAddress: "大阪府大阪市北区梅田2-2-2",
	//     capital: "5億円",
	//     established: "2018年1月15日",
	//   },
	//   {
	//     id: "4",
	//     companyName: "ABCホールディングス",
	//     url: "https://abc-holdings.co.jp",
	//     IPO: "上場",
	//     employeeCount: "5000",
	//     sales: "500億円",
	//     businessActivities: ["製造", "販売", "ITソリューション", "不動産"],
	//     headOfficeAddress: "東京都千代田区丸の内1-1-1",
	//     capital: "100億円",
	//     established: "1995年10月1日",
	//   },
	// ];

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
			},
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
