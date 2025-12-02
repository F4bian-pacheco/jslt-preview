# Guía de Pruebas - JSLT Preview Extension

Esta guía te ayudará a probar todas las funcionalidades de la extensión JSLT Preview.

## 🧪 Checklist de Pruebas

### ✅ Preparación

- [ ] Backend JSLT corriendo en `http://localhost:8000`
- [ ] Extensión compilada (`npm run compile`)
- [ ] VS Code con la extensión cargada (presiona `F5`)

### ✅ Pruebas Básicas

#### 1. Verificar Instalación

- [ ] Al abrir VS Code, aparece el icono de JSLT Preview en la barra de actividades (lateral izquierda)
- [ ] Al hacer clic en el icono, se abre el explorador JSLT
- [ ] El explorador muestra las categorías "Archivos JSON" y "Archivos JSLT"

#### 2. Syntax Highlighting

- [ ] Abre `examples/example-transform.jslt`
- [ ] Verifica que las palabras clave (`let`, `if`, `for`) estén resaltadas
- [ ] Verifica que las variables (`$orderCount`) estén resaltadas en color diferente
- [ ] Verifica que las propiedades (`.user.firstName`) estén resaltadas
- [ ] Verifica que las funciones (`size()`, `round()`) estén resaltadas

#### 3. Abrir Preview

**Método 1: Desde archivo JSLT**
- [ ] Abre `examples/example-transform.jslt`
- [ ] Haz clic en el icono de preview (▶️) en la barra superior del editor
- [ ] Se abre el panel de preview dividido en tres secciones

**Método 2: Desde comando**
- [ ] Presiona `Ctrl+Shift+P`
- [ ] Escribe "JSLT: Abrir Preview"
- [ ] Se abre el panel de preview

**Método 3: Desde explorador**
- [ ] En el explorador JSLT, haz clic derecho en `example-transform.jslt`
- [ ] Selecciona "Transformar con archivo actual"
- [ ] Se abre el preview con el archivo cargado

#### 4. Transformación Básica

- [ ] En el panel de preview, haz clic en "📄 Seleccionar JSON"
- [ ] Selecciona `examples/example-input.json`
- [ ] Verifica que el JSON se carga en el panel izquierdo
- [ ] Haz clic en "▶️ Transformar"
- [ ] El panel derecho muestra el resultado transformado
- [ ] En la barra inferior aparece "✅ Transformación exitosa"
- [ ] Se muestra el tiempo de ejecución (ej: "⚡ 2.45ms")

#### 5. Edición en Tiempo Real

- [ ] Con el preview abierto, modifica el JSON de entrada (agrega un campo)
- [ ] Haz clic en "▶️ Transformar"
- [ ] El resultado se actualiza
- [ ] Modifica la expresión JSLT (cambia algo simple)
- [ ] Transforma nuevamente
- [ ] El resultado refleja los cambios

### ✅ Pruebas de Funcionalidades

#### 6. Explorador JSLT

- [ ] Crea un nuevo archivo `test.json` en el workspace
- [ ] Haz clic en el botón de refrescar (🔄) en el explorador JSLT
- [ ] El nuevo archivo aparece en la lista
- [ ] Haz clic en el archivo desde el explorador
- [ ] El archivo se abre en el editor

#### 7. Auto-refresh

- [ ] Verifica que `jsltPreview.autoRefresh` esté en `true` en la configuración
- [ ] Abre `example-transform.jslt` en el editor
- [ ] Abre el preview y carga `example-input.json`
- [ ] Modifica `example-transform.jslt` y guarda
- [ ] El preview detecta el cambio automáticamente

#### 8. Manejo de Errores

**JSON inválido:**
- [ ] En el preview, modifica el JSON de entrada para hacerlo inválido (elimina una coma)
- [ ] Haz clic en "▶️ Transformar"
- [ ] Se muestra un error claro: "JSON de entrada inválido: ..."

**JSLT inválido:**
- [ ] Escribe una expresión JSLT inválida (ej: `{ "test": .nonexistent`)
- [ ] Transforma
- [ ] Se muestra el error de la API en el panel derecho

**API no disponible:**
- [ ] Detén el backend JSLT
- [ ] Intenta transformar
- [ ] Se muestra: "No se pudo conectar con la API en http://localhost:8000..."

**Timeout:**
- [ ] Cambia `jsltPreview.apiTimeout` a `1` (1ms)
- [ ] Intenta transformar
- [ ] Se muestra: "Timeout: La API no respondió en 1ms..."

### ✅ Pruebas de Configuración

#### 9. Configuración del Endpoint

- [ ] Abre Settings (`Ctrl+,`)
- [ ] Busca "JSLT Preview"
- [ ] Cambia `Api Endpoint` a una URL incorrecta
- [ ] Intenta transformar
- [ ] Se muestra error de conexión
- [ ] Restaura la URL correcta
- [ ] La transformación funciona nuevamente

#### 10. Timeout Configurable

- [ ] En Settings, cambia `Api Timeout` a `10000` (10 segundos)
- [ ] Realiza una transformación
- [ ] Verifica que funcione correctamente

### ✅ Pruebas de Atajos de Teclado

#### 11. Ctrl+Enter para Transformar

- [ ] Abre el preview
- [ ] Haz clic en el editor de JSON (izquierda)
- [ ] Presiona `Ctrl+Enter`
- [ ] Se ejecuta la transformación
- [ ] Haz clic en el editor de JSLT (centro)
- [ ] Presiona `Ctrl+Enter`
- [ ] Se ejecuta la transformación

### ✅ Pruebas de Ejemplos Incluidos

#### 12. Ejemplo de Transformación Completa

Usa los archivos de ejemplo incluidos:

**Input esperado:**
```json
{
  "user": { "firstName": "John", "lastName": "Doe", ... },
  "orders": [...],
  ...
}
```

**Output esperado:**
```json
{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "isAdult": true,
  "accountStatus": "Active",
  "orderSummary": {
    "totalOrders": 3,
    "totalAmount": 1140,
    "items": [...]
  },
  "processedDate": "2024-01-20"
}
```

- [ ] Carga `examples/example-input.json`
- [ ] Carga `examples/example-transform.jslt`
- [ ] Transforma
- [ ] El resultado coincide con el esperado

### ✅ Pruebas de UI

#### 13. Temas de Color

- [ ] Cambia al tema claro de VS Code
- [ ] Abre el preview
- [ ] Verifica que los colores sean legibles
- [ ] Cambia al tema oscuro
- [ ] Verifica que los colores sean legibles

#### 14. Iconos

- [ ] En el explorador JSLT, verifica que los archivos JSON tengan icono amarillo 📄
- [ ] Verifica que los archivos JSLT tengan icono azul 📝
- [ ] En el editor, verifica que el icono de preview aparezca cuando abres un `.jslt`

### ✅ Pruebas de Casos Extremos

#### 15. Archivos Grandes

- [ ] Crea un JSON con 1000+ líneas
- [ ] Carga en el preview
- [ ] Verifica que se cargue correctamente
- [ ] Transforma
- [ ] Verifica el resultado

#### 16. Expresiones JSLT Complejas

- [ ] Usa una expresión con múltiples `let`, `if`, y `for`
- [ ] Transforma
- [ ] Verifica que funcione correctamente

#### 17. Workspace sin Archivos

- [ ] Abre VS Code en una carpeta vacía (sin archivos .json o .jslt)
- [ ] Abre el explorador JSLT
- [ ] Verifica que muestre "No se encontraron archivos .json o .jslt"
- [ ] Crea un archivo .jslt nuevo
- [ ] Refresca el explorador
- [ ] El archivo aparece en la lista

### ✅ Pruebas de Persistencia

#### 18. Panel Webview Persistente

- [ ] Abre el preview
- [ ] Cambia a otro editor o panel
- [ ] Vuelve al preview
- [ ] El contenido sigue ahí (no se recargó)

#### 19. Configuración Persistente

- [ ] Cambia una configuración en Settings
- [ ] Cierra VS Code
- [ ] Abre VS Code nuevamente
- [ ] La configuración se mantiene

## 🐛 Reporte de Bugs

Si encuentras algún problema durante las pruebas:

1. Anota el paso que causó el error
2. Copia el mensaje de error completo
3. Verifica la consola de desarrollo (`Help > Toggle Developer Tools`)
4. Registra el bug con:
   - Paso a paso para reproducirlo
   - Mensaje de error
   - Configuración actual
   - Versión de VS Code

## ✅ Criterios de Aceptación

Para considerar la extensión lista para producción, todas las pruebas deben pasar:

- ✅ Todas las funcionalidades básicas funcionan
- ✅ No hay errores en la consola de desarrollo
- ✅ Los errores se manejan gracefully
- ✅ La UI es responsive y clara
- ✅ Los atajos de teclado funcionan
- ✅ La configuración se aplica correctamente
- ✅ El syntax highlighting funciona
- ✅ Los ejemplos funcionan correctamente

## 📊 Checklist Resumido

```
[ ] Preparación (backend corriendo, extensión compilada)
[ ] Syntax highlighting funciona
[ ] Preview se abre correctamente
[ ] Transformaciones básicas funcionan
[ ] Explorador muestra archivos
[ ] Auto-refresh funciona
[ ] Manejo de errores es claro
[ ] Configuración se aplica
[ ] Atajos de teclado funcionan
[ ] Ejemplos funcionan
[ ] UI es legible en ambos temas
[ ] Panel es persistente
```

---

**¿Todo funcionando?** ¡La extensión está lista para usar! 🎉
