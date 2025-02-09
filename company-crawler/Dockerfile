# ベースイメージとして Python 3.11.7-slim を使用
FROM python:3.11.7-slim

# Playwright の依存ライブラリのインストール（必要に応じて調整してください）
RUN apt-get update && apt-get install -y --no-install-recommends \
libnss3 \
libatk1.0-0 \
libatk-bridge2.0-0 \
libcups2 \
libxcomposite1 \
libxrandr2 \
libgbm1 \
libasound2 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libgtk-3-0 \
&& rm -rf /var/lib/apt/lists/*

# 環境変数の設定
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# requirements.txt をコピーして依存ライブラリをインストール
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# Playwright のブラウザバイナリと依存ライブラリをインストール
RUN playwright install --with-deps

# Cloud Functions（Gen2）ではポート8080でリッスンするのが一般的
EXPOSE 8080

# Flask アプリを gunicorn で起動
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]