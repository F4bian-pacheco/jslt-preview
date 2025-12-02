# Estructura del Proyecto - JSLT Preview Extension

## 📁 Estructura de Carpetas

```
jslt-preview/
├── .vscode/                      # Configuración de VS Code para desarrollo
│   ├── launch.json              # Configuración de debugging
│   └── tasks.json               # Tareas de compilación
├── .vscode-test.mjs             # Configuración de tests
├── examples/                     # Ejemplos de uso
│   ├── example-input.json       # JSON de ejemplo
│   ├── example-transform.jslt   # Template JSLT de ejemplo
│   └── README.md                # Guía de ejemplos
├── out/                         # Código JavaScript compilado (generado)
│   ├── extension.js
│   ├── panels/
│   ├── providers/
│   └── services/
├── resources/                    # Recursos de la extensión
│   ├── jslt-icon.svg            # Icono de la extensión para la barra lateral
│   └── icon.png                 # Icono principal (pendiente de crear)
├── src/                         # Código fuente TypeScript
│   ├── extension.ts             # Punto de entrada principal
│   ├── panels/                  # Paneles de UI
│   │   └── JsltPreviewPanel.ts # Panel de preview principal
│   ├── providers/               # Providers de datos
│   │   └── JsltExplorerProvider.ts # Provider del explorador de archivos
│   ├── services/                # Servicios de negocio
│   │   └── JsltApiService.ts   # Servicio de comunicación con la API
│   └── test/                    # Tests unitarios
│       └── extension.test.ts    # Tests de la extensión
├── syntaxes/                    # Definiciones de syntax highlighting
│   └── jslt.tmLanguage.json    # Gramática de JSLT
├── .gitignore                   # Archivos ignorados por git
├── .vscodeignore               # Archivos excluidos del paquete
├── API-SETUP.md                # Guía de configuración de la API
├── CHANGELOG.md                # Historial de cambios
├── contexto-api.md             # Documentación del backend JSLT
├── eslint.config.mjs           # Configuración de ESLint
├── language-configuration.json  # Configuración del lenguaje JSLT
├── package.json                # Metadatos y dependencias de la extensión
├── package-lock.json           # Lock de versiones de dependencias
├── QUICKSTART.md               # Guía de inicio rápido
├── README.md                   # Documentación principal
├── TESTING.md                  # Guía de pruebas
├── tsconfig.json               # Configuración de TypeScript
└── vsc-extension-quickstart.md # Guía rápida de VS Code (generada)
```

## 🏗️ Arquitectura del Código

### Punto de Entrada: `src/extension.ts`

El archivo principal que VS Code carga cuando activa la extensión.

**Responsabilidades:**
- Inicializar servicios (`JsltApiService`)
- Registrar comandos de la extensión
- Crear y registrar el explorador JSLT (`JsltExplorerProvider`)
- Configurar file watchers para auto-refresh
- Gestionar el ciclo de vida de la extensión

**Comandos registrados:**
```typescript
- jslt-preview.openPreview          // Abre el panel de preview
- jslt-preview.selectJsonFile       // Selecciona archivo JSON
- jslt-preview.selectJsltFile       // Selecciona archivo JSLT
- jslt-preview.refreshExplorer      // Refresca el explorador
- jslt-preview.transformCurrent     // Transforma con archivo actual
```

### Servicios: `src/services/`

#### `JsltApiService.ts`

Servicio para comunicación con el backend JSLT.

**Métodos principales:**
```typescript
- transform(inputJson, jsltExpression): Promise<TransformResponse>
  → Envía petición de transformación a la API
  → Maneja timeouts y errores de conexión
  → Retorna resultado estructurado

- validate(jsltExpression): Promise<ValidateResponse>
  → Valida sintaxis JSLT (endpoint /validate)
  → Retorna errores de validación

- testConnection(): Promise<boolean>
  → Verifica conectividad con la API
```

**Interfaces:**
```typescript
interface TransformRequest {
  input_json: any;
  jslt_expression: string;
}

interface TransformResponse {
  success: boolean;
  output?: any;
  error?: string;
  execution_time_ms?: number;
}
```

### Providers: `src/providers/`

#### `JsltExplorerProvider.ts`

Provider que implementa `TreeDataProvider` para el explorador de archivos.

**Responsabilidades:**
- Buscar archivos `.json` y `.jslt` en el workspace
- Organizar archivos por categoría
- Proporcionar iconos y contextos
- Permitir refresh manual

**Clases:**
```typescript
class JsltExplorerProvider implements vscode.TreeDataProvider<FileItem>
  - getChildren(): FileItem[]
  - getTreeItem(FileItem): TreeItem
  - refresh(): void
  - findFiles(pattern): string[]

class FileItem extends vscode.TreeItem
  - Representa un archivo o categoría en el árbol
```

### Panels: `src/panels/`

#### `JsltPreviewPanel.ts`

Panel webview para el preview interactivo.

**Responsabilidades:**
- Crear y gestionar el webview
- Comunicación bidireccional con el webview (postMessage)
- Cargar archivos JSON y JSLT
- Ejecutar transformaciones
- Mostrar resultados y errores

**Métodos principales:**
```typescript
- createOrShow(): void
  → Crea el panel o lo trae al frente (singleton)

- setJsonFile(filePath): Promise<void>
  → Carga un archivo JSON en el preview

- setJsltFile(filePath): Promise<void>
  → Carga un archivo JSLT en el preview

- handleTransform(inputJson, jsltExpression): Promise<void>
  → Ejecuta la transformación y actualiza el UI
```

**Comunicación con Webview:**
```typescript
// Mensajes del webview → extensión
{ type: 'transform', inputJson, jsltExpression }
{ type: 'selectJsonFile' }
{ type: 'selectJsltFile' }

// Mensajes de extensión → webview
{ type: 'setJsonContent', content, filePath }
{ type: 'setJsltContent', content, filePath }
{ type: 'transformResult', success, output, error, executionTime }
```

## 📄 Archivos de Configuración

### `package.json`

Manifiesto de la extensión con metadatos y contribuciones.

**Secciones clave:**
```json
{
  "contributes": {
    "languages": [...]       // Define el lenguaje JSLT
    "grammars": [...]        // Asocia gramática con .jslt
    "commands": [...]        // Comandos de la extensión
    "menus": [...]           // Menús contextuales
    "viewsContainers": [...] // Container en la barra lateral
    "views": [...]           // Vista del explorador JSLT
    "configuration": [...]   // Configuraciones del usuario
  }
}
```

### `language-configuration.json`

Configuración del comportamiento del lenguaje JSLT.

**Características:**
- Auto-cierre de paréntesis, llaves, corchetes
- Comentarios de línea y bloque
- Folding de código
- Surrounding pairs

### `syntaxes/jslt.tmLanguage.json`

Gramática TextMate para syntax highlighting.

**Tokens definidos:**
- Keywords: `let`, `if`, `else`, `for`, etc.
- Operators: `and`, `or`, `not`, `==`, `>=`, etc.
- Functions: `size()`, `string()`, `round()`, etc.
- Variables: `$variable`
- Properties: `.field`, `.nested.field`
- Strings, numbers, constants

### `tsconfig.json`

Configuración del compilador TypeScript.

**Configuración:**
- Target: ES2022
- Module: Node16
- Output: ./out
- Source maps habilitados para debugging

## 🔌 Integración con VS Code

### Activación de la Extensión

La extensión se activa automáticamente cuando:
1. Se abre un archivo `.jslt` (`onLanguage:jslt`)
2. Se abre un archivo `.json` (`onLanguage:json`)
3. Se abre la vista del explorador JSLT (`onView:jsltExplorer`)

### Contribuciones a VS Code

**Comandos en la paleta:**
- Aparecen al buscar "JSLT" en `Ctrl+Shift+P`

**Menús contextuales:**
- Botón de preview en la barra del editor (cuando se abre un .jslt)
- Botón de refresh en el título del explorador JSLT
- Botón de transformar en items del explorador

**Barra de actividades:**
- Nuevo icono para JSLT Preview
- Abre el explorador al hacer clic

**Settings:**
- Configuraciones disponibles en `File > Preferences > Settings`
- Todas bajo el prefijo `jsltPreview.*`

## 🎨 UI/UX

### Panel de Preview

**Estructura:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Toolbar]                                                       │
│ [📄 Seleccionar JSON] [📝 Seleccionar JSLT] [▶️ Transformar]  │
│ JSON: archivo.json    JSLT: transform.jslt                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │📥 JSON     │  │📝 JSLT     │  │📤 Resultado│              │
│  │ de Entrada │  │ Expresión  │  │            │              │
│  │            │  │            │  │            │              │
│  │ [textarea] │  │ [textarea] │  │ [output]   │              │
│  │            │  │            │  │            │              │
│  └────────────┘  └────────────┘  └────────────┘              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Status: ✅ Listo                          ⚡ 2.45ms           │
└─────────────────────────────────────────────────────────────────┘
```

### Explorador JSLT

**Estructura:**
```
JSLT PREVIEW
├─ 📁 Archivos JSON
│  ├─ 📄 example-input.json
│  └─ 📄 test.json
├─ 📁 Archivos JSLT
│  ├─ 📝 example-transform.jslt
│  └─ 📝 my-transform.jslt
```

## 🚀 Flujo de Desarrollo

### Compilación

```bash
npm run compile      # Compila TypeScript a JavaScript
npm run watch        # Compila en modo watch (auto-recompila)
```

### Testing

```bash
npm run test         # Ejecuta tests unitarios
npm run lint         # Verifica código con ESLint
```

### Debugging

1. Abre la carpeta en VS Code
2. Presiona `F5` o usa "Run > Start Debugging"
3. Se abre una nueva ventana de VS Code con la extensión cargada
4. Puntos de interrupción en el código TypeScript funcionarán

### Empaquetado

```bash
npm install -g vsce
vsce package         # Crea archivo .vsix
vsce publish         # Publica en el marketplace
```

## 📊 Flujo de Datos

```
Usuario abre archivo .jslt
         ↓
Extension activa (extension.ts)
         ↓
Registra comandos y providers
         ↓
Usuario abre preview
         ↓
JsltPreviewPanel crea webview
         ↓
Usuario selecciona JSON y JSLT
         ↓
Usuario presiona "Transformar"
         ↓
Webview envía mensaje a extensión
         ↓
JsltPreviewPanel llama JsltApiService.transform()
         ↓
JsltApiService hace fetch() a backend
         ↓
Backend procesa y retorna resultado
         ↓
JsltApiService retorna TransformResponse
         ↓
JsltPreviewPanel envía resultado a webview
         ↓
Webview actualiza UI con output
```

## 🔧 Extensibilidad

La arquitectura está diseñada para ser extensible:

### Agregar un nuevo comando:

1. Registra el comando en `package.json` → `contributes.commands`
2. Implementa el handler en `extension.ts`
3. Agrega el disposable a `context.subscriptions`

### Agregar una nueva función al API service:

1. Define interfaces en `JsltApiService.ts`
2. Implementa método público
3. Usa en `JsltPreviewPanel` o donde se necesite

### Agregar nueva UI en el preview:

1. Modifica el HTML en `JsltPreviewPanel._getHtmlForWebview()`
2. Agrega handlers de mensajes en `onDidReceiveMessage`
3. Actualiza el JavaScript del webview

## 📝 Notas de Desarrollo

- **Singleton del panel**: Solo un preview abierto a la vez (patrón singleton)
- **Comunicación async**: Todas las llamadas a la API son asíncronas con async/await
- **Manejo de errores**: Try-catch en todas las operaciones críticas
- **Tipos estrictos**: TypeScript en modo estricto para mayor seguridad
- **File watchers**: Gestionados correctamente para evitar memory leaks
- **Webview persistente**: Usa `retainContextWhenHidden: true` para mantener estado

---

**Última actualización:** 2024-12-02
