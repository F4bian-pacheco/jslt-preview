# Comparación de Características JSLT

## 📊 Resumen Ejecutivo

Este documento compara las características del lenguaje JSLT original con la implementación actual en la extensión JSLT Preview.

**Estado General:**
- ✅ **Características Implementadas:** ~35%
- ⏳ **En Desarrollo:** ~10%
- ❌ **Pendientes:** ~55%

---

## 📋 Índice

1. [Sintaxis Básica](#sintaxis-básica)
2. [Operadores](#operadores)
3. [Funciones Built-in](#funciones-built-in)
4. [Características Avanzadas](#características-avanzadas)

---

## Sintaxis Básica

### ✅ Dot Accessors

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Acceso simple (`.field`) | ✅ | ✅ | Completo |
| Acceso anidado (`.foo.bar`) | ✅ | ✅ | Completo |
| Claves con caracteres especiales (`."key-name"`) | ✅ | ❌ | No implementado |

**Ejemplo implementado:**
```jslt
.user.firstName  // ✅ Funciona
.user.email      // ✅ Funciona
```

**Ejemplo NO implementado:**
```jslt
."Key - Type Strange"  // ❌ No funciona
```

---

### ⚠️ Array Indexing

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Índice simple (`[0]`) | ✅ | ✅ | Completo |
| Slicing (`[1:3]`) | ✅ | ❌ | No implementado |
| Índices negativos (`[-1]`) | ✅ | ❌ | No implementado |
| Slicing con negativos (`[1:-1]`) | ✅ | ❌ | No implementado |

**Ejemplo implementado:**
```jslt
.orders[0]      // ✅ Funciona
.orders[2]      // ✅ Funciona
```

**Ejemplos NO implementados:**
```jslt
.orders[1:3]    // ❌ No funciona
.orders[-1]     // ❌ No funciona
.orders[1:-1]   // ❌ No funciona
```

---

### ✅ JSON Construction

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Objetos | ✅ | ✅ | Completo |
| Arrays | ✅ | ✅ | Completo |
| Omisión de keys null/empty | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
{
  "name": .user.firstName,
  "age": .user.age,
  "items": [1, 2, 3]
}  // ✅ Funciona
```

---

### ✅ Variables

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Declaración (`let`) | ✅ | ✅ | Completo |
| Uso (`$variable`) | ✅ | ✅ | Completo |
| Scope local | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
let count = size(.items)
let total = $count * 10

{
  "itemCount": $count,
  "totalValue": $total
}  // ✅ Funciona
```

---

### ✅ Conditionals (if-else)

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| If simple | ✅ | ✅ | Completo |
| If-else | ✅ | ✅ | Completo |
| Else opcional | ✅ | ✅ | Completo |
| Valores falsy | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
{
  "status": if (.age >= 18) "adult" else "minor",
  "discount": if (.isPremium) 20 else 0
}  // ✅ Funciona
```

---

### ✅ For Loops (Arrays)

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| For básico | ✅ | ✅ | Completo |
| For con variables | ✅ | ✅ | Completo |
| For con filtro (if) | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
[for (.items) . * 2]  // ✅ Funciona

[for (.items) 
  let doubled = . * 2
  $doubled
]  // ✅ Funciona

[for (.items) . if (. > 10)]  // ✅ Funciona
```

---

### ❌ Object For Expressions

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Object for básico | ✅ | ❌ | No implementado |
| Object for con filtro | ✅ | ❌ | No implementado |
| Loop sobre objetos | ✅ | ❌ | No implementado |

**Ejemplos NO implementados:**
```jslt
{for (.items) string(.) : .}  // ❌ No funciona

{for (.) 
  "custom_" + .key : .value
}  // ❌ No funciona
```

---

## Operadores

### ✅ Operadores Aritméticos

| Operador | Oficial | Implementado | Estado |
|----------|---------|--------------|--------|
| `+` | ✅ | ✅ | Completo |
| `-` | ✅ | ✅ | Completo |
| `*` | ✅ | ✅ | Completo |
| `/` | ✅ | ✅ | Completo |
| `%` | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
.price + 10       // ✅
.price - 5        // ✅
.price * 1.21     // ✅
.price / 2        // ✅
.value % 10       // ✅
```

---

### ✅ Operadores de Comparación

| Operador | Oficial | Implementado | Estado |
|----------|---------|--------------|--------|
| `==` | ✅ | ✅ | Completo |
| `!=` | ✅ | ✅ | Completo |
| `<` | ✅ | ✅ | Completo |
| `>` | ✅ | ✅ | Completo |
| `<=` | ✅ | ✅ | Completo |
| `>=` | ✅ | ✅ | Completo |

---

### ✅ Operadores Lógicos

| Operador | Oficial | Implementado | Estado |
|----------|---------|--------------|--------|
| `and` | ✅ | ✅ | Completo |
| `or` | ✅ | ✅ | Completo |
| `not()` | ✅ | ✅ | Completo |

**Ejemplo implementado:**
```jslt
.age > 18 and .verified       // ✅
.premium or .vip              // ✅
not(.disabled)                // ✅
```

---

### ❌ Pipe Operator

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Pipe básico (`\|`) | ✅ | ❌ | No implementado |
| Pipe encadenado | ✅ | ❌ | No implementado |

**Ejemplos NO implementados:**
```jslt
.a | [.b, .c, .d]               // ❌
1 | [.,.] | {"a": ., "b": .}    // ❌
```

---

### ⚠️ String Concatenation

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Concatenación simple (`+`) | ✅ | ✅ | Completo |
| Slicing de strings | ✅ | ❌ | No implementado |

**Ejemplo implementado:**
```jslt
"Hello " + .name  // ✅
```

**Ejemplo NO implementado:**
```jslt
.name[0:5]  // ❌ Slicing no funciona
```

---

## Funciones Built-in

### Funciones Generales

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `contains(element, sequence)` | ✅ | ⏳ | En desarrollo |
| `size(sequence)` | ✅ | ✅ | Completo |
| `error(message)` | ✅ | ⏳ | En desarrollo |
| `fallback(arg1, arg2, ...)` | ✅ | ⏳ | En desarrollo |
| `min(arg1, arg2)` | ✅ | ❌ | No implementado |
| `max(arg1, arg2)` | ✅ | ❌ | No implementado |

**Implementado:**
```jslt
size(.items)           // ✅
size(.user.name)       // ✅
size([1,2,3])          // ✅
```

**NO implementado:**
```jslt
contains(1, [1,2,3])   // ❌
min(10, 20)            // ❌
max(10, 20)            // ❌
fallback(.missing, 0)  // ❌
```

---

### Funciones Numéricas

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `is-number(object)` | ✅ | ❌ | No implementado |
| `is-integer(object)` | ✅ | ❌ | No implementado |
| `is-decimal(object)` | ✅ | ❌ | No implementado |
| `number(object, fallback?)` | ✅ | ✅ | Completo |
| `round(float)` | ✅ | ✅ | Completo |
| `floor(float)` | ✅ | ❌ | No implementado |
| `ceiling(float)` | ✅ | ❌ | No implementado |
| `random()` | ✅ | ❌ | No implementado |
| `sum(array)` | ✅ | ❌ | No implementado |
| `mod(a, d)` | ✅ | ❌ | No implementado |
| `hash-int(object)` | ✅ | ❌ | No implementado |

**Implementado:**
```jslt
number("42")           // ✅
number(.stringValue)   // ✅
round(3.7)             // ✅
round(.price)          // ✅
```

**NO implementado:**
```jslt
floor(3.7)             // ❌
ceiling(3.2)           // ❌
sum([1,2,3])           // ❌
random()               // ❌
mod(10, 3)             // ❌
```

---

### Funciones de Strings

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `is-string(object)` | ✅ | ❌ | No implementado |
| `string(object)` | ✅ | ✅ | Completo |
| `test(input, regexp)` | ✅ | ❌ | No implementado |
| `capture(input, regexp)` | ✅ | ❌ | No implementado |
| `split(input, regexp)` | ✅ | ❌ | No implementado |
| `join(array, separator)` | ✅ | ❌ | No implementado |
| `lowercase(string)` | ✅ | ❌ | No implementado |
| `uppercase(string)` | ✅ | ❌ | No implementado |
| `sha256-hex(string)` | ✅ | ❌ | No implementado |
| `starts-with(tested, prefix)` | ✅ | ❌ | No implementado |
| `ends-with(tested, suffix)` | ✅ | ❌ | No implementado |
| `from-json(string, fallback?)` | ✅ | ❌ | No implementado |
| `to-json(value)` | ✅ | ❌ | No implementado |
| `replace(value, regexp, out)` | ✅ | ❌ | No implementado |
| `trim(string)` | ✅ | ❌ | No implementado |
| `uuid(long, long)` | ✅ | ❌ | No implementado |

**Implementado:**
```jslt
string(123)            // ✅
string(.age)           // ✅
```

**NO implementado (ejemplos):**
```jslt
split("a,b,c", ",")              // ❌
join(["a","b"], " ")             // ❌
lowercase("HELLO")               // ❌
uppercase("hello")               // ❌
test("123", "\\d+")              // ❌
replace("abc", "b", "x")         // ❌
trim("  hello  ")                // ❌
```

---

### Funciones Booleanas

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `boolean(value)` | ✅ | ✅ | Completo |
| `not(boolean)` | ✅ | ✅ | Completo |
| `is-boolean(value)` | ✅ | ❌ | No implementado |

**Implementado:**
```jslt
boolean(.value)        // ✅
not(.disabled)         // ✅
```

---

### Funciones de Objetos

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `is-object(value)` | ✅ | ❌ | No implementado |
| `get-key(object, key, fallback?)` | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
is-object(.data)               // ❌
get-key(.config, "key", "default")  // ❌
```

---

### Funciones de Arrays

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `array(value)` | ✅ | ❌ | No implementado |
| `is-array(value)` | ✅ | ❌ | No implementado |
| `flatten(array)` | ✅ | ❌ | No implementado |
| `all(array)` | ✅ | ❌ | No implementado |
| `any(array)` | ✅ | ❌ | No implementado |
| `zip(array1, array2)` | ✅ | ❌ | No implementado |
| `zip-with-index(array)` | ✅ | ❌ | No implementado |
| `index-of(array, value)` | ✅ | ❌ | No implementado |

**NO implementado (ejemplos):**
```jslt
flatten([[1,2],[3,4]])         // ❌
all([true, true, false])       // ❌
any([false, false, true])      // ❌
zip(["a","b"], [1,2])          // ❌
index-of([1,2,3], 2)           // ❌
```

---

### Funciones de Tiempo

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `now()` | ✅ | ❌ | No implementado |
| `parse-time(time, format, fallback?)` | ✅ | ❌ | No implementado |
| `format-time(timestamp, format, timezone?)` | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
now()                                      // ❌
parse-time("2018-05-30", "yyyy-MM-dd")    // ❌
format-time(1529677391, "yyyy-MM-dd")     // ❌
```

---

### Funciones Misceláneas

| Función | Oficial | Implementado | Estado |
|---------|---------|--------------|--------|
| `parse-url(url)` | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
parse-url("http://example.com")  // ❌
```

---

## Características Avanzadas

### ❌ Object Matching

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Wildcard `*` | ✅ | ❌ | No implementado |
| Exclusión `* - key1, key2` | ✅ | ❌ | No implementado |
| Matching anidado | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
{
  "foo": .foo * 10,
  * : .
}  // ❌

{
  * - bar, baz : .
}  // ❌
```

---

### ❌ Dynamic Keys

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Claves dinámicas | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
{
  .type : {
    "foo": .bar.foo
  }
}  // ❌
```

---

### ❌ Function Declarations

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Declaración (`def`) | ✅ | ❌ | No implementado |
| Funciones recursivas | ✅ | ❌ | No implementado |
| Funciones que llaman otras | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
def sum(array)
  if ($array)
    $array[0] + sum($array[1:])
  else
    0  // ❌ No funciona
```

---

### ❌ Import Statements

| Característica | Oficial | Implementado | Estado |
|----------------|---------|--------------|--------|
| Import de módulos | ✅ | ❌ | No implementado |
| Import como función | ✅ | ❌ | No implementado |

**NO implementado:**
```jslt
import "utilities.jslt" as utils

utils:count(.)  // ❌ No funciona
```

---

## 📊 Resumen por Categoría

| Categoría | Total | Implementadas | Porcentaje |
|-----------|-------|---------------|------------|
| **Sintaxis Básica** | 9 | 6 | 67% |
| **Operadores** | 14 | 12 | 86% |
| **Funciones Generales** | 6 | 1 | 17% |
| **Funciones Numéricas** | 11 | 2 | 18% |
| **Funciones de Strings** | 16 | 1 | 6% |
| **Funciones Booleanas** | 3 | 2 | 67% |
| **Funciones de Objetos** | 2 | 0 | 0% |
| **Funciones de Arrays** | 8 | 0 | 0% |
| **Funciones de Tiempo** | 3 | 0 | 0% |
| **Funciones Misceláneas** | 1 | 0 | 0% |
| **Características Avanzadas** | 6 | 0 | 0% |
| **TOTAL** | **79** | **24** | **~30%** |

---

## 🎯 Roadmap de Implementación

### Prioridad Alta (Próxima versión)

1. **Array slicing** - `[1:3]`, `[-1]`
2. **Funciones de strings básicas**:
   - `split()`
   - `join()`
   - `lowercase()`
   - `uppercase()`
   - `trim()`
3. **Funciones de arrays**:
   - `flatten()`
   - `all()`
   - `any()`
4. **Funciones numéricas**:
   - `floor()`
   - `ceiling()`
   - `min()`
   - `max()`

### Prioridad Media

5. **Object for expressions**
6. **Pipe operator** (`|`)
7. **Funciones de validación**:
   - `is-array()`
   - `is-object()`
   - `is-string()`
   - `is-number()`
8. **Funciones de strings avanzadas**:
   - `test()` (regex)
   - `replace()` (regex)
   - `starts-with()`
   - `ends-with()`

### Prioridad Baja

9. **Function declarations** (`def`)
10. **Import statements**
11. **Object matching** (`*`)
12. **Dynamic keys**
13. **Funciones de tiempo**
14. **Funciones avanzadas**:
    - `parse-url()`
    - `from-json()`
    - `to-json()`
    - `uuid()`

---

## 📝 Notas de Compatibilidad

### Diferencias Conocidas

1. **Array Slicing**: La implementación actual no soporta slicing. Esto afecta muchos casos de uso comunes.

2. **Regex**: No hay soporte para expresiones regulares (`test()`, `capture()`, `replace()`).

3. **Funciones de Orden Superior**: No hay soporte para `def`, lo que limita la reutilización de código.

4. **Imports**: No se pueden modularizar transformaciones complejas.

5. **Object Matching**: No se puede usar el patrón `*` para copiar keys dinámicamente.

### Workarounds Comunes

**En lugar de slicing:**
```jslt
// ❌ No funciona:
.items[1:3]

// ✅ Alternativa:
[for (.items) . if (let i = index-of(.items, .) $i >= 1 and $i < 3)]
// (Requiere index-of, que tampoco está implementado aún)
```

**En lugar de split/join:**
```jslt
// ❌ No funciona:
split("a,b,c", ",")

// ⚠️ Sin alternativa directa
// Se debe procesar manualmente o desde el JSON de entrada
```

---

## 🔗 Referencias

- [Tutorial oficial de JSLT](https://github.com/schibsted/jslt/blob/master/tutorial.md)
- [Documentación de funciones JSLT](https://github.com/schibsted/jslt/blob/master/functions.md)
- [Javadoc de JSLT](https://javadoc.io/doc/com.schibsted.spt.data/jslt/latest/index.html)
- [Repositorio oficial JSLT](https://github.com/schibsted/jslt)

---

## 📅 Última Actualización

**Fecha:** 1 de febrero de 2026  
**Versión del documento:** 1.0  
**Versión de la extensión:** 1.0.4

---

## 🤝 Contribuciones

Si encuentras alguna característica implementada que no esté documentada aquí, o si quieres contribuir a implementar alguna de las características faltantes, por favor:

1. Abre un issue en el repositorio
2. Documenta el comportamiento actual
3. Propón la implementación
4. Envía un Pull Request

**¡Toda ayuda es bienvenida!** 🎉
