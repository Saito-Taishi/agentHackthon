import { NextResponse } from "next/server";
import { SessionError } from "../auth/session";

export type APIErrorResponse = {
  success: false;
  message: string;
  error: string;
};

export type APISuccessResponse<T> = {
  success: true;
  message: string;
  result: T;
};

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

const createErrorPayload = (message: string, errorCode: string): APIErrorResponse => ({
  success: false,
  message,
  error: errorCode,
});

export const handleAPIError = (error: unknown): NextResponse<APIErrorResponse> => {
  console.error("API Error:", error);

  // セッションエラーの処理
  if (error instanceof SessionError) {
    return NextResponse.json(createErrorPayload(error.message, error.code), { status: 401 });
  }

  const errorPayload = (() => {
    if (error instanceof Error) {
      if (error.message.includes("Firestore")) {
        return createErrorPayload("データベース接続エラー", "DATABASE_ERROR");
      }
      if (error.message.includes("AI")) {
        return createErrorPayload("AI処理エラー", "AI_PROCESSING_ERROR");
      }
      return createErrorPayload(error.message, "UNKNOWN_ERROR");
    }
    return createErrorPayload("不明なエラーが発生しました", "UNKNOWN_ERROR");
  })();

  return NextResponse.json(errorPayload, { status: 500 });
};

export const createErrorResponse = (
  message: string,
  errorCode: string,
  status = 400,
): NextResponse<APIErrorResponse> => {
  return NextResponse.json(createErrorPayload(message, errorCode), { status });
};

export const createSuccessResponse = <T>(
  result: T,
  message: string,
): NextResponse<APISuccessResponse<T>> => {
  return NextResponse.json({
    success: true,
    message,
    result,
  });
};
