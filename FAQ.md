# FAQ - Preguntas Frecuentes

## 🤔 Preguntas Generales

### ¿Qué es JSLT Preview?

JSLT Preview es una extensión de Visual Studio Code que permite visualizar y probar transformaciones JSLT en tiempo real. Proporciona un panel interactivo donde puedes ver el JSON de entrada, el template JSLT, y el resultado transformado todo en un mismo lugar.

### ¿Qué es JSLT?

JSLT (JSON Transformation Language) es un lenguaje de transformación de JSON desarrollado por Schibsted. Es similar a XSLT pero para JSON. Permite transformar documentos JSON de una estructura a otra usando expresiones declarativas.

**Más información:** https://github.com/schibsted/jslt

### ¿Por qué necesito un backend para usar esta extensión?

La extensión se comunica con una API backend que ejecuta el intérprete de JSLT. El backend proporciona:
- Procesamiento de expresiones JSLT
- Validación de sintaxis
- Transformación de datos
- Manejo de errores detallados

## 🔧 Instalación y Configuración

### ¿Cómo instalo la extensión?

**Opción 1: Desde el código fuente (desarrollo)**
```bash
git clone [repositorio]
cd jslt-preview
npm install
npm run compile
# Presiona F5 en VS Code para ejecutar
```

**Opción 2: Desde archivo .vsix (producción)**
```bash
# Una vez empaquetada
code --install-extension jslt-preview-1.0.6.vsix
```

### ¿Cómo configuro el backend?

1. El backend debe estar corriendo en `http://localhost:8000` (por defecto)
2. Si usas otra URL, cambia la configuración:
   - `File > Preferences > Settings`
   - Busca "JSLT Preview"
   - Modifica `Api Endpoint`

Ver `API-SETUP.md` para más detalles.

### ¿Puedo usar la extensión sin el backend?

No, la extensión requiere el backend JSLT para funcionar. Sin él, no podrás realizar transformaciones. Sin embargo, el syntax highlighting y el explorador de archivos funcionarán sin problemas.

## 💻 Uso

### ¿Cómo abro el preview?

Tres formas:
1. **Desde archivo .jslt**: Abre un archivo `.jslt` y haz clic en el icono ▶️ en la barra superior
2. **Desde comando**: `Ctrl+Shift+P` → "JSLT: Abrir Preview"
3. **Desde explorador**: Clic derecho en un archivo del explorador JSLT

### ¿Puedo editar los archivos directamente en el preview?

Sí, el preview tiene editores de texto para el JSON de entrada y la expresión JSLT. Sin embargo, estos cambios son temporales en el preview. Para guardar cambios permanentes, edita los archivos directamente en VS Code.

### ¿Cómo ejecuto una transformación?

1. Abre el preview
2. Selecciona o escribe tu JSON de entrada
3. Selecciona o escribe tu expresión JSLT
4. Presiona el botón "▶️ Transformar" o usa `Ctrl+Enter`

### ¿El preview se actualiza automáticamente?

Sí, si `jsltPreview.autoRefresh` está habilitado (por defecto), el preview detectará cambios en los archivos y se actualizará automáticamente al guardar.

## 🎨 Características

### ¿Qué features de JSLT están soportadas?

El backend implementa aproximadamente el 40% de la especificación JSLT:

**✅ Soportado:**
- Dot accessors (`.field`)
- Array indexing (`[0]`)
- Array slicing (`[1:3]`, `[-1]`)
- Object for expressions
- Object/Array construction
- Variables (`let`, `$var`)
- Conditionals (`if-else`)
- For loops
- Operators (aritméticos, comparación, lógicos)
- Funciones básicas (`size`, `string`, `number`, `boolean`, `round`)

**❌ No soportado aún:**
- Function declarations (`def`)
- Import statements
- 50+ funciones built-in adicionales

Ver `contexto-api.md` para la lista completa.

### ¿El syntax highlighting funciona para JSLT?

Sí, la extensión incluye syntax highlighting completo para archivos `.jslt` con resaltado de:
- Keywords
- Operators
- Functions
- Variables
- Properties
- Strings, numbers, constants

### ¿Puedo trabajar con múltiples archivos JSON simultáneamente?

En la versión actual (1.0.6), el preview maneja un JSON a la vez. Sin embargo, puedes cambiar fácilmente entre diferentes archivos JSON usando el botón "Seleccionar JSON".

## 🐛 Problemas Comunes

### Error: "No se pudo conectar con la API"

**Causas:**
- El backend no está corriendo
- La URL del endpoint es incorrecta
- Firewall bloqueando la conexión

**Soluciones:**
1. Verifica que el backend esté corriendo: `curl http://localhost:8000/docs`
2. Si no está, inicia el backend: `cd backend && python start.py`
3. Verifica la configuración `jsltPreview.apiEndpoint`
4. Prueba con `curl` para verificar conectividad

### Error: "Timeout: La API no respondió"

**Causas:**
- El backend está sobrecargado
- La expresión JSLT es muy compleja
- El timeout configurado es muy corto

**Soluciones:**
1. Aumenta `jsltPreview.apiTimeout` en la configuración
2. Simplifica la expresión JSLT
3. Reinicia el backend

### El syntax highlighting no funciona

**Causas:**
- La extensión no está instalada correctamente
- El archivo no tiene extensión `.jslt`
- VS Code necesita recargarse

**Soluciones:**
1. Verifica que el archivo termine en `.jslt`
2. Cierra y reabre el archivo
3. Recarga la ventana: `Ctrl+Shift+P` → "Developer: Reload Window"
4. Reinstala la extensión

### El preview no se actualiza automáticamente

**Causas:**
- `autoRefresh` está deshabilitado
- File watcher no funciona correctamente

**Soluciones:**
1. Verifica `jsltPreview.autoRefresh` en configuración
2. Guarda el archivo manualmente (`Ctrl+S`)
3. Usa el botón de refrescar del explorador JSLT
4. Recarga la ventana de VS Code

### "JSON de entrada inválido"

**Causas:**
- El JSON tiene errores de sintaxis
- Falta una coma, llave, o corchete

**Soluciones:**
1. Verifica la sintaxis del JSON
2. Usa un validador JSON online
3. Revisa que todas las llaves y corchetes estén cerrados
4. Verifica que las comas estén bien puestas

### El resultado de la transformación es incorrecto

**Causas:**
- Error en la expresión JSLT
- Feature no soportada por el backend
- Bug en el backend

**Soluciones:**
1. Verifica que la expresión JSLT sea correcta
2. Consulta `contexto-api.md` para ver features soportadas
3. Prueba con una expresión más simple
4. Revisa los logs del backend

## 📊 Rendimiento

### ¿Hay límite de tamaño para los archivos JSON?

No hay límite explícito en la extensión, pero:
- JSONs muy grandes pueden tardar más en transformarse
- El webview puede ser lento con outputs muy grandes
- Recomendado: < 1MB para mejor rendimiento

### ¿Cuánto tarda una transformación?

Depende de:
- Complejidad de la expresión JSLT
- Tamaño del JSON de entrada
- Carga del backend

Típicamente: 1-50ms para transformaciones simples

### ¿Puedo usar la extensión con un backend remoto?

Sí, solo necesitas cambiar `jsltPreview.apiEndpoint` a la URL de tu backend remoto. Ten en cuenta:
- La latencia de red afectará el tiempo de respuesta
- Puede que necesites configurar CORS en el backend
- Aumenta el timeout si es necesario

## 🔐 Seguridad

### ¿Los datos se envían a algún servidor externo?

No. Los datos solo se envían al endpoint configurado en `jsltPreview.apiEndpoint` (por defecto `localhost:8000`). No hay telemetría ni envío de datos a terceros.

### ¿Es seguro usar la extensión con datos sensibles?

Sí, siempre que:
- Uses un backend local o de confianza
- No compartas el endpoint con terceros no autorizados
- Mantengas el backend actualizado

### ¿La extensión guarda mis datos?

No. La extensión no guarda ni cachea los archivos JSON o JSLT. Todo se procesa en memoria y se descarta al cerrar el preview.

## 🚀 Desarrollo

### ¿Puedo contribuir al proyecto?

¡Sí! Las contribuciones son bienvenidas:
1. Fork del repositorio
2. Crea una rama para tu feature
3. Haz tus cambios
4. Envía un Pull Request

### ¿Cómo reporto un bug?

1. Verifica que no esté ya reportado
2. Abre un issue en el repositorio
3. Incluye:
   - Pasos para reproducir
   - Mensaje de error completo
   - Versión de VS Code
   - Configuración actual
   - Logs relevantes

### ¿Cómo puedo extender la funcionalidad?

Ver `PROJECT-STRUCTURE.md` para detalles sobre la arquitectura. La extensión está diseñada para ser extensible:
- Agregar nuevos comandos
- Extender el API service
- Personalizar el webview
- Agregar nuevas vistas

### ¿Puedo usar esto en mi empresa?

Sí, la extensión tiene licencia MIT (open source). Puedes usarla, modificarla y distribuirla libremente.

## 📚 Recursos Adicionales

### ¿Dónde puedo aprender más sobre JSLT?

- [Repositorio oficial de JSLT](https://github.com/schibsted/jslt)
- [Tutorial de JSLT](https://github.com/schibsted/jslt/blob/master/tutorial.md)
- [Documentación de funciones](https://github.com/schibsted/jslt/blob/master/functions.md)
- `contexto-api.md` en este proyecto

### ¿Dónde están los ejemplos?

En la carpeta `examples/` del proyecto:
- `example-input.json` - JSON de ejemplo
- `example-transform.jslt` - Template de ejemplo
- `README.md` - Guía de los ejemplos

### ¿Hay un tutorial paso a paso?

Sí, consulta `QUICKSTART.md` para una guía de inicio rápido en 5 minutos.

### ¿Cómo funciona el backend?

El backend está documentado en `contexto-api.md`. Está escrito en Python con FastAPI y proporciona endpoints REST para transformación y validación.

## 💡 Tips y Trucos

### Atajo de teclado para transformar rápido

Usa `Ctrl+Enter` desde cualquier editor del preview para ejecutar la transformación.

### Reutilizar transformaciones comunes

Guarda tus expresiones JSLT más usadas en archivos `.jslt` y cárgalas desde el explorador cuando las necesites.

### Debugging de expresiones complejas

Si una expresión compleja no funciona:
1. Divídela en pasos más simples
2. Prueba cada paso por separado
3. Usa `let` para almacenar resultados intermedios
4. Verifica los tipos de datos con `string()`, `number()`, etc.

### Trabajar con datos grandes

Para JSONs grandes:
1. Aumenta el timeout
2. Simplifica la expresión JSLT
3. Considera procesar solo una parte del JSON primero

---

**¿No encuentras tu pregunta?** Consulta el `README.md` o abre un issue en el repositorio.
