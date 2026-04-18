# Change Log

Todos los cambios notables en la extensión "JSLT Preview" serán documentados en este archivo.

El formato está basado en [Keep a Changelog](http://keepachangelog.com/).

## [0.0.1] - 2024-12-02

### ✨ Añadido

#### Funcionalidades Core
- **Preview Interactivo**: Panel webview con visualización en tiempo real de transformaciones JSLT
- **Explorador JSLT**: Vista de árbol en la barra lateral que muestra todos los archivos `.jslt` y `.json` del workspace
- **Integración con API**: Comunicación completa con backend JSLT para transformaciones
- **Syntax Highlighting**: Resaltado de sintaxis completo para archivos `.jslt`
- **Auto-refresh**: Actualización automática del preview al modificar archivos (configurable)

#### Comandos
- `JSLT: Abrir Preview` - Abre el panel de preview interactivo
- `JSLT: Seleccionar archivo JSON de entrada` - Selecciona un archivo JSON para transformar
- `JSLT: Seleccionar archivo JSLT` - Selecciona un template JSLT
- `JSLT: Refrescar explorador` - Actualiza la lista de archivos en el explorador
- `JSLT: Transformar con archivo actual` - Transforma usando el archivo seleccionado

#### UI/UX
- Icono personalizado en la barra de actividades
- Panel dividido en tres secciones: Input JSON, Expresión JSLT, Output
- Indicadores visuales de estado (procesando, error, éxito)
- Visualización del tiempo de ejecución de transformaciones
- Mensajes de error descriptivos con sugerencias
- Soporte para temas claros y oscuros de VS Code

#### Configuración
- `jsltPreview.apiEndpoint` - URL del endpoint de la API JSLT
- `jsltPreview.apiTimeout` - Timeout en milisegundos para peticiones
- `jsltPreview.autoRefresh` - Actualización automática al modificar archivos
- `jsltPreview.defaultJsonFile` - Archivo JSON predeterminado

#### Syntax Highlighting para JSLT
- Keywords: `let`, `if`, `else`, `for`, `def`, `import`, `as`
- Operadores: lógicos (`and`, `or`, `not`), comparación, aritméticos
- Funciones built-in: `size`, `string`, `number`, `boolean`, `round`, etc.
- Variables: `$variable`
- Propiedades: `.field`, `.nested.field`
- Strings, números, constantes (`true`, `false`, `null`)
- Comentarios de línea y bloque

#### Documentación
- README completo con guía de uso
- QUICKSTART.md con guía de inicio rápido
- API-SETUP.md con configuración detallada del endpoint
- Ejemplos incluidos en la carpeta `examples/`
- Integración con documentación del backend en `contexto-api.md`

#### Ejemplos
- `example-input.json` - JSON de ejemplo con datos de usuario y pedidos
- `example-transform.jslt` - Template de transformación completo
- README en carpeta de ejemplos con instrucciones

### 🛠️ Técnico

#### Arquitectura
- Servicio de API (`JsltApiService`) con manejo robusto de errores
- Provider de TreeView (`JsltExplorerProvider`) para explorador de archivos
- Panel WebView (`JsltPreviewPanel`) con comunicación bidireccional
- File watcher para detección automática de cambios
- Gestión de configuración centralizada

#### Manejo de Errores
- Timeout configurable para peticiones
- Detección de conexión fallida con la API
- Validación de JSON de entrada
- Mensajes de error amigables para el usuario
- Recuperación graceful de errores

#### Características Adicionales
- Persistencia del panel webview (no se recarga al perder foco)
- Atajo de teclado `Ctrl+Enter` para transformar
- Soporte para archivos sin guardar (untitled)
- Detección automática de archivos `.jslt` y `.json` en el workspace

### 📦 Dependencias

- VS Code Engine: ^1.106.1
- TypeScript: ^5.9.3
- Node.js: 22.x

### 🎯 Notas de Lanzamiento

Esta es la versión inicial de JSLT Preview con todas las funcionalidades básicas para trabajar con transformaciones JSLT en Visual Studio Code.

**Requiere:**
- Backend JSLT API corriendo en `http://localhost:8000` (configurable)
- VS Code 1.106.1 o superior

**Próximos pasos:**
- Snippets de código JSLT
- Validación en tiempo real
- Historial de transformaciones
- Modo diff para comparar input/output
- Tests unitarios

---

## [Unreleased]

## [1.0.5] - 2026-04-18

### ✨ Añadido

- Soporte para array slicing e índices negativos en expresiones JSLT
- Nuevas funciones de string: `split()`, `join()`, `lowercase()`, `uppercase()`, `trim()`
- Nuevas funciones de array: `flatten()`, `all()`, `any()`
- Nuevas funciones numéricas: `floor()`, `ceiling()`, `min()`, `max()`

### 🛠️ Actualizado

- Documentación de soporte de características y roadmap

### Planeado para próximas versiones

- [ ] Snippets de código JSLT
- [ ] Validación en tiempo real mientras se escribe
- [ ] Historial de transformaciones recientes
- [ ] Exportar resultados a archivo
- [ ] Modo diff para comparar input/output
- [ ] Tests unitarios en el preview
- [ ] Guardado de pares JSON-JSLT favoritos
- [ ] Autocompletado inteligente para funciones JSLT
- [ ] Integración con debugging del backend
- [ ] Soporte para múltiples archivos JSON simultáneos