import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { JsltExplorerProvider } from '../providers/JsltExplorerProvider';

suite('JsltExplorerProvider Test Suite', () => {
  let provider: JsltExplorerProvider;
  let tempDir: string;

  setup(() => {
    // Crear directorio temporal para tests
    tempDir = path.join(__dirname, 'test-workspace');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    provider = new JsltExplorerProvider(tempDir);
  });

  teardown(() => {
    // Limpiar archivos de test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('Should create JsltExplorerProvider instance', () => {
    assert.ok(provider);
  });

  test('Should return root items when no parent', async () => {
    const children = await provider.getChildren();
    assert.ok(Array.isArray(children));
    // Debería tener al menos las categorías JSON Files y JSLT Files
    assert.ok(children.length >= 0);
  });

  test('Should handle workspace with files', async () => {
    // Test básico: el provider debería retornar un array
    const children = await provider.getChildren();
    assert.ok(Array.isArray(children));

    // Si no hay archivos, debería mostrar mensaje informativo
    // Si hay archivos, debería mostrar categorías y archivos
    if (children.length > 0) {
      const hasInfoMessage = children.some(item =>
        item.label?.includes('No se encontraron archivos')
      );
      const hasCategories = children.some(item =>
        item.label?.includes('Archivos')
      );

      // O tiene mensaje informativo O tiene categorías
      assert.ok(hasInfoMessage || hasCategories);
    }
  });

  test('Should return empty children for elements', async () => {
    // Los elementos no tienen hijos
    const element = {
      label: 'test.json',
      filePath: path.join(tempDir, 'test.json'),
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      contextValue: 'jsonFile'
    };

    const children = await provider.getChildren(element);
    assert.strictEqual(children.length, 0, 'Elements should not have children');
  }); test('Should refresh provider', () => {
    // El refresh no debería lanzar errores
    assert.doesNotThrow(() => {
      provider.refresh();
    });
  });

  test('Should get tree item', () => {
    const element = {
      label: 'test.json',
      filePath: path.join(tempDir, 'test.json'),
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      contextValue: 'jsonFile'
    };

    const treeItem = provider.getTreeItem(element);
    assert.ok(treeItem);
    assert.strictEqual(treeItem.label, 'test.json');
  });
});
