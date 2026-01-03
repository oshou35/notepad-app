/**
 * アプリの基本機能テスト
 * 
 * このテストは、メモアプリの主要な機能をテストします：
 * - メモの作成
 * - メモの編集
 * - メモの選択
 * - メモの削除
 * - LocalStorageによる永続化
 * - リロード後の復元
 */

import { test, expect } from '@playwright/test';

test.describe('メモアプリの基本機能', () => {
  test('メモの作成、編集、選択、削除、永続化をテスト', async ({ page }) => {
    console.log('Starting browser test...');

    // 1. アプリにアクセス
    console.log('1. Navigating to app...');
    await page.goto('/');
    await page.waitForTimeout(1000);
    console.log('✓ App loaded successfully');

    // 2. テスト: 最初のメモを作成
    console.log('\n2. Testing note creation...');
    const newNoteButton = await page.waitForSelector('button.new-note-btn', { timeout: 5000 });
    await newNoteButton.click();
    await page.waitForTimeout(500);
    console.log('✓ New note created');

    // 3. テスト: メモを編集
    console.log('\n3. Testing note editing...');
    await page.fill('.note-title-input', 'テストメモ1');
    await page.waitForTimeout(300);
    await page.fill('.note-content-input', 'これはテストメモの内容です。');
    await page.waitForTimeout(500);
    console.log('✓ Note edited successfully');

    // タイトルが正しく入力されたことを確認
    const title1 = await page.inputValue('.note-title-input');
    expect(title1).toBe('テストメモ1');

    // 4. テスト: 2番目のメモを作成
    console.log('\n4. Creating second note...');
    await page.click('button.new-note-btn');
    await page.waitForTimeout(500);
    await page.fill('.note-title-input', 'テストメモ2');
    await page.fill('.note-content-input', '2番目のメモです。');
    await page.waitForTimeout(500);
    console.log('✓ Second note created');

    // 5. テスト: メモの選択
    console.log('\n5. Testing note selection...');
    const firstNote = page.locator('.note-item').first();
    await firstNote.click();
    await page.waitForTimeout(500);
    const titleValue = await page.inputValue('.note-title-input');
    expect(titleValue).toBe('テストメモ2');
    console.log(`✓ Selected note title: "${titleValue}"`);

    // 6. テスト: メモの数を確認
    const noteCount = await page.locator('.note-item').count();
    expect(noteCount).toBe(2);
    console.log(`✓ Total notes: ${noteCount}`);

    // 7. テスト: メモの削除
    console.log('\n6. Testing note deletion...');
    const deleteBtn = page.locator('.note-item').first().locator('.delete-btn');
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const remainingNotes = await page.locator('.note-item').count();
    expect(remainingNotes).toBe(1);
    console.log(`✓ Note deleted. Remaining notes: ${remainingNotes}`);

    // 8. テスト: LocalStorageの永続化を確認
    console.log('\n7. Testing data persistence...');
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('notes');
    });
    const notes = JSON.parse(storageData);
    expect(notes.length).toBe(1);
    expect(notes[0].title).toBe('テストメモ1');
    console.log(`✓ LocalStorage contains ${notes.length} note(s)`);
    console.log(`✓ Note data persisted: ${notes[0]?.title || 'No title'}`);

    // 9. テスト: リロード後の永続化を確認
    console.log('\n8. Testing reload persistence...');
    await page.reload();
    await page.waitForTimeout(1000);
    const notesAfterReload = await page.locator('.note-item').count();
    expect(notesAfterReload).toBe(1);
    console.log(`✓ After reload: ${notesAfterReload} note(s) restored`);

    console.log('\n✅ All tests passed successfully!');
  });
});

