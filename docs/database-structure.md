# 新しいデータベース構造

## コレクション構造

### users

- Collection: `users`
- Document ID: `uid`（Firebase Auth のユーザー ID）
- Fields:
  - email: string
  - createdAt: timestamp
  - updatedAt: timestamp

### cards (サブコレクション)

- Collection: `users/{uid}/cards`
- Document ID: 自動生成
- Fields:
  - ImageURL: string（名刺画像の URL）
  - createdAt: timestamp（スキャン日時）
  - companyName: string（会社名の簡易情報）
  - personName: string（担当者名）
  - personEmail: string?（任意）
  - personPhoneNumber: string?（任意）
  - role: string?（任意）

### companies (サブコレクション)

- Collection: `users/{uid}/companies`
- Document ID: 自動生成
- Fields:
  - name: string（会社名）
  - domain: string（ドメイン名）
  - overview: string（会社概要）
  - employeeCount: string?（従業員数、任意）
  - sales: string?（売上高、任意）
  - businessActivities: string[]?（事業内容、任意）
  - headOfficeAddress: string?（本社所在地、任意）
  - capital: string?（資本金、任意）
  - established: string?（設立年月日、任意）
  - headOfficeAddress: string?（本社所在地、任意）
  - capital: string?（資本金、任意）
  - established: string?（設立年月日、任意）

## セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザードキュメントのルール
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;

      // 名刺サブコレクションのルール
      match /cards/{cardId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }

      // 企業情報サブコレクションのルール
      match /companies/{companyId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 移行計画

1. 新しいコレクション構造の作成
2. 既存データの移行スクリプトの作成
3. セキュリティルールの更新
4. アプリケーションコードの更新
   - ユーザー管理機能の実装
   - 名刺スキャン・保存機能の更新
   - 企業情報クローリング機能の更新
   - UI/UX の更新

## 注意点

- 既存のデータ移行時にはデータの整合性を保つ
- ユーザーごとのデータ分離を確実に行う
- クローリングデータの更新頻度を適切に設定
- 画像ストレージのパス構造も合わせて更新
