# JSLT Preview - Extensión de Visual Studio Code

![JSLT Preview](resources/jslt-icon.svg)

Transforma archivos JSON con JSLT y visualiza los resultados en tiempo real. El preview se actualiza automáticamente al guardar tus archivos.

## 🚀 Características

- **Preview en Tiempo Real**: Visualiza el resultado de la transformación JSLT automáticamente al guardar
- **Flujo de Trabajo Intuitivo**: Inicia desde archivos JSON, selecciona o crea templates JSLT, y edita en el editor de VS Code
- **Actualización Automática**: El preview se refresca al guardar archivos JSLT o JSON (Ctrl+S)
- **Syntax Highlighting**: Resaltado de sintaxis completo para archivos `.jslt` con soporte para:
  - Keywords (`let`, `if`, `else`, `for`, `def`)
  - Operadores lógicos y aritméticos
  - Funciones built-in de JSLT
  - Variables (`$variable`)
  - Propiedades (`.field`)
- **Explorador de Archivos**: Vista de árbol dedicada que muestra todos los archivos `.jslt` y `.json` en tu workspace
- **Integración con API**: Conexión directa con backend JSLT para transformaciones precisas
- **Visualización Limpia**: El preview solo muestra el resultado, sin distracciones

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

### Flujo de Trabajo

#### Opción 1: Desde un archivo JSON

1. **Abre un archivo JSON** en VS Code
2. **Haz clic en el botón "▶️ Transformar con JSLT"** en la barra superior del editor
3. **Elige una opción**:
   - 📂 Abrir archivo JSLT existente
   - ➕ Crear nuevo archivo JSLT
4. **El preview se abre automáticamente** mostrando el resultado de la transformación
5. **Edita tu JSLT** en el editor normal de VS Code
6. **Guarda (Ctrl+S)** → El preview se actualiza automáticamente

#### Opción 2: Desde un archivo JSLT

1. **Abre un archivo JSLT** en VS Code
2. **Haz clic en el botón "👁️ Abrir Preview JSLT"** en la barra superior
3. **Selecciona el archivo JSON de contexto** (si es la primera vez)
4. **El preview se abre** mostrando el resultado
5. **Edita tu JSLT o JSON** en el editor
6. **Guarda (Ctrl+S)** → El preview se actualiza automáticamente

### El Preview

El panel de preview muestra:
- **Header**: Nombres de los archivos JSLT y JSON de contexto
- **Contenido**: Resultado de la transformación en formato JSON formateado
- **Footer**: Estado de la transformación y tiempo de ejecución

> 💡 **Tip**: El preview se actualiza automáticamente cada vez que guardas el archivo JSLT o el JSON de contexto

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
| `jsltPreview.autoRefresh` | boolean | `true` | Actualizar automáticamente el preview al guardar archivos JSLT o JSON |
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

- `Transformar con JSLT` - Inicia el flujo de transformación desde un archivo JSON (botón ▶️ en archivos .json)
- `Abrir Preview JSLT` - Abre el panel de preview desde un archivo JSLT (botón 👁️ en archivos .jslt)
- `JSLT: Cambiar JSON de contexto` - Cambia el archivo JSON usado como contexto
- `JSLT: Abrir archivo JSLT` - Abre y asocia un archivo JSLT al preview
- `JSLT: Refrescar explorador` - Actualiza la lista de archivos en el explorador
- `JSLT: Transformar con archivo actual` - Transforma usando el archivo seleccionado en el explorador

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
