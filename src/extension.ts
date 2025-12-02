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

  // Comando: Abrir Preview
  const openPreviewCommand = vscode.commands.registerCommand('jslt-preview.openPreview', async () => {
    JsltPreviewPanel.createOrShow(context.extensionUri, apiService);

    // Si hay un archivo activo, cargarlo
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const filePath = editor.document.uri.fsPath;
      if (filePath.endsWith('.jslt')) {
        await JsltPreviewPanel.currentPanel?.setJsltFile(filePath);
      } else if (filePath.endsWith('.json')) {
        await JsltPreviewPanel.currentPanel?.setJsonFile(filePath);
      }
    }
  });

  // Comando: Seleccionar archivo JSON
  const selectJsonCommand = vscode.commands.registerCommand('jslt-preview.selectJsonFile', async () => {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSON': ['json'] },
      openLabel: 'Seleccionar JSON de entrada'
    });

    if (uris && uris[0]) {
      if (!JsltPreviewPanel.currentPanel) {
        JsltPreviewPanel.createOrShow(context.extensionUri, apiService);
      }
      await JsltPreviewPanel.currentPanel?.setJsonFile(uris[0].fsPath);
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
        JsltPreviewPanel.createOrShow(context.extensionUri, apiService);
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
    if (!JsltPreviewPanel.currentPanel) {
      JsltPreviewPanel.createOrShow(context.extensionUri, apiService);
    }

    if (item && item.filePath) {
      if (item.filePath.endsWith('.jslt')) {
        await JsltPreviewPanel.currentPanel?.setJsltFile(item.filePath);
      } else if (item.filePath.endsWith('.json')) {
        await JsltPreviewPanel.currentPanel?.setJsonFile(item.filePath);
      }
    }
  });

  // Watch para auto-refresh
  const config = vscode.workspace.getConfiguration('jsltPreview');
  if (config.get<boolean>('autoRefresh')) {
    setupFileWatcher(context);
  }

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
    openPreviewCommand,
    selectJsonCommand,
    selectJsltCommand,
    refreshExplorerCommand,
    transformCurrentCommand,
    treeView,
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
      if (filePath.endsWith('.json')) {
        JsltPreviewPanel.currentPanel.setJsonFile(filePath);
      } else if (filePath.endsWith('.jslt')) {
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
