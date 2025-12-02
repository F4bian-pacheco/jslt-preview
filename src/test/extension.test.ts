import * as assert from 'assert';
import * as vscode from 'vscode';
import { JsltApiService } from '../services/JsltApiService';

suite('JSLT Preview Extension Test Suite', () => {
  vscode.window.showInformationMessage('Iniciando tests de JSLT Preview');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('jslt-preview.jslt-preview'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('jslt-preview.jslt-preview');
    await ext?.activate();
    assert.ok(ext?.isActive);
  });

  test('Should register transformWithJslt command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.transformWithJslt'));
  });

  test('Should register openPreview command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.openPreview'));
  });

  test('Should register refreshExplorer command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.refreshExplorer'));
  });

  test('Should register selectJsonFile command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.selectJsonFile'));
  });

  test('Should register selectJsltFile command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.selectJsltFile'));
  });

  test('Should register transformCurrent command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('jslt-preview.transformCurrent'));
  });

  test('Configuration should have default values', () => {
    const config = vscode.workspace.getConfiguration('jsltPreview');
    assert.strictEqual(config.get('apiEndpoint'), 'http://localhost:8000/api/v1/transform');
    assert.strictEqual(config.get('apiTimeout'), 5000);
    assert.strictEqual(config.get('autoRefresh'), true);
  });
});
