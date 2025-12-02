import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class JsltExplorerProvider implements vscode.TreeDataProvider<FileItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<FileItem | undefined | null | void> = new vscode.EventEmitter<FileItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<FileItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) { }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FileItem): Promise<FileItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No hay workspace abierto');
      return [];
    }

    if (element) {
      return [];
    }

    const jsonFiles = await this.findFiles('**/*.json');
    const jsltFiles = await this.findFiles('**/*.jslt');

    const items: FileItem[] = [];

    if (jsonFiles.length > 0) {
      items.push(new FileItem(
        'Archivos JSON',
        vscode.TreeItemCollapsibleState.Expanded,
        'category',
        ''
      ));
      items.push(...jsonFiles.map(file => new FileItem(
        path.basename(file),
        vscode.TreeItemCollapsibleState.None,
        'jsonFile',
        file,
        {
          command: 'vscode.open',
          title: 'Abrir archivo',
          arguments: [vscode.Uri.file(file)]
        }
      )));
    }

    if (jsltFiles.length > 0) {
      items.push(new FileItem(
        'Archivos JSLT',
        vscode.TreeItemCollapsibleState.Expanded,
        'category',
        ''
      ));
      items.push(...jsltFiles.map(file => new FileItem(
        path.basename(file),
        vscode.TreeItemCollapsibleState.None,
        'jsltFile',
        file,
        {
          command: 'vscode.open',
          title: 'Abrir archivo',
          arguments: [vscode.Uri.file(file)]
        }
      )));
    }

    if (items.length === 0) {
      items.push(new FileItem(
        'No se encontraron archivos .json o .jslt',
        vscode.TreeItemCollapsibleState.None,
        'info',
        ''
      ));
    }

    return items;
  }

  private async findFiles(pattern: string): Promise<string[]> {
    const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
    return files.map(uri => uri.fsPath).sort();
  }
}

export class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly filePath: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = this.filePath || this.label;
    this.description = this.filePath ? path.dirname(this.filePath) : '';

    if (contextValue === 'jsonFile') {
      this.iconPath = new vscode.ThemeIcon('json', new vscode.ThemeColor('charts.yellow'));
    } else if (contextValue === 'jsltFile') {
      this.iconPath = new vscode.ThemeIcon('file-code', new vscode.ThemeColor('charts.blue'));
    } else if (contextValue === 'category') {
      this.iconPath = new vscode.ThemeIcon('folder');
    } else {
      this.iconPath = new vscode.ThemeIcon('info');
    }
  }
}
