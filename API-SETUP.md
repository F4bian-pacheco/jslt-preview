# Configuración del Endpoint de la API

Esta guía te ayudará a configurar el endpoint de la API JSLT en la extensión.

## Configuración por Defecto

La extensión viene configurada para conectarse a:
```
http://localhost:8000/api/v1/transform
```

Este es el endpoint del backend JSLT que debe estar corriendo localmente.

## Cambiar el Endpoint

Si tu API está en una URL diferente (por ejemplo, en producción o en otro puerto), puedes cambiarla de las siguientes maneras:

### Opción 1: A través de la UI de VS Code

1. Abre VS Code
2. Ve a `File > Preferences > Settings` (o `Ctrl+,`)
3. Busca "JSLT Preview"
4. Encuentra la configuración `Jslt Preview: Api Endpoint`
5. Cambia la URL por la de tu API

### Opción 2: Editando settings.json

1. Abre la paleta de comandos: `Ctrl+Shift+P`
2. Escribe "Preferences: Open User Settings (JSON)"
3. Agrega o modifica:

```json
{
  "jsltPreview.apiEndpoint": "https://tu-api.ejemplo.com/api/v1/transform"
}
```

### Opción 3: Configuración por Workspace

Si quieres que la configuración solo aplique al proyecto actual:

1. Crea una carpeta `.vscode` en la raíz de tu proyecto (si no existe)
2. Crea o edita el archivo `.vscode/settings.json`
3. Agrega:

```json
{
  "jsltPreview.apiEndpoint": "http://localhost:8000/api/v1/transform",
  "jsltPreview.apiTimeout": 5000
}
```

## Configuraciones Adicionales

### Timeout de la API

Por defecto, las peticiones tienen un timeout de 5 segundos. Si trabajas con transformaciones complejas, puedes aumentarlo:

```json
{
  "jsltPreview.apiTimeout": 10000
}
```

### Auto-refresh

La extensión puede actualizar automáticamente el preview cuando guardas archivos. Esta opción está activada por defecto:

```json
{
  "jsltPreview.autoRefresh": true
}
```

### Archivo JSON por Defecto

Puedes configurar un archivo JSON que se cargue automáticamente:

```json
{
  "jsltPreview.defaultJsonFile": "${workspaceFolder}/examples/example-input.json"
}
```

## Ejemplo Completo de Configuración

```json
{
  "jsltPreview.apiEndpoint": "http://localhost:8000/api/v1/transform",
  "jsltPreview.apiTimeout": 5000,
  "jsltPreview.autoRefresh": true,
  "jsltPreview.defaultJsonFile": "",
  
  // Configuraciones adicionales recomendadas
  "files.associations": {
    "*.jslt": "jslt"
  },
  "editor.formatOnSave": true
}
```

## Verificar la Conexión

Para verificar que la conexión funciona:

1. Asegúrate de que el backend esté corriendo
2. Abre cualquier archivo `.jslt`
3. Abre el preview con `JSLT: Abrir Preview`
4. Intenta hacer una transformación simple
5. Si hay un error de conexión, verás un mensaje claro en el panel de salida

## URLs de Ejemplo

### Desarrollo Local
```
http://localhost:8000/api/v1/transform
```

### Docker
```
http://jslt-api:8000/api/v1/transform
```

### Producción
```
https://api.tudominio.com/jslt/v1/transform
```

## Troubleshooting

### Error: "No se pudo conectar con la API"

**Causa:** El backend no está corriendo o la URL es incorrecta.

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:8000/docs`
2. Revisa la configuración del endpoint en VS Code
3. Comprueba que no haya firewall bloqueando la conexión

### Error: "Timeout: La API no respondió"

**Causa:** La petición tardó más del tiempo configurado.

**Solución:**
1. Aumenta el valor de `jsltPreview.apiTimeout`
2. Verifica que el backend esté respondiendo correctamente
3. Simplifica tu expresión JSLT si es muy compleja

### El preview no se actualiza automáticamente

**Causa:** El auto-refresh está desactivado o hay un problema con el file watcher.

**Solución:**
1. Verifica que `jsltPreview.autoRefresh` esté en `true`
2. Guarda el archivo manualmente
3. Usa el botón de refrescar en el explorador JSLT

## Soporte para Múltiples Backends

Si trabajas con diferentes backends en diferentes proyectos, usa configuración por workspace:

**Proyecto A (.vscode/settings.json):**
```json
{
  "jsltPreview.apiEndpoint": "http://localhost:8000/api/v1/transform"
}
```

**Proyecto B (.vscode/settings.json):**
```json
{
  "jsltPreview.apiEndpoint": "https://api-staging.ejemplo.com/transform"
}
```

Cada workspace mantendrá su propia configuración.
