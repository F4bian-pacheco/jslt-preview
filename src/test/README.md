# Tests de JSLT Preview Extension

Esta carpeta contiene los tests automatizados para la extensión JSLT Preview.

## Estructura de Tests

### `extension.test.ts`
Tests principales de la extensión:
- ✅ Verificación de activación de la extensión
- ✅ Registro de comandos (transformWithJslt, openPreview, etc.)
- ✅ Validación de configuración por defecto

### `apiService.test.ts`
Tests del servicio de API JSLT:
- ✅ Creación de instancia del servicio
- ✅ Transformación con entrada válida
- ✅ Manejo de timeouts
- ✅ Validación de expresiones JSLT
- ⚠️ Los tests que requieren el servidor API se saltan si no está disponible

### `explorerProvider.test.ts`
Tests del explorador de archivos:
- ✅ Creación del provider
- ✅ Obtención de elementos raíz
- ✅ Manejo de workspace con archivos
- ✅ Verificación de que los elementos no tienen hijos
- ✅ Función de refresh
- ✅ Conversión a TreeItem

## Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
```

### Solo compilar y lint (sin ejecutar tests)
```bash
npm run pretest
```

### Ver tests en modo watch
```bash
npm run watch
```

## Requisitos para Tests

- **VS Code Test**: Los tests se ejecutan en una instancia de VS Code real
- **API Backend (opcional)**: Para tests de `apiService.test.ts`, el servidor debe estar corriendo en `http://localhost:8000`
  - Si el servidor no está disponible, los tests se saltan automáticamente
  - No causa fallos en CI/CD

## Agregar Nuevos Tests

Para agregar tests nuevos:

1. Crear archivo `*.test.ts` en esta carpeta
2. Importar el framework de testing:
   ```typescript
   import * as assert from 'assert';
   import * as vscode from 'vscode';
   ```
3. Definir suite y tests:
   ```typescript
   suite('Mi Test Suite', () => {
     test('Descripción del test', () => {
       // Tu código de test
       assert.ok(true);
     });
   });
   ```

## Cobertura de Tests

Actualmente cubrimos:
- ✅ Activación de extensión
- ✅ Registro de comandos
- ✅ Configuración
- ✅ Servicio API (transform y validate)
- ✅ Explorador de archivos
- ⏳ Panel de preview (pendiente)
- ⏳ Integración end-to-end (pendiente)

## Notas

- Los tests usan el framework Mocha incluido en VS Code
- Timeout por defecto: 2000ms (puede aumentarse con `this.timeout(ms)`)
- Los tests se ejecutan en una instancia limpia de VS Code
- Los archivos temporales de test se limpian automáticamente

## CI/CD

Los tests están configurados para ejecutarse automáticamente en:
- Antes de cada commit (con pretest)
- En el pipeline de CI/CD
- El servidor API no es obligatorio para que pasen los tests
