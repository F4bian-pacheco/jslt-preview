import * as vscode from 'vscode';

export interface TransformRequest {
  input_json: any;
  jslt_expression: string;
}

export interface TransformResponse {
  success: boolean;
  output?: any;
  error?: string;
  execution_time_ms?: number;
}

export interface ValidateRequest {
  jslt_expression: string;
}

export interface ValidateResponse {
  valid: boolean;
  error: string | null;
  suggestions: string[];
}

export class JsltApiService {
  private getApiEndpoint(): string {
    const config = vscode.workspace.getConfiguration('jsltPreview');
    return config.get<string>('apiEndpoint') || 'http://localhost:8000/api/v1/transform';
  }

  private getApiTimeout(): number {
    const config = vscode.workspace.getConfiguration('jsltPreview');
    return config.get<number>('apiTimeout') || 5000;
  }

  async transform(inputJson: any, jsltExpression: string): Promise<TransformResponse> {
    const endpoint = this.getApiEndpoint();
    const timeout = this.getApiTimeout();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const request: TransformRequest = {
        input_json: inputJson,
        jslt_expression: jsltExpression
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Error HTTP ${response.status}: ${errorText}`
        };
      }

      const data = await response.json() as TransformResponse;
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: `Timeout: La API no respondió en ${timeout}ms. Verifica que el servidor esté corriendo.`
        };
      }

      if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
        return {
          success: false,
          error: `No se pudo conectar con la API en ${endpoint}. Verifica que el servidor esté corriendo.`
        };
      }

      return {
        success: false,
        error: `Error inesperado: ${error.message}`
      };
    }
  }

  async validate(jsltExpression: string): Promise<ValidateResponse> {
    const endpoint = this.getApiEndpoint().replace('/transform', '/validate');
    const timeout = this.getApiTimeout();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const request: ValidateRequest = {
        jslt_expression: jsltExpression
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          valid: false,
          error: `Error HTTP ${response.status}`,
          suggestions: []
        };
      }

      const data = await response.json() as ValidateResponse;
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      return {
        valid: false,
        error: error.message,
        suggestions: []
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.transform({ test: "value" }, ".");
      return result.success !== undefined;
    } catch {
      return false;
    }
  }
}
