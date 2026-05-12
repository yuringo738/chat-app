# Chat App

Next.js + Firebase を使ったリアルタイムチャットアプリです。sub-userが複数のユーザーのチャットルームを管理し、メンション機能でメッセージを送信できます。

---

## 技術スタック

- **フロントエンド**: Next.js (App Router) / TypeScript / Tailwind CSS
- **バックエンド**: Firebase (Firestore / Authentication)
- **認証**: Google ログイン（Firebase Auth）

---

## 機能

- Googleアカウントでのログイン・ログアウト
- ユーザー一覧の表示（自分自身は除外）
- ユーザーを選択してDMチャット
- `@ユーザー名` でのメンション送信
- メンション相手のDMルームにも自動でメッセージを届ける
- LINE風の吹き出しUI（送信：緑、受信：白）
- 送信者のアイコンと名前を表示
- メッセージの自動スクロール

---

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd chat-app
```

### 2. パッケージのインストール

```bash
npm install
```

### 3. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication → Google ログインを有効化
3. Firestore Database を作成
4. プロジェクトの設定から Firebase の設定情報を取得

### 4. 環境変数の設定

`.env.local` を作成して以下を設定：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. アイコン画像の配置

`public/icons/` フォルダにユーザーアイコン画像を配置してください。

```
public/
└── icons/
    ├── hana.png
    ├── moon.jpg
    ├── glass.jpg
    └── ts.png
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## Firestore データ構造

```
users/
  {uid}/
    name: string
    email: string
    iconURL: string
    createdAt: Timestamp

dmRooms/
  {uid1}_{uid2}/          # 2人のuidをソートして結合
    messages/
      {messageId}/
        text: string
        from: string      # 送信者のuid
        to: string[]      # 受信者のuid配列
        createdAt: Timestamp
```

---

## ディレクトリ構成

```
src/
├── app/
│   └── chat/
│       └── page.tsx
├── components/
│   ├── Auth/
│   │   └── LoginButton.tsx
│   ├── AuthView.tsx
│   └── Chat/
│       ├── ChatRoom.tsx
│       ├── DMView.tsx
│       ├── MessageInput.tsx
│       └── Sidebar.tsx
├── hooks/
│   └── useAuth.ts
└── lib/
    └── firebase.ts
```

---

## 使い方

1. Googleアカウントでログイン
2. 左のユーザー一覧からチャット相手を選択
3. メッセージを入力して送信
4. `@ユーザー名` でメンション → そのユーザーのDMルームにもメッセージが届く

---

## 注意事項

- ユーザーのアイコン画像は `public/icons/` に手動で配置する必要があります
- Firestoreの `users` コレクションに `name` と `iconURL` が登録されていないとアイコンが表示されません
- 新規ログイン時、`displayName` が空の場合は Firestore の既存データを上書きしません