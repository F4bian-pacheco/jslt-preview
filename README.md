# JSLT Preview - Extensión de Visual Studio Code

![JSLT Preview](resources/jslt-icon.svg)

Extensión de VS Code para visualizar y probar transformaciones JSLT en tiempo real con preview interactivo para archivos JSON.

## 🚀 Características

- **Preview Interactivo en Tiempo Real**: Visualiza la transformación de JSON usando templates JSLT con actualización instantánea
- **Explorador de Archivos JSLT**: Vista de árbol dedicada que muestra todos los archivos `.jslt` y `.json` en tu workspace
- **Syntax Highlighting**: Resaltado de sintaxis completo para archivos `.jslt` con soporte para:
  - Keywords (`let`, `if`, `else`, `for`, `def`)
  - Operadores lógicos y aritméticos
  - Funciones built-in de JSLT
  - Variables (`$variable`)
  - Propiedades (`.field`)
- **Integración con API**: Conexión directa con backend JSLT para transformaciones precisas
- **Auto-refresh**: Actualización automática del preview al modificar archivos (configurable)
- **Indicadores de Estado**: Visualización clara de errores, tiempos de ejecución y estado de transformación

## 📋 Requisitos

- **Visual Studio Code**: v1.106.1 o superior
- **Backend JSLT API**: El servidor backend debe estar corriendo (por defecto en `http://localhost:8000`)
  - Endpoint de transformación: `/api/v1/transform`
  - Endpoint de validación: `/api/v1/validate`

## 🔧 Instalación

1. Clona este repositorio o descarga la extensión desde el marketplace
2. Abre la carpeta del proyecto en VS Code
3. Ejecuta `npm install` para instalar dependencias
4. Presiona `F5` para ejecutar la extensión en modo desarrollo

## 📖 Uso

### Abrir el Preview

Hay varias formas de abrir el panel de preview:

1. **Desde un archivo JSLT**: Abre un archivo `.jslt` y haz clic en el icono de preview en la barra superior del editor
2. **Desde el comando**: Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac) y escribe "JSLT: Abrir Preview"
3. **Desde el explorador JSLT**: Haz clic derecho en un archivo del explorador y selecciona "Transformar con archivo actual"

### Flujo de Trabajo Básico

1. **Selecciona un archivo JSON de entrada**: 
   - Usa el botón "📄 Seleccionar JSON" en el panel
   - O haz clic en un archivo `.json` desde el explorador JSLT

2. **Selecciona o escribe tu template JSLT**:
   - Usa el botón "📝 Seleccionar JSLT" en el panel
   - O escribe directamente en el editor JSLT del preview

3. **Transforma**:
   - Presiona el botón "▶️ Transformar"
   - O usa `Ctrl+Enter` desde cualquier editor

4. **Visualiza el resultado**:
   - El panel derecho mostrará el JSON transformado
   - Si hay errores, se mostrarán con detalles útiles
   - El tiempo de ejecución aparece en la barra de estado

### Explorador JSLT

El explorador en la barra lateral izquierda muestra:
- 📁 **Archivos JSON**: Todos los archivos `.json` en tu workspace
- 📄 **Archivos JSLT**: Todos los archivos `.jslt` en tu workspace
- 🔄 **Botón de Refresco**: Actualiza la lista de archivos

## ⚙️ Configuración

Accede a la configuración mediante `File > Preferences > Settings` y busca "JSLT Preview":

| Configuración | Tipo | Valor por defecto | Descripción |
|--------------|------|-------------------|-------------|
| `jsltPreview.apiEndpoint` | string | `http://localhost:8000/api/v1/transform` | URL del endpoint de la API JSLT |
| `jsltPreview.apiTimeout` | number | `5000` | Timeout en milisegundos para peticiones |
| `jsltPreview.autoRefresh` | boolean | `true` | Actualizar automáticamente el preview al modificar archivos |
| `jsltPreview.defaultJsonFile` | string | `""` | Ruta del archivo JSON predeterminado |

### Ejemplo de configuración en `settings.json`:

```json
{
  "jsltPreview.apiEndpoint": "http://localhost:8000/api/v1/transform",
  "jsltPreview.apiTimeout": 10000,
  "jsltPreview.autoRefresh": true
}
```

## 🎨 Comandos Disponibles

- `JSLT: Abrir Preview` - Abre el panel de preview interactivo
- `JSLT: Seleccionar archivo JSON de entrada` - Selecciona un archivo JSON para transformar
- `JSLT: Seleccionar archivo JSLT` - Selecciona un template JSLT
- `JSLT: Refrescar explorador` - Actualiza la lista de archivos en el explorador
- `JSLT: Transformar con archivo actual` - Transforma usando el archivo seleccionado

## 📝 Ejemplo de Uso

**Archivo de entrada (`data.json`):**
```json
{
  "name": "John Doe",
  "age": 30,
  "skills": ["JavaScript", "Python", "JSLT"]
}
```

**Template JSLT (`transform.jslt`):**
```jslt
let skillCount = size(.skills)
{
  "fullName": .name,
  "isAdult": .age >= 18,
  "totalSkills": $skillCount,
  "skillList": [for (.skills) string(.)]
}
```

**Resultado:**
```json
{
  "fullName": "John Doe",
  "isAdult": true,
  "totalSkills": 3,
  "skillList": ["JavaScript", "Python", "JSLT"]
}
```

## 🔌 Integración con Backend

La extensión requiere que el backend JSLT esté corriendo. Para iniciar el servidor:

```bash
cd backend
python start.py
```

El servidor estará disponible en `http://localhost:8000`.

### API Endpoints

**POST `/api/v1/transform`**
```json
{
  "input_json": {},
  "jslt_expression": "string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "output": {},
  "error": null,
  "execution_time_ms": 1.23
}
```

## 🐛 Solución de Problemas

### El preview no se actualiza
- Verifica que `jsltPreview.autoRefresh` esté habilitado
- Intenta refrescar manualmente el explorador JSLT

### Error "No se pudo conectar con la API"
- Asegúrate de que el backend esté corriendo en `http://localhost:8000`
- Verifica la configuración `jsltPreview.apiEndpoint`
- Comprueba que no haya firewall bloqueando la conexión

### Error de timeout
- Aumenta el valor de `jsltPreview.apiTimeout`
- Verifica que la expresión JSLT no sea demasiado compleja

### Syntax highlighting no funciona
- Verifica que el archivo tenga la extensión `.jslt`
- Intenta cerrar y reabrir el archivo

## 🛣️ Roadmap

- [ ] Soporte para snippets de código JSLT
- [ ] Validación en tiempo real mientras escribes
- [ ] Historial de transformaciones
- [ ] Exportar resultados
- [ ] Modo diff para comparar input/output
- [ ] Tests unitarios en el preview
- [ ] Guardado de pares JSON-JSLT favoritos

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas! Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📚 Recursos

- [Documentación JSLT](https://github.com/schibsted/jslt)
- [Tutorial JSLT](https://github.com/schibsted/jslt/blob/master/tutorial.md)
- [VS Code Extension API](https://code.visualstudio.com/api)

## 👨‍💻 Autor

Fabián - JSLT Preview Extension

---

**¡Disfruta transformando JSON con JSLT!** 🎉
