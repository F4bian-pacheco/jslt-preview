import * as vscode from 'vscode';
import * as path from 'path';
import { JsltApiService, TransformResponse } from '../services/JsltApiService';

export class JsltPreviewPanel {
  public static currentPanel: JsltPreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _apiService: JsltApiService;
  private _contextJsonPath: string;
  private _currentJsltPath: string | undefined;
  private _validationTimeout: NodeJS.Timeout | undefined;

  public static createOrShow(extensionUri: vscode.Uri, apiService: JsltApiService, contextJsonPath: string) {
    const column = vscode.ViewColumn.Beside;

    if (JsltPreviewPanel.currentPanel) {
      JsltPreviewPanel.currentPanel._contextJsonPath = contextJsonPath;
      JsltPreviewPanel.currentPanel._panel.reveal(column);
      JsltPreviewPanel.currentPanel.loadContextJson();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'jsltPreview',
      'JSLT Preview',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media')
        ]
      }
    );

    JsltPreviewPanel.currentPanel = new JsltPreviewPanel(panel, extensionUri, apiService, contextJsonPath);
  }

  public getContextJsonPath(): string {
    return this._contextJsonPath;
  }

  public getCurrentJsltPath(): string | undefined {
    return this._currentJsltPath;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, apiService: JsltApiService, contextJsonPath: string) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._apiService = apiService;
    this._contextJsonPath = contextJsonPath;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getHtmlForWebview();

    // Cargar el JSON de contexto automáticamente
    this.loadContextJson();

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.type) {
          case 'ready':
            // El webview está listo, realizar transformación inicial
            await this.performTransform();
            break;
        }
      },
      null,
      this._disposables
    );
  }

  private async loadContextJson() {
    const content = await this.readFileContent(this._contextJsonPath);
    this._panel.webview.postMessage({
      type: 'setContextJson',
      content: content,
      filePath: this._contextJsonPath
    });
  }

  public async changeContextJson() {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'JSON': ['json'] },
      openLabel: 'Seleccionar nuevo JSON de contexto'
    });

    if (uris && uris[0]) {
      this._contextJsonPath = uris[0].fsPath;
      await this.loadContextJson();
    }
  }

  public async setJsltFile(filePath: string) {
    this._currentJsltPath = filePath;
    // Realizar transformación automáticamente
    await this.performTransform();
  }

  public async refreshTransform() {
    // Método público para refrescar la transformación cuando cambia el JSON de contexto
    await this.performTransform();
  }

  private async performTransform() {
    if (!this._currentJsltPath) {
      this._panel.webview.postMessage({
        type: 'showResult',
        success: false,
        error: 'No hay archivo JSLT seleccionado'
      });
      return;
    }

    try {
      // Leer JSLT
      const jsltExpression = await this.readFileContent(this._currentJsltPath);

      // Leer JSON de contexto
      const jsonContent = await this.readFileContent(this._contextJsonPath);
      let jsonObject: any;

      try {
        jsonObject = JSON.parse(jsonContent);
      } catch (e) {
        this._panel.webview.postMessage({
          type: 'showResult',
          success: false,
          error: 'JSON de contexto inválido: ' + (e as Error).message
        });
        return;
      }

      // Transformar
      const result = await this._apiService.transform(jsonObject, jsltExpression);

      this._panel.webview.postMessage({
        type: 'showResult',
        success: result.success,
        output: result.success ? JSON.stringify(result.output, null, 2) : null,
        error: result.error,
        executionTime: result.execution_time_ms,
        jsltFile: this._currentJsltPath,
        contextFile: this._contextJsonPath
      });

    } catch (error) {
      this._panel.webview.postMessage({
        type: 'showResult',
        success: false,
        error: 'Error inesperado: ' + (error as Error).message
      });
    }
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
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
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            padding: 12px 16px;
            background-color: var(--vscode-sideBar-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .header-item {
            margin-bottom: 4px;
        }
        .content {
            flex: 1;
            overflow: auto;
            padding: 16px;
        }
        .output {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.5;
        }
        .error {
            color: var(--vscode-errorForeground);
            background-color: var(--vscode-inputValidation-errorBackground);
            padding: 12px;
            border-radius: 4px;
            border: 1px solid var(--vscode-inputValidation-errorBorder);
        }
        .footer {
            padding: 8px 16px;
            background-color: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            font-size: 11px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .loading {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-item">
            <strong>JSLT:</strong> <span id="jsltFile">-</span>
        </div>
        <div class="header-item">
            <strong>JSON Context:</strong> <span id="contextFile">-</span>
        </div>
    </div>

    <div class="content">
        <div id="output" class="output loading">Esperando transformación...</div>
    </div>

    <div class="footer">
        <span id="status">Listo</span>
        <span id="executionTime"></span>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.type === 'showResult') {
                const outputDiv = document.getElementById('output');
                const statusSpan = document.getElementById('status');
                const timeSpan = document.getElementById('executionTime');
                const jsltFile = document.getElementById('jsltFile');
                const contextFile = document.getElementById('contextFile');
                
                // Actualizar archivos
                if (message.jsltFile) {
                    jsltFile.textContent = message.jsltFile.split(/[\\\\/]/).pop();
                }
                if (message.contextFile) {
                    contextFile.textContent = message.contextFile.split(/[\\\\/]/).pop();
                }
                
                if (message.success) {
                    outputDiv.className = 'output';
                    outputDiv.textContent = message.output;
                    statusSpan.textContent = '✅ Transformación exitosa';
                    if (message.executionTime !== undefined) {
                        timeSpan.textContent = \`⚡ \${message.executionTime.toFixed(2)}ms\`;
                    }
                } else {
                    outputDiv.className = 'output error';
                    outputDiv.textContent = message.error || 'Error desconocido';
                    statusSpan.textContent = '❌ Error';
                    timeSpan.textContent = '';
                }
            }
        });

        // Notificar que el webview está listo
        vscode.postMessage({ type: 'ready' });
    </script>
</body>
</html>`;
  }
}
