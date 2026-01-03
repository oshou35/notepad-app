# Notepad App

シンプルで使いやすいメモ帳アプリケーションです。React + TypeScript + Viteで構築されています。

## 主な機能

- ✏️ メモの作成・編集・削除
- 💾 LocalStorageによる自動保存
- 📱 シンプルで直感的なUI
- 🔄 更新日時による自動ソート

## 技術スタック

- **React** 19.1.1 - UIライブラリ
- **TypeScript** 5.9.3 - 型安全性
- **Vite** 7.1.7 - 高速ビルドツール
- **Playwright** 1.55.1 - E2Eテスト

## 起動方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### 3. 本番ビルド

```bash
npm run build
```

### 4. ビルドしたアプリのプレビュー

```bash
npm run preview
```

### 5. コードのリント

```bash
npm run lint
```

## テスト実施方法

このプロジェクトでは、Playwrightを使用したE2E（End-to-End）テストを実行できます。

> 📚 **初心者の方へ**: Playwrightの詳しい使い方（画面操作録画によるテスト実装、デバッグ方法など）は、[Playwright初心者向けガイド](./docs/playwright-guide.md)を参照してください。

### 1. Playwrightのセットアップ

初回のみ、以下のコマンドでPlaywrightのブラウザをインストールしてください：

```bash
npx playwright install
```

### 2. テストの実行

#### 基本的なテスト実行

```bash
npm run test
```

このコマンドを実行すると、以下の処理が自動的に行われます：
- 開発サーバー（`npm run dev`）が自動的に起動
- テストが実行される
- テスト完了後、開発サーバーが自動的に停止

#### UIモードでテスト実行（推奨）

```bash
npm run test:ui
```

視覚的なUIでテストを実行・デバッグできます。テストの実行状況をリアルタイムで確認でき、失敗したテストの詳細も確認しやすくなります。

#### ヘッドレスモードを無効化（ブラウザを表示）

```bash
npm run test:headed
```

テスト実行時にブラウザが表示されるため、テストの動作を目視で確認できます。

#### デバッグモードでテスト実行

```bash
npm run test:debug
```

Playwright Inspectorが起動し、ステップごとにテストを実行・デバッグできます。

### 3. テストファイルの場所

テストファイルは `tests/` ディレクトリに配置されています（すべてPlaywright Test形式）：

- `final-test.spec.mjs` - 包括的な機能テスト（メモ作成、編集、削除、永続化など）
- `wait-test.spec.mjs` - 待機処理のテスト
- `console-test.spec.mjs` - コンソール出力のテスト
- `debug-test.spec.mjs` - デバッグ用テスト
- `screenshot-test.spec.mjs` - スクリーンショット取得のテスト
- `test-app.spec.mjs` - 基本的なアプリテスト

### 4. テストレポート

テスト実行後、HTMLレポートが自動的に生成されます。レポートを確認するには：

```bash
npx playwright show-report
```

### 5. テスト設定

テストの設定は `playwright.config.js` で管理されています。主な設定内容：

- **テストディレクトリ**: `./tests`
- **ベースURL**: `http://localhost:5173`
- **ブラウザ**: Chromium（デフォルト）
- **タイムアウト**: アクション10秒、ナビゲーション30秒
- **自動サーバー起動**: テスト実行時に開発サーバーを自動起動

### 注意事項

- テスト実行前に開発サーバーが起動している必要はありません（自動起動されます）
- テスト実行中は開発サーバーのポート（5173）が使用されるため、手動で起動している場合は停止してください
- 初回のテスト実行時は、Playwrightのブラウザインストールに時間がかかる場合があります

## フォルダ構成

```
notepad-app/
├── docs/                       # ドキュメント・スクリーンショット
│   ├── app-working.png
│   ├── debug-screenshot.png
│   └── test-complete.png
│
├── src/
│   ├── components/             # UIコンポーネント
│   │   ├── NoteEditor.tsx      # メモ編集エディター
│   │   └── NoteList.tsx        # メモ一覧表示
│   │
│   ├── hooks/                  # カスタムフック
│   │   └── useLocalStorage.ts  # LocalStorage管理フック
│   │
│   ├── styles/                 # スタイルシート
│   │   ├── App.css             # アプリ全体のスタイル
│   │   └── index.css           # グローバルスタイル
│   │
│   ├── types/                  # TypeScript型定義
│   │   └── index.ts            # Note型など
│   │
│   ├── App.tsx                 # メインアプリケーション
│   └── main.tsx                # エントリーポイント
│
├── tests/                      # テストファイル（Playwright Test形式）
│   ├── console-test.spec.mjs
│   ├── debug-test.spec.mjs
│   ├── final-test.spec.mjs
│   ├── screenshot-test.spec.mjs
│   ├── test-app.spec.mjs
│   └── wait-test.spec.mjs
│
├── index.html                  # HTMLテンプレート
├── package.json                # 依存関係とスクリプト
├── tsconfig.json               # TypeScript設定
├── vite.config.ts              # Vite設定
└── eslint.config.js            # ESLint設定
```

## データ構造

メモは以下の型で管理されています：

```typescript
interface Note {
  id: string;          // 一意の識別子
  title: string;       // メモのタイトル
  content: string;     // メモの本文
  createdAt: number;   // 作成日時（タイムスタンプ）
  updatedAt: number;   // 更新日時（タイムスタンプ）
}
```

## 使い方

1. **新規メモ作成**: 左側の「+ 新規メモ」ボタンをクリック
2. **メモ編集**: メモを選択してタイトルと本文を入力
3. **メモ削除**: 各メモの「×」ボタンをクリック
4. **自動保存**: 編集内容は自動的にLocalStorageに保存されます

## 注意事項

- LocalStorageを使用しているため、ブラウザのプライベートモードでは毎回データがリセットされます
- メモは更新日時の新しい順に自動的にソートされます

## React + Vite について

このプロジェクトは Vite を使用した React テンプレートから作成されています。

### 利用可能な公式プラグイン

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Babel を使用した Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - SWC を使用した Fast Refresh

### ESLint設定の拡張

本番アプリケーションを開発する場合は、型を考慮したlintルールを有効にすることを推奨します：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // または、より厳格なルールの場合
      tseslint.configs.strictTypeChecked,
      // スタイルルールを追加する場合
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## ライセンス

Private
