/**
 * Playwright設定ファイル
 * 
 * このファイルは、PlaywrightのE2Eテスト実行時の設定を管理します。
 * テストの実行環境、ブラウザ設定、タイムアウト、テストファイルの場所などを定義します。
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwrightの設定をエクスポート
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストファイルが配置されているディレクトリ
  testDir: './tests',
  
  // テストファイルのパターン（.mjsファイルも含める）
  // Playwright Test形式（test()関数を使う）のファイルを探します
  testMatch: /.*\.(test|spec)\.(js|ts|mjs)/,
  
  // テストの実行モード（並列実行の設定）
  // 'parallel' は複数のテストを同時に実行します
  fullyParallel: true,
  
  // CI環境でテストが失敗した場合、再実行を無効化
  forbidOnly: !!process.env.CI,
  
  // CI環境では失敗したテストを再試行しない
  retries: process.env.CI ? 2 : 0,
  
  // テスト実行時のワーカー数（同時実行数）
  workers: process.env.CI ? 1 : undefined,
  
  // テストのレポート設定
  reporter: 'html',
  
  // テスト実行に使用するブラウザとデバイスの設定
  use: {
    // テスト実行時のベースURL（開発サーバーのURL）
    baseURL: 'http://localhost:5173',
    
    // テスト実行時のタイムアウト設定（ミリ秒）
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // テスト失敗時のスクリーンショットとトレースの保存
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // テストプロジェクトの設定（複数のブラウザでテストを実行可能）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 必要に応じて他のブラウザも追加可能
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // 開発サーバーの起動設定（テスト実行前に自動的にサーバーを起動）
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    // サーバーが起動するまで待機する時間
    timeout: 120 * 1000,
  },
});

