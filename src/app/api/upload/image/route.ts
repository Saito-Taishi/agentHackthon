// app/api/upload/image/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded." });
  }

  // ファイルを処理 (例：サーバーに保存)
  // ...

  return NextResponse.json({ success: true, message: "File uploaded successfully!" });
}