# Ejemplos de JSLT Preview

Esta carpeta contiene ejemplos para probar la extensión JSLT Preview.

## Archivos de ejemplo

### `example-input.json`
JSON de entrada con información de un usuario y sus pedidos.

### `example-transform.jslt`
Template JSLT que transforma los datos del usuario en un resumen de pedidos y prueba slicing, índice negativo y object-for.

Incluye ejemplos de:
- `.orders[1:3]` para slicing
- `.orders[-1]` para índice negativo
- `{for (.orders) .id : ...}` para object for expressions

## Cómo usar los ejemplos

1. Abre VS Code con esta extensión instalada
2. Abre el archivo `example-transform.jslt`
3. Presiona el icono de preview en la barra superior o usa el comando "JSLT: Abrir Preview"
4. En el panel que se abre:
   - Haz clic en "📄 Seleccionar JSON" y elige `example-input.json`
   - Haz clic en "▶️ Transformar"
5. Verás el resultado en el panel derecho

Si la API de backend soporta estas sintaxis, el preview mostrará la transformación completa. Si no, el panel devolverá el error de parseo correspondiente y podrás ajustar el motor backend.

## Resultado esperado

El template transformará el JSON de entrada en:

```json
{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "isAdult": true,
  "accountStatus": "Active",
  "orderSummary": {
    "totalOrders": 3,
    "totalAmount": 1140,
    "items": [
      {
        "name": "Laptop",
        "unitPrice": 999.99,
        "qty": 1,
        "subtotal": 999.99
      },
      {
        "name": "Mouse",
        "unitPrice": 29.99,
        "qty": 2,
        "subtotal": 59.98
      },
      {
        "name": "Keyboard",
        "unitPrice": 79.99,
        "qty": 1,
        "subtotal": 79.99
      }
    ]
  },
  "processedDate": "2024-01-20"
}
```

## Más ejemplos

Puedes crear tus propios archivos `.jslt` y `.json` en esta carpeta para experimentar.
