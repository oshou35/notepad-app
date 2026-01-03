# Playwright 初心者向けガイド

このドキュメントは、Playwrightを初めて使う方向けに、テストの実装方法、デバッグ方法、実施方法を詳しく説明します。

## 目次

1. [Playwrightとは](#playwrightとは)
2. [画面操作録画によるテスト実装方法](#画面操作録画によるテスト実装方法)
3. [テストの実施方法](#テストの実施方法)
4. [デバッグ方法](#デバッグ方法)
5. [よく使う操作の例](#よく使う操作の例)
6. [トラブルシューティング](#トラブルシューティング)

---

## Playwrightとは

**Playwright**は、ブラウザを自動操作してWebアプリケーションをテストするためのツールです。人間が手動で行う操作（クリック、入力、スクロールなど）を自動化できます。

### 主な特徴

- ✅ **複数のブラウザ対応**: Chrome、Firefox、Safari（WebKit）でテスト可能
- ✅ **自動操作の記録**: 実際の操作を記録してテストコードを自動生成
- ✅ **高速実行**: 複数のテストを並列実行可能
- ✅ **視覚的なデバッグ**: UIモードでテストの動作を確認可能
- ✅ **スクリーンショット・動画**: テスト実行時の画面を記録

---

## 画面操作録画によるテスト実装方法

Playwrightの最も簡単なテスト作成方法は、**Codegen（コード生成）**機能を使うことです。実際にブラウザで操作するだけで、その操作をテストコードに変換してくれます。

### ステップ1: Codegenを起動

ターミナルで以下のコマンドを実行します：

```bash
npx playwright codegen http://localhost:5173
```

このコマンドを実行すると：
1. ブラウザが自動的に開きます
2. 左側に「Playwright Inspector」というパネルが表示されます
3. このパネルに、あなたの操作が自動的にコードとして記録されます

### ステップ2: アプリを操作する

ブラウザが開いたら、通常通りアプリを操作してください：

- ボタンをクリック
- テキストを入力
- リンクをクリック
- スクロール

**すべての操作が自動的にコードとして記録されます！**

### ステップ3: 生成されたコードを確認

Playwright Inspectorのパネルには、以下のようなコードが表示されます：

```javascript
// ボタンをクリック
await page.click('button.new-note-btn');

// テキストを入力
await page.fill('.note-title-input', 'テストメモ');

// 要素を待機
await page.waitForSelector('.note-item');
```

### ステップ4: コードをコピーしてテストファイルに保存

1. Playwright Inspectorのパネルで「Copy」ボタンをクリック
2. コピーしたコードを新しいテストファイル（例: `tests/my-test.mjs`）に貼り付け
3. 必要に応じて、コードを編集・カスタマイズ

### ステップ5: テストファイルの作成

このプロジェクトでは、**Playwright Test形式**を使用します。生成されたコードを以下の形式で保存してください：

```javascript
// tests/my-test.spec.mjs

// Playwright Testのtest関数とexpectをインポート
import { test, expect } from '@playwright/test';

// test()関数を使ってテストを定義
test('メモを作成する', async ({ page }) => {
  // アプリにアクセス（baseURLが設定されているため、'/'だけでOK）
  await page.goto('/');
  
  // Codegenで記録した操作をここに貼り付け
  await page.click('button.new-note-btn');
  await page.fill('.note-title-input', 'テストメモ');
  
  // アサーション（期待値の確認）
  const title = await page.inputValue('.note-title-input');
  expect(title).toBe('テストメモ');
});
```

**この形式の利点：**
- ✅ UIモード（`npm run test:ui`）で実行・デバッグ可能
- ✅ テストランナーの機能を利用可能
- ✅ 並列実行、レポート生成などが自動
- ✅ アサーション（`expect()`）による検証が簡単

**ファイル名の規則：**
- `*.spec.mjs` または `*.test.mjs` の形式で保存
- 例: `my-test.spec.mjs`、`note-creation.test.mjs`

### ステップ6: テストを実行

保存したテストファイルを実行します：

```bash
# すべてのテストを実行
npm run test

# UIモードで実行（推奨）
npm run test:ui

# 特定のテストファイルのみ実行
npx playwright test tests/my-test.spec.mjs
```

**注意**: 開発サーバーは自動的に起動します（`playwright.config.js`の`webServer`設定により）。手動で起動する必要はありません。

---

## テストの実施方法

### ✅ テストファイルの形式について

このプロジェクトのテストファイルは、**すべてPlaywright Test形式**（`*.spec.mjs`）に統一されています。

**Playwright Test形式の特徴：**
- ✅ `test()`関数を使用
- ✅ `npm run test:ui`でUIモードで実行可能
- ✅ テストランナーの機能（並列実行、レポート、デバッグなど）を利用可能
- ✅ アサーション（`expect()`）による検証が簡単

**テストファイル一覧：**
- `tests/console-test.spec.mjs` - コンソールログ監視テスト
- `tests/debug-test.spec.mjs` - デバッグ用テスト
- `tests/final-test.spec.mjs` - 包括的な機能テスト
- `tests/screenshot-test.spec.mjs` - スクリーンショット取得テスト
- `tests/test-app.spec.mjs` - 基本的なアプリテスト
- `tests/wait-test.spec.mjs` - 待機処理のテスト

### 方法1: 基本的なテスト実行

最もシンプルな方法です。ターミナルで以下のコマンドを実行：

```bash
npm run test
```

**このコマンドの動作：**
1. 開発サーバー（`npm run dev`）が自動的に起動
2. すべてのテストファイルが実行される
3. テスト結果がターミナルに表示される
4. テスト完了後、開発サーバーが自動停止

### 方法2: UIモードでテスト実行（初心者におすすめ！）

視覚的にテストの動作を確認できます：

```bash
npm run test:ui
```

**UIモードの特徴：**
- 🎯 テストの実行状況をリアルタイムで確認
- 📊 テスト結果を視覚的に表示
- 🔍 失敗したテストの詳細を確認
- ▶️ 個別のテストを再実行可能
- 📸 スクリーンショットを確認

**使い方：**
1. コマンドを実行すると、ブラウザが自動的に開きます
2. 左側にテスト一覧、右側にテストの詳細が表示されます
3. テストをクリックすると、実行ログやスクリーンショットを確認できます
4. 「Run」ボタンで個別のテストを再実行できます

**注意**: このプロジェクトのテストファイルはすべてPlaywright Test形式（`*.spec.mjs`）のため、UIモードですべてのテストが表示されます。

### 方法3: ブラウザを表示してテスト実行

テスト実行時にブラウザが表示されるため、動作を目視で確認できます：

```bash
npm run test:headed
```

**使用場面：**
- テストがどのように動作しているか確認したい
- デバッグ時にブラウザの動作を見たい
- テストの動作を理解したい

### 方法4: デバッグモードでテスト実行

Playwright Inspectorを使って、ステップごとにテストを実行・デバッグ：

```bash
npm run test:debug
```

**デバッグモードの特徴：**
- ⏸️ テストを一時停止して確認
- 👆 次のステップに進むボタン
- 🔍 ページの状態を確認
- 📝 コンソールログを確認

**使い方：**
1. コマンドを実行すると、Playwright Inspectorが開きます
2. 「Step over」ボタンで1ステップずつ実行
3. 「Resume」ボタンで通常の速度で実行
4. 各ステップでページの状態を確認できます

### 方法5: 特定のテストファイルのみ実行

すべてのテストではなく、特定のテストファイルだけを実行したい場合：

```bash
# 特定のテストファイルを実行
npx playwright test tests/final-test.spec.mjs

# 複数のテストファイルを指定
npx playwright test tests/final-test.spec.mjs tests/test-app.spec.mjs
```

### 方法6: 特定のテストを実行（テスト名で指定）

テストファイル内の特定のテストだけを実行したい場合：

```bash
npx playwright test -g "テスト名"
```

---

## デバッグ方法

テストが失敗した場合や、期待通りに動作しない場合のデバッグ方法を説明します。

### デバッグ方法1: コンソールログを確認

テストコードに`console.log()`を追加して、実行状況を確認：

```javascript
console.log('🚀 テスト開始');
await page.goto('http://localhost:5173/');
console.log('✅ ページ読み込み完了');

const button = await page.locator('button.new-note-btn');
console.log('🔍 ボタンが見つかりました:', await button.isVisible());
await button.click();
console.log('✅ ボタンをクリックしました');
```

### デバッグ方法2: スクリーンショットを取得

テストの途中で画面の状態を確認したい場合：

```javascript
// スクリーンショットを取得
await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
console.log('📸 スクリーンショットを保存しました');
```

### デバッグ方法3: ページのHTMLを確認

現在のページのHTMLを確認したい場合：

```javascript
// ページのHTMLを取得
const html = await page.content();
console.log('HTML:', html);

// 特定の要素のHTMLを取得
const elementHtml = await page.locator('.note-item').first().innerHTML();
console.log('要素のHTML:', elementHtml);
```

### デバッグ方法4: 要素の状態を確認

要素が存在するか、表示されているかを確認：

```javascript
// 要素が存在するか確認
const exists = await page.locator('.note-item').count();
console.log('要素の数:', exists);

// 要素が表示されているか確認
const isVisible = await page.locator('button.new-note-btn').isVisible();
console.log('ボタンは表示されていますか:', isVisible);

// 要素のテキストを取得
const text = await page.locator('.note-item h3').first().textContent();
console.log('テキスト:', text);
```

### デバッグ方法5: 待機時間を追加

要素が読み込まれる前に操作しようとして失敗する場合、待機時間を追加：

```javascript
// 要素が表示されるまで待機（最大10秒）
await page.waitForSelector('.note-item', { timeout: 10000 });

// 固定時間待機（1秒）
await page.waitForTimeout(1000);

// 要素がクリック可能になるまで待機
await page.locator('button.new-note-btn').waitFor({ state: 'visible' });
```

### デバッグ方法6: エラー時のスクリーンショット

テストが失敗した場合、自動的にスクリーンショットを取得：

```javascript
try {
  await page.click('button.new-note-btn');
} catch (error) {
  // エラー時にスクリーンショットを取得
  await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  console.error('❌ エラー:', error.message);
  throw error; // エラーを再スロー
}
```

### デバッグ方法7: ブラウザのコンソールログを確認

ブラウザ側のコンソールエラーを確認：

```javascript
// ブラウザのコンソールログを監視
page.on('console', msg => {
  console.log('ブラウザコンソール:', msg.text());
});

// エラーを監視
page.on('pageerror', error => {
  console.error('ページエラー:', error.message);
});
```

### デバッグ方法8: ネットワークリクエストを確認

ページの読み込み時に発生するネットワークリクエストを確認：

```javascript
// ネットワークリクエストを監視
page.on('request', request => {
  console.log('リクエスト:', request.url());
});

page.on('response', response => {
  console.log('レスポンス:', response.url(), response.status());
});
```

---

## よく使う操作の例

Playwrightでよく使う操作の例を紹介します。

### 1. ページにアクセス

```javascript
// 基本的なページアクセス
await page.goto('http://localhost:5173/');

// ページが完全に読み込まれるまで待機
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
```

### 2. 要素をクリック

```javascript
// セレクターでクリック
await page.click('button.new-note-btn');

// Locator APIを使用（推奨）
await page.locator('button.new-note-btn').click();

// 複数の要素がある場合、最初の要素をクリック
await page.locator('.note-item').first().click();

// テキストで要素を探してクリック
await page.getByText('新規メモ').click();
```

### 3. テキストを入力

```javascript
// 入力フィールドにテキストを入力（既存のテキストをクリア）
await page.fill('.note-title-input', 'テストメモ');

// 既存のテキストを保持したまま追加
await page.type('.note-content-input', '追加のテキスト');

// 入力フィールドの値を取得
const value = await page.inputValue('.note-title-input');
console.log('入力値:', value);
```

### 4. 要素のテキストを取得

```javascript
// 要素のテキストを取得
const text = await page.textContent('.note-item h3');
console.log('テキスト:', text);

// すべてのテキスト（子要素を含む）を取得
const allText = await page.locator('.note-item').first().innerText();
console.log('すべてのテキスト:', allText);
```

### 5. 要素の存在確認

```javascript
// 要素が存在するか確認
const count = await page.locator('.note-item').count();
console.log('要素の数:', count);

// 要素が表示されているか確認
const isVisible = await page.locator('button.new-note-btn').isVisible();
console.log('表示されていますか:', isVisible);

// 要素が存在するまで待機
await page.waitForSelector('.note-item', { timeout: 10000 });
```

### 6. ドロップダウンを選択

```javascript
// セレクトボックスでオプションを選択
await page.selectOption('select#category', 'work');
```

### 7. チェックボックス・ラジオボタン

```javascript
// チェックボックスをチェック
await page.check('input[type="checkbox"]');

// チェックボックスのチェックを外す
await page.uncheck('input[type="checkbox"]');

// チェックされているか確認
const isChecked = await page.isChecked('input[type="checkbox"]');
```

### 8. スクロール

```javascript
// ページを下にスクロール
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// 要素までスクロール
await page.locator('.note-item').last().scrollIntoViewIfNeeded();
```

### 9. キーボード操作

```javascript
// Enterキーを押す
await page.press('.note-title-input', 'Enter');

// Tabキーを押す
await page.press('.note-title-input', 'Tab');

// Ctrl+A（全選択）
await page.keyboard.press('Control+a');
```

### 10. スクリーンショット

```javascript
// ページ全体のスクリーンショット
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// 特定の要素のスクリーンショット
await page.locator('.note-item').first().screenshot({ path: 'note-item.png' });
```

### 11. LocalStorageの操作

```javascript
// LocalStorageの値を取得
const notes = await page.evaluate(() => {
  return localStorage.getItem('notes');
});
console.log('LocalStorage:', notes);

// LocalStorageに値を設定
await page.evaluate(() => {
  localStorage.setItem('notes', JSON.stringify([{ id: '1', title: 'テスト' }]));
});

// LocalStorageをクリア
await page.evaluate(() => {
  localStorage.clear();
});
```

### 12. ページのリロード

```javascript
// ページをリロード
await page.reload();

// リロード後に要素が表示されるまで待機
await page.reload();
await page.waitForSelector('.app', { timeout: 10000 });
```

### 13. 複数の要素を処理

```javascript
// すべての要素を取得して処理
const noteItems = await page.locator('.note-item').all();
for (const item of noteItems) {
  const title = await item.locator('h3').textContent();
  console.log('メモタイトル:', title);
}

// 要素の数を取得
const count = await page.locator('.note-item').count();
console.log('メモの数:', count);
```

---

## トラブルシューティング

よくある問題とその解決方法を説明します。

### 問題1: 要素が見つからない（Element not found）

**エラーメッセージ：**
```
Error: locator.click: Timeout 10000ms exceeded
```

**原因：**
- 要素がまだ読み込まれていない
- セレクターが間違っている
- 要素が非表示になっている

**解決方法：**

```javascript
// 1. 要素が表示されるまで待機
await page.waitForSelector('button.new-note-btn', { timeout: 10000 });

// 2. より具体的なセレクターを使用
// 悪い例: await page.click('button');
// 良い例: await page.click('button.new-note-btn');

// 3. Locator APIを使用して、より確実に要素を取得
await page.locator('button.new-note-btn').waitFor({ state: 'visible' });
await page.locator('button.new-note-btn').click();
```

### 問題2: タイムアウトエラー

**エラーメッセージ：**
```
Timeout 30000ms exceeded
```

**原因：**
- ページの読み込みが遅い
- ネットワークが遅い
- 要素が表示されるまで時間がかかる

**解決方法：**

```javascript
// 1. タイムアウト時間を延長
await page.goto('http://localhost:5173/', { timeout: 60000 });

// 2. waitUntilオプションを使用
await page.goto('http://localhost:5173/', { 
  waitUntil: 'networkidle',
  timeout: 60000 
});

// 3. 要素が表示されるまで明示的に待機
await page.waitForSelector('.app', { timeout: 30000 });
```

### 問題3: 開発サーバーが起動していない

**エラーメッセージ：**
```
net::ERR_CONNECTION_REFUSED
```

**原因：**
- 開発サーバー（`npm run dev`）が起動していない

**解決方法：**

```bash
# 別のターミナルで開発サーバーを起動
npm run dev

# または、playwright.config.jsのwebServer設定を使用
# （自動的にサーバーが起動します）
npm run test
```

### 問題4: ブラウザがインストールされていない

**エラーメッセージ：**
```
Executable doesn't exist
```

**原因：**
- Playwrightのブラウザがインストールされていない

**解決方法：**

```bash
# ブラウザをインストール
npx playwright install

# 特定のブラウザのみインストール
npx playwright install chromium
```

### 問題5: テストが不安定（時々失敗する）

**原因：**
- タイミングの問題
- 非同期処理の待機が不十分

**解決方法：**

```javascript
// 1. 固定の待機時間を追加（最後の手段）
await page.waitForTimeout(1000);

// 2. 要素の状態を確認してから操作（推奨）
await page.locator('button.new-note-btn').waitFor({ state: 'visible' });
await page.locator('button.new-note-btn').click();

// 3. ネットワークがアイドル状態になるまで待機
await page.waitForLoadState('networkidle');
```

### 問題6: スクリーンショットが保存されない

**原因：**
- パスの指定が間違っている
- ディレクトリが存在しない

**解決方法：**

```javascript
// 絶対パスまたは相対パスを正しく指定
await page.screenshot({ 
  path: 'docs/screenshot.png',  // ディレクトリが存在することを確認
  fullPage: true 
});
```

### 問題7: テストが並列実行で失敗する

**原因：**
- 複数のテストが同じリソースにアクセスしている
- テスト間でデータが干渉している

**解決方法：**

```javascript
// playwright.config.jsで並列実行を無効化
export default defineConfig({
  fullyParallel: false,  // 並列実行を無効化
  workers: 1,  // ワーカー数を1に設定
});
```

---

## まとめ

このガイドでは、以下の内容を説明しました：

1. ✅ **Codegenを使ったテスト作成**: 実際の操作を記録してテストコードを自動生成
2. ✅ **テストの実行方法**: 複数の実行方法とそれぞれの特徴
3. ✅ **デバッグ方法**: テストの問題を特定・解決する方法
4. ✅ **よく使う操作**: 実用的なコード例
5. ✅ **トラブルシューティング**: よくある問題と解決方法

### 次のステップ

- 実際にCodegenを使ってテストを作成してみましょう
- UIモード（`npm run test:ui`）でテストを実行して、動作を確認しましょう
- 既存のテストファイル（`tests/final-test.spec.mjs`など）を参考に、新しいテストを作成しましょう

### 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**質問や問題がある場合は、このドキュメントを参照するか、テストファイルのコメントを確認してください！**

