# Guía de Inicio Rápido - JSLT Preview

## 🚀 Inicio Rápido en 5 Minutos

### Paso 1: Iniciar el Backend

Antes de usar la extensión, necesitas tener el servidor backend corriendo:

```bash
# Navega a la carpeta del backend
cd backend

# Activa el entorno virtual (si lo tienes)
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Inicia el servidor
python start.py
```

El servidor debería estar corriendo en `http://localhost:8000`.

### Paso 2: Compilar la Extensión

```bash
# En la carpeta de la extensión
npm install
npm run compile
```

### Comandos que más se usan durante el desarrollo

```bash
npm run watch   # Recompila automáticamente al guardar cambios
npm test        # Ejecuta la suite de pruebas
```

### Paso 3: Ejecutar la Extensión

1. Abre la carpeta de la extensión en VS Code
2. Presiona `F5` para ejecutar en modo desarrollo
3. Se abrirá una nueva ventana de VS Code con la extensión cargada

### Paso 4: Probar con los Ejemplos

1. En la nueva ventana, abre la carpeta `examples/`
2. Abre el archivo `example-transform.jslt`
3. Haz clic en el icono de preview (▶️) en la barra superior
4. En el panel que se abre:
   - Clic en "📄 Seleccionar JSON"
   - Selecciona `example-input.json`
   - Clic en "▶️ Transformar"
5. ¡Verás el resultado transformado!

### Notas sobre las funciones nuevas

El ejemplo incluido ahora también sirve para probar:
- Array slicing: `.orders[1:3]` y `.orders[:-1]`
- Negative indexing: `.orders[-1]`
- Object for expressions: `{for (.orders) .id : .product}`

## 📝 Crear Tu Primera Transformación

### 1. Crea un archivo JSON de entrada

`mi-datos.json`:
```json
{
  "nombre": "María",
  "edad": 25,
  "ciudad": "Madrid"
}
```

### 2. Crea tu template JSLT

`mi-transformacion.jslt`:
```jslt
{
  "saludo": "Hola " + .nombre,
  "esMayorDeEdad": .edad >= 18,
  "ubicacion": .ciudad
}
```

### 3. Abre el Preview

- Abre `mi-transformacion.jslt`
- Presiona `Ctrl+Shift+P` y escribe "JSLT: Abrir Preview"
- Selecciona tu archivo JSON
- Presiona "Transformar"

### Resultado:
```json
{
  "saludo": "Hola María",
  "esMayorDeEdad": true,
  "ubicacion": "Madrid"
}
```

## 🎓 Ejemplos Comunes

### Ejemplo 1: Trabajar con Arrays

**Input:**
```json
{
  "items": [1, 2, 3, 4, 5]
}
```

**JSLT:**
```jslt
{
  "total": size(.items),
  "doubled": [for (.items) . * 2],
  "filtered": [for (.items) . if (. > 2)]
}
```

### Ejemplo 2: Condicionales

**Input:**
```json
{
  "temperatura": 28,
  "llueve": false
}
```

**JSLT:**
```jslt
{
  "clima": if (.temperatura > 25) "Hace calor" else "Hace frío",
  "necesitoParaguas": .llueve
}
```

### Ejemplo 3: Variables y Cálculos

**Input:**
```json
{
  "precio": 100,
  "descuento": 20
}
```

**JSLT:**
```jslt
let precioFinal = .precio - .descuento
let impuesto = $precioFinal * 0.21

{
  "precioOriginal": .precio,
  "descuento": .descuento,
  "precioFinal": $precioFinal,
  "impuesto": round($impuesto),
  "total": round($precioFinal + $impuesto)
}
```

## ⚙️ Configuración Inicial Recomendada

Agrega esto a tu `settings.json` de VS Code:

```json
{
  "jsltPreview.apiEndpoint": "http://localhost:8000/api/v1/transform",
  "jsltPreview.apiTimeout": 5000,
  "jsltPreview.autoRefresh": true,
  "files.associations": {
    "*.jslt": "jslt"
  }
}
```

## 🔧 Solución de Problemas Comunes

### ❌ Error: "No se pudo conectar con la API"

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:8000/docs`
2. Si no está corriendo, ejecuta `python start.py` en la carpeta del backend

### ❌ El syntax highlighting no funciona

**Solución:**
1. Cierra y reabre el archivo `.jslt`
2. Verifica que la extensión esté instalada correctamente
3. Recarga la ventana: `Ctrl+Shift+P` → "Developer: Reload Window"

### ❌ El preview no se actualiza automáticamente

**Solución:**
1. Verifica que `jsltPreview.autoRefresh` esté en `true`
2. Usa el botón de refrescar en el explorador JSLT

## 📚 Siguiente Paso

Explora más funcionalidades de JSLT:
- [Tutorial completo de JSLT](https://github.com/schibsted/jslt/blob/master/tutorial.md)
- Consulta el archivo `contexto-api.md` para ver qué features están implementadas
- Prueba con tus propios datos JSON

## 💡 Atajos de Teclado

- `Ctrl+Shift+P` → "JSLT: Abrir Preview" - Abre el panel de preview
- `Ctrl+Enter` - Transforma desde los editores del preview
- `F5` - Ejecutar extensión en modo desarrollo

---

**¿Preguntas?** Consulta el `README.md` principal o la documentación de JSLT.
