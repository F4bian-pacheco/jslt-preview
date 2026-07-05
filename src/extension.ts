import * as vscode from 'vscode';
import * as path from 'path';
import { JsltApiService } from './services/JsltApiService';
import { JsltExplorerProvider } from './providers/JsltExplorerProvider';
import { JsltPreviewPanel } from './panels/JsltPreviewPanel';

let apiService: JsltApiService;
let explorerProvider: JsltExplorerProvider;
let fileWatcher: vscode.FileSystemWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Activando extensión JSLT Preview...');

  // Inicializar servicios
  apiService = new JsltApiService();

  // Inicializar explorador de archivos
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  explorerProvider = new JsltExplorerProvider(workspaceRoot);

  const treeView = vscode.window.createTreeView('jsltExplorer', {
    treeDataProvider: explorerProvider,
    showCollapseAll: true
  });

  // Comando: Transformar JSON con JSLT (desde archivo JSON)
  const transformWithJsltCommand = vscode.commands.registerCommand('jslt-preview.transformWithJslt', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.uri.fsPath.endsWith('.json')) {
      vscode.window.showErrorMessage('Por favor, abre un archivo JSON primero');
      return;
    }

    const jsonPath = editor.document.uri.fsPath;

    // Preguntar si quiere abrir un JSLT existente o crear uno nuevo
    const option = await vscode.window.showQuickPick(
      [
        { label: '$(file-code) Abrir archivo JSLT existente', value: 'open' },
        { label: '$(new-file) Crear nuevo archivo JSLT', value: 'create' }
      ],
      { placeHolder: 'Selecciona una opción' }
    );

    if (!option) {
      return;
    }

    let jsltPath: string;

    if (option.value === 'open') {
      // Abrir archivo existente
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { 'JSLT': ['jslt'] },
        openLabel: 'Seleccionar JSLT'
      });

      if (!uris || !uris[0]) {
        return;
      }
      jsltPath = uris[0].fsPath;
    } else {
      // Crear nuevo archivo
      const uri = await vscode.window.showSaveDialog({
        filters: { 'JSLT': ['jslt'] },
        saveLabel: 'Crear archivo JSLT'
      });

      if (!uri) {
        return;
      }

      jsltPath = uri.fsPath;

      // Crear archivo con un template que ejercita sintaxis JSLT reciente
      const templateContent = `// JSLT de ejemplo para probar features modernas
// - Array slicing: .orders[1:3] y .orders[:-1]
// - Negative indexing: .orders[-1]
// - Object for expressions: {for (.orders) .id : .product}

{
  "ordersSlice": .orders[1:3],
  "ordersWithoutLast": .orders[:-1],
  "lastOrder": .orders[-1],
  "ordersById": {for (.orders) .id : .product}
}`;
      await vscode.workspace.fs.writeFile(uri, Buffer.from(templateContent, 'utf8'));
    }

    // Abrir el archivo JSLT en el editor
    const doc = await vscode.workspace.openTextDocument(jsltPath);
    await vscode.window.showTextDocument(doc);

    // Crear el preview con el contexto JSON
    JsltPreviewPanel.createOrShow(context.extensionUri, apiService, jsonPath);
    await JsltPreviewPanel.currentPanel?.setJsltFile(jsltPath);
  });

  // Comando: Abrir Preview desde archivo JSLT
  const openPreviewCommand = vscode.commands.registerCommand('jslt-preview.openPreview', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.uri.fsPath.endsWith('.jslt')) {
      vscode.window.showErrorMessage('Por favor, abre un archivo JSLT primero');
      return;
    }

    const jsltPath = editor.document.uri.fsPath;

    // Verificar si ya hay un JSON de contexto asociado
    const contextJson = JsltPreviewPanel.currentPanel?.getContextJsonPath();

    if (!contextJson) {
      // Preguntar por el JSON de contexto
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { 'JSON': ['json'] },
        openLabel: 'Seleccionar JSON de contexto'
      });

      if (!uris || !uris[0]) {
        vscode.window.showWarningMessage('Se requiere un JSON de contexto para el preview');
        return;
      }

      JsltPreviewPanel.createOrShow(context.extensionUri, apiService, uris[0].fsPath);
    } else {
      JsltPreviewPanel.createOrShow(context.extensionUri, apiService, contextJson);
    }

    await JsltPreviewPanel.currentPanel?.setJsltFile(jsltPath);
  });

  // Comando: Seleccionar archivo JSON (obsoleto - se mantiene por compatibilidad)
  const selectJsonCommand = vscode.commands.registerCommand('jslt-preview.selectJsonFile', async () => {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSON': ['json'] },
      openLabel: 'Seleccionar JSON de entrada'
    });

    if (uris && uris[0]) {
      // Si hay un panel abierto, cambiar el contexto
      if (JsltPreviewPanel.currentPanel) {
        await JsltPreviewPanel.currentPanel.changeContextJson();
      } else {
        vscode.window.showInformationMessage('Usa el comando "Transformar JSON con JSLT" desde un archivo JSON');
      }
    }
  });

  // Comando: Seleccionar archivo JSLT
  const selectJsltCommand = vscode.commands.registerCommand('jslt-preview.selectJsltFile', async () => {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSLT': ['jslt'] },
      openLabel: 'Seleccionar template JSLT'
    });

    if (uris && uris[0]) {
      if (!JsltPreviewPanel.currentPanel) {
        // Pedir JSON de contexto
        const jsonUris = await vscode.window.showOpenDialog({
          canSelectMany: false,
          filters: { 'JSON': ['json'] },
          openLabel: 'Seleccionar JSON de contexto'
        });

        if (!jsonUris || !jsonUris[0]) {
          vscode.window.showWarningMessage('Se requiere un JSON de contexto');
          return;
        }

        JsltPreviewPanel.createOrShow(context.extensionUri, apiService, jsonUris[0].fsPath);
      }
      await JsltPreviewPanel.currentPanel?.setJsltFile(uris[0].fsPath);
    }
  });

  // Comando: Refrescar explorador
  const refreshExplorerCommand = vscode.commands.registerCommand('jslt-preview.refreshExplorer', () => {
    explorerProvider.refresh();
    vscode.window.showInformationMessage('Explorador JSLT actualizado');
  });

  // Comando: Transformar con archivo actual
  const transformCurrentCommand = vscode.commands.registerCommand('jslt-preview.transformCurrent', async (item) => {
    if (item && item.filePath) {
      if (item.filePath.endsWith('.jslt')) {
        // Abrir el archivo JSLT
        const doc = await vscode.workspace.openTextDocument(item.filePath);
        await vscode.window.showTextDocument(doc);

        // Pedir contexto JSON si no hay panel abierto
        const currentPanel = JsltPreviewPanel.currentPanel;
        if (!currentPanel) {
          const uris = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'JSON': ['json'] },
            openLabel: 'Seleccionar JSON de contexto'
          });

          if (uris && uris[0]) {
            JsltPreviewPanel.createOrShow(context.extensionUri, apiService, uris[0].fsPath);
            const newPanel = JsltPreviewPanel.currentPanel;
            if (newPanel) {
              await newPanel.setJsltFile(item.filePath);
            }
          }
        } else {
          await currentPanel.setJsltFile(item.filePath);
        }
      } else if (item.filePath.endsWith('.json')) {
        // Abrir el archivo JSON y ejecutar el comando transformWithJslt
        const doc = await vscode.workspace.openTextDocument(item.filePath);
        await vscode.window.showTextDocument(doc);
        await vscode.commands.executeCommand('jslt-preview.transformWithJslt');
      }
    }
  });  // Watch para auto-refresh
  const config = vscode.workspace.getConfiguration('jsltPreview');
  if (config.get<boolean>('autoRefresh')) {
    setupFileWatcher(context);
  }

  // Listener para detectar cuando se guarda un archivo JSLT o JSON
  const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const currentPanel = JsltPreviewPanel.currentPanel;
    if (!currentPanel) {
      return;
    }

    if (document.fileName.endsWith('.jslt') && document.fileName === currentPanel.getCurrentJsltPath()) {
      // El archivo JSLT del preview fue guardado, actualizar preview
      await currentPanel.setJsltFile(document.fileName);
    } else if (document.fileName.endsWith('.json') && document.fileName === currentPanel.getContextJsonPath()) {
      // El JSON de contexto fue modificado, actualizar preview
      await currentPanel.refreshTransform();
    }
  });

  // Detectar cambios en la configuración
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('jsltPreview.autoRefresh')) {
      const autoRefresh = vscode.workspace.getConfiguration('jsltPreview').get<boolean>('autoRefresh');
      if (autoRefresh) {
        setupFileWatcher(context);
      } else {
        fileWatcher?.dispose();
        fileWatcher = undefined;
      }
    }
  });

  // Registrar todos los comandos y suscripciones
  context.subscriptions.push(
    transformWithJsltCommand,
    openPreviewCommand,
    selectJsonCommand,
    selectJsltCommand,
    refreshExplorerCommand,
    transformCurrentCommand,
    treeView,
    saveListener,
    configChangeListener
  );

  console.log('✅ Extensión JSLT Preview activada correctamente');
}

function setupFileWatcher(context: vscode.ExtensionContext) {
  if (fileWatcher) {
    fileWatcher.dispose();
  }

  fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.{json,jslt}');

  fileWatcher.onDidChange(uri => {
    explorerProvider.refresh();

    // Si el panel está abierto y el archivo cambió es el que está siendo visualizado
    if (JsltPreviewPanel.currentPanel) {
      const filePath = uri.fsPath;
      if (filePath.endsWith('.jslt') && filePath === JsltPreviewPanel.currentPanel.getCurrentJsltPath()) {
        JsltPreviewPanel.currentPanel.setJsltFile(filePath);
      }
    }
  });

  fileWatcher.onDidCreate(() => explorerProvider.refresh());
  fileWatcher.onDidDelete(() => explorerProvider.refresh());

  context.subscriptions.push(fileWatcher);
}

export function deactivate() {
  fileWatcher?.dispose();
}
