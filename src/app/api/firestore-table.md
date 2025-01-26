# Firestore のテーブル設計図

このプロジェクトでは、Firestore のデータベースに以下のテーブルを作成しています。

## `trade_shows` (展示会)

| フィールド    | 型                         | 説明                         |
| ------------- | -------------------------- | ---------------------------- |
| **name**      | string                     | 展示会名                     |
| **startDate** | timestamp                  | 開催開始日/時                |
| **endDate**   | timestamp                  | 開催終了日/時                |
| **location**  | string                     | 開催場所                     |
| **createdBy** | string / DocumentReference | 登録ユーザー ID (オプション) |
| **createdAt** | timestamp                  | 登録日時                     |
| **updatedAt** | timestamp                  | 更新日時                     |

---

## `companies` (企業)

| フィールド      | 型        | 説明             |
| --------------- | --------- | ---------------- |
| **name**        | string    | 企業名           |
| **websiteURL**  | string    | 企業サイト URL   |
| **address**     | string    | 住所             |
| **phone**       | string    | 代表電話番号     |
| **description** | string    | 企業概要や紹介文 |
| **createdAt**   | timestamp | 登録日時         |
| **updatedAt**   | timestamp | 更新日時         |

---

## `business_cards` (名刺)

| フィールド                   | 型                         | 説明                                     |
| ---------------------------- | -------------------------- | ---------------------------------------- |
| **userId** (オプション)      | string / DocumentReference | 登録したユーザー ID                      |
| **tradeShowId** (オプション) | string / DocumentReference | どの展示会で得た名刺か                   |
| **companyId** (オプション)   | string / DocumentReference | どの企業に紐づく名刺か                   |
| **personName**               | string                     | 名刺の個人名                             |
| **personEmail**              | string                     | 個人のメールアドレス（挨拶メール送信先） |
| **personPhoneNumber**        | string                     | 電話番号                                 |
| **websiteURL** (任意)        | string                     | 名刺に記載の個人/企業サイト URL          |
| **position** (任意)          | string                     | 役職/肩書き                              |
| **memo** (任意)              | string                     | メモ欄                                   |
| **createdAt**                | timestamp                  | 登録日時                                 |
| **updatedAt**                | timestamp                  | 更新日時                                 |

---

## `users` (ユーザー)

| フィールド      | 型        | 説明                   |
| --------------- | --------- | ---------------------- |
| **displayName** | string    | 表示名                 |
| **email**       | string    | メールアドレス         |
| **photoURL**    | string    | プロフィール画像の URL |
| **createdAt**   | timestamp | 登録日時               |
| **updatedAt**   | timestamp | 更新日時               |

---

## `email_drafts` (メール下書き)

| フィールド              | 型                         | 説明                                                                 |
| ----------------------- | -------------------------- | -------------------------------------------------------------------- |
| **userId**              | string / DocumentReference | 下書きを作成したユーザー ID                                          |
| **subject**             | string                     | メール件名 (テンプレートまたは下書きのタイトル)                      |
| **body**                | string                     | メール本文 (テンプレート本文)                                        |
| **placeholders** (任意) | object / array             | `{companyName}`, `{personName}` など差し込みに使うプレースホルダ管理 |
| **createdAt**           | timestamp                  | 下書き作成日時                                                       |
| **updatedAt**           | timestamp                  | 更新日時                                                             |

---

## `email_logs` (メール送信履歴)

| フィールド         | 型                         | 説明                                                |
| ------------------ | -------------------------- | --------------------------------------------------- |
| **businessCardId** | string / DocumentReference | どの名刺宛てに送ったメールか                        |
| **toEmail**        | string                     | 送信先メールアドレス                                |
| **mailSubject**    | string                     | 送信時のメール件名                                  |
| **mailBody**       | string                     | 送信時のメール本文 (プレースホルダが展開された状態) |
| **sentAt**         | timestamp                  | 実際にメールを送信した日時                          |
| **status** (任意)  | string                     | 送信状況 (成功/失敗 等)                             |
