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

export function handleAPIError(error: unknown): NextResponse<APIErrorResponse> {
  console.error("API Error:", error);

  // セッションエラーの処理
  if (error instanceof SessionError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: error.code,
      },
      { status: 401 },
    );
  }

  let errorMessage = "不明なエラーが発生しました";
  let errorCode = "UNKNOWN_ERROR";
  const statusCode = 500;

  if (error instanceof Error) {
    if (error.message.includes("Firestore")) {
      errorMessage = "データベース接続エラー";
      errorCode = "DATABASE_ERROR";
    } else if (error.message.includes("AI")) {
      errorMessage = "AI処理エラー";
      errorCode = "AI_PROCESSING_ERROR";
    } else {
      errorMessage = error.message;
    }
  }

  return NextResponse.json(
    {
      success: false,
      message: `エラーが発生しました: ${errorMessage}`,
      error: errorCode,
    },
    { status: statusCode },
  );
}

export function createErrorResponse(
  message: string,
  errorCode: string,
  status = 400,
): NextResponse<APIErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: errorCode,
    },
    { status },
  );
}

export function createSuccessResponse<T>(
  result: T,
  message: string,
): NextResponse<APISuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    message,
    result,
  });
}
