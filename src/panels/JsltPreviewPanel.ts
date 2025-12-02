import * as vscode from 'vscode';
import * as path from 'path';
import { JsltApiService, TransformResponse } from '../services/JsltApiService';

export class JsltPreviewPanel {
  public static currentPanel: JsltPreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _apiService: JsltApiService;
  private _currentJsonPath: string | undefined;
  private _currentJsltPath: string | undefined;

  public static createOrShow(extensionUri: vscode.Uri, apiService: JsltApiService) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (JsltPreviewPanel.currentPanel) {
      JsltPreviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'jsltPreview',
      'JSLT Preview',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media')
        ]
      }
    );

    JsltPreviewPanel.currentPanel = new JsltPreviewPanel(panel, extensionUri, apiService);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, apiService: JsltApiService) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._apiService = apiService;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getHtmlForWebview();

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.type) {
          case 'transform':
            await this.handleTransform(message.inputJson, message.jsltExpression);
            break;
          case 'selectJsonFile':
            await this.selectJsonFile();
            break;
          case 'selectJsltFile':
            await this.selectJsltFile();
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public async setJsonFile(filePath: string) {
    this._currentJsonPath = filePath;
    const content = await this.readFileContent(filePath);
    this._panel.webview.postMessage({
      type: 'setJsonContent',
      content: content,
      filePath: filePath
    });
  }

  public async setJsltFile(filePath: string) {
    this._currentJsltPath = filePath;
    const content = await this.readFileContent(filePath);
    this._panel.webview.postMessage({
      type: 'setJsltContent',
      content: content,
      filePath: filePath
    });
  }

  private async readFileContent(filePath: string): Promise<string> {
    try {
      const uri = vscode.Uri.file(filePath);
      const content = await vscode.workspace.fs.readFile(uri);
      return Buffer.from(content).toString('utf8');
    } catch (error) {
      return '';
    }
  }

  private async handleTransform(inputJson: string, jsltExpression: string) {
    try {
      let jsonObject: any;
      try {
        jsonObject = JSON.parse(inputJson);
      } catch (e) {
        this._panel.webview.postMessage({
          type: 'transformResult',
          success: false,
          error: 'JSON de entrada inválido: ' + (e as Error).message
        });
        return;
      }

      const result = await this._apiService.transform(jsonObject, jsltExpression);

      this._panel.webview.postMessage({
        type: 'transformResult',
        success: result.success,
        output: result.success ? JSON.stringify(result.output, null, 2) : null,
        error: result.error,
        executionTime: result.execution_time_ms
      });

    } catch (error) {
      this._panel.webview.postMessage({
        type: 'transformResult',
        success: false,
        error: 'Error inesperado: ' + (error as Error).message
      });
    }
  }

  private async selectJsonFile() {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSON': ['json'] },
      openLabel: 'Seleccionar JSON'
    });

    if (uris && uris[0]) {
      await this.setJsonFile(uris[0].fsPath);
    }
  }

  private async selectJsltFile() {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSLT': ['jslt'] },
      openLabel: 'Seleccionar JSLT'
    });

    if (uris && uris[0]) {
      await this.setJsltFile(uris[0].fsPath);
    }
  }

  public dispose() {
    JsltPreviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _getHtmlForWebview(): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSLT Preview</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 10px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .toolbar {
            display: flex;
            gap: 10px;
            padding: 10px;
            background-color: var(--vscode-sideBar-background);
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .toolbar button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
        }
        .toolbar button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .toolbar .file-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            flex: 1;
            overflow: hidden;
        }
        .panel {
            display: flex;
            flex-direction: column;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow: hidden;
        }
        .panel-header {
            padding: 10px;
            background-color: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            font-weight: 600;
            font-size: 13px;
        }
        .panel-content {
            flex: 1;
            overflow: auto;
            padding: 10px;
        }
        textarea {
            width: 100%;
            height: 100%;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 10px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            resize: none;
            border-radius: 4px;
        }
        textarea:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        .output-content {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            white-space: pre-wrap;
            word-break: break-all;
        }
        .error {
            color: var(--vscode-errorForeground);
            background-color: var(--vscode-inputValidation-errorBackground);
            padding: 10px;
            border-radius: 4px;
            border: 1px solid var(--vscode-inputValidation-errorBorder);
        }
        .success {
            color: var(--vscode-terminal-ansiGreen);
        }
        .status-bar {
            padding: 8px 10px;
            background-color: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            font-size: 12px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .loading {
            opacity: 0.6;
        }
        .execution-time {
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <button onclick="selectJson()">📄 Seleccionar JSON</button>
        <button onclick="selectJslt()">📝 Seleccionar JSLT</button>
        <button onclick="transform()" id="transformBtn">▶️ Transformar</button>
        <div class="file-info">
            <span id="jsonFileName">JSON: ninguno</span>
            <span id="jsltFileName">JSLT: ninguno</span>
        </div>
    </div>

    <div class="container">
        <div class="panel">
            <div class="panel-header">📥 JSON de Entrada</div>
            <div class="panel-content">
                <textarea id="inputJson" placeholder="Pega aquí tu JSON de entrada o selecciona un archivo...">{}</textarea>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">📝 Expresión JSLT</div>
            <div class="panel-content">
                <textarea id="jsltExpression" placeholder="Escribe tu expresión JSLT aquí o selecciona un archivo...">.</textarea>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">📤 Resultado</div>
            <div class="panel-content">
                <div id="output" class="output-content">Presiona "Transformar" para ver el resultado...</div>
            </div>
        </div>
    </div>

    <div class="status-bar">
        <span id="status">Listo</span>
        <span id="executionTime" class="execution-time"></span>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function selectJson() {
            vscode.postMessage({ type: 'selectJsonFile' });
        }

        function selectJslt() {
            vscode.postMessage({ type: 'selectJsltFile' });
        }

        function transform() {
            const inputJson = document.getElementById('inputJson').value;
            const jsltExpression = document.getElementById('jsltExpression').value;
            
            if (!inputJson.trim() || !jsltExpression.trim()) {
                updateOutput(false, null, 'Por favor, proporciona tanto el JSON de entrada como la expresión JSLT');
                return;
            }

            document.getElementById('status').textContent = '⏳ Transformando...';
            document.getElementById('transformBtn').disabled = true;
            document.getElementById('output').className = 'output-content loading';
            
            vscode.postMessage({
                type: 'transform',
                inputJson: inputJson,
                jsltExpression: jsltExpression
            });
        }

        function updateOutput(success, output, error, executionTime) {
            const outputDiv = document.getElementById('output');
            const statusSpan = document.getElementById('status');
            const timeSpan = document.getElementById('executionTime');
            
            document.getElementById('transformBtn').disabled = false;
            outputDiv.className = 'output-content';
            
            if (success) {
                outputDiv.className = 'output-content success';
                outputDiv.textContent = output;
                statusSpan.textContent = '✅ Transformación exitosa';
                if (executionTime !== undefined) {
                    timeSpan.textContent = \`⚡ \${executionTime.toFixed(2)}ms\`;
                }
            } else {
                outputDiv.className = 'output-content error';
                outputDiv.textContent = error || 'Error desconocido';
                statusSpan.textContent = '❌ Error en la transformación';
                timeSpan.textContent = '';
            }
        }

        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'setJsonContent':
                    document.getElementById('inputJson').value = message.content;
                    document.getElementById('jsonFileName').textContent = 'JSON: ' + message.filePath.split(/[\\\\/]/).pop();
                    break;
                    
                case 'setJsltContent':
                    document.getElementById('jsltExpression').value = message.content;
                    document.getElementById('jsltFileName').textContent = 'JSLT: ' + message.filePath.split(/[\\\\/]/).pop();
                    break;
                    
                case 'transformResult':
                    updateOutput(message.success, message.output, message.error, message.executionTime);
                    break;
            }
        });

        // Auto-transform on Ctrl+Enter
        document.getElementById('inputJson').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                transform();
            }
        });
        
        document.getElementById('jsltExpression').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                transform();
            }
        });
    </script>
</body>
</html>`;
  }
}
