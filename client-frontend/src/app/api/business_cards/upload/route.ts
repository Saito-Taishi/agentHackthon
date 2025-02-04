import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import { validateSession } from "@/utils/auth/session";
import { isCard } from "@/utils/types/card";
import {
	createErrorResponse,
	createSuccessResponse,
	handleAPIError,
	type APISuccessResponse,
} from "@/utils/api/response";
import {
	type BusinessCardData,
	createBusinessCard,
} from "@/utils/db/business-card";

type UploadResponse = APISuccessResponse<BusinessCardData> & {
	documentId: string;
};

export async function POST(request: Request) {
	console.log("ファイルが呼び出される");
	try {
		// セッションの検証とユーザー情報の取得
		const user = await validateSession();

		// parse the incoming formData and get all files under "files"
		const formData = await request.formData();
		const files = formData.getAll("files") as File[];
		if (!files || files.length === 0) {
			return createErrorResponse(
				"ファイルが存在しません",
				"NO_FILE_PROVIDED",
				400,
			);
		}

		// Will accumulate responses for each uploaded file
		const responses: UploadResponse[] = [];

		for (const file of files) {
			// Convert each file to an ArrayBuffer and then to a base64 string.
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const base64 = buffer.toString("base64");
			const imageUrl = `data:image/png;base64,${base64}`;

			// AI処理
			const geminiModel = new ChatGoogleGenerativeAI({
				model: "gemini-2.0-flash-exp",
				temperature: 0,
			});

			// companyName: 'リコーITソリューションズ株式会社',
			// position: 'AIストラテジーセンター AIイノベーション室 ビジネスソリューショングループ',
			// name: '佐官 雄介',
			// mail: 'yusuke.sakan@jp.ricoh.com',
			// phoneNumber: '080-7353-0079',
			// companyAddress: '〒224-0035 神奈川県横浜市都筑区新栄町16-1',
			// companyUrl: 'null'
			const extractCartPrompt = await hub.pull("zenn_ai_agent_hackthon");
			const geminiChain = extractCartPrompt.pipe(geminiModel);
			const cardInfo = await geminiChain.invoke({ img_base64: imageUrl });

			const textToJsonPrompt = await hub.pull("zenn_text_to_json");
			const openaiModel = new ChatOpenAI({
				model: "gpt-4o-mini",
				temperature: 0,
			});
			const openaiChain = textToJsonPrompt.pipe(openaiModel);
			const response = await openaiChain.invoke({ text: cardInfo });
			console.log("responseは以下のようになる。", response);

			// 型チェックと変換
			const responseData = JSON.parse(JSON.stringify(response));
			if (!isCard(responseData)) {
				return createErrorResponse(
					"名刺情報の形式が正しくありません",
					"INVALID_CARD_FORMAT",
					400,
				);
			}

			// Firestoreに保存
			const { id, data } = await createBusinessCard({
				personName: responseData.name,
				personEmail: responseData.mail,
				personPhoneNumber: responseData.phoneNumber,
				role: responseData.position,
				websiteURL: responseData.companyUrl,
				createdBy: user.uid,
				companyName: responseData.companyName,
			});

			responses.push({
				success: true,
				message: "名刺画像の処理とデータ保存が完了しました",
				result: data,
				documentId: id,
			});
		}

		return createSuccessResponse(
			{
				success: true,
				message: "全ての名刺画像の処理とデータ保存が完了しました",
				result: responses,
				documentId: "", // Not applicable for multiple images
			},
			"全ての名刺画像の処理とデータ保存が完了しました",
		);
	} catch (error: unknown) {
		return handleAPIError(error);
	}
}
