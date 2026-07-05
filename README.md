# JSLT Preview - Visual Studio Code Extension

Transform JSON files with JSLT and visualize results in real-time. The preview automatically updates when you save your files.

⚠️ **Important**: The JSLT backend and validation system used in this extension are interpretations based on the original [JSLT](https://github.com/schibsted/jslt) project. They may contain inaccuracies or not include all features of the original language. Missing features will be added progressively. **If you need greater complexity or accuracy, please refer to the original JSLT repository**.

## 🚀 Features

- **Real-Time Preview**: Visualize JSLT transformation results automatically on save
- **Integrated JSLT Engine**: Process transformations directly in the extension, no external services needed
- **Intuitive Workflow**: Start from JSON files, select or create JSLT templates, and edit in VS Code editor
- **Automatic Updates**: Preview refreshes when saving JSLT or JSON files (Ctrl+S)
- **Syntax Highlighting**: Complete syntax highlighting for `.jslt` files with support for:
  - Keywords (`let`, `if`, `else`, `for`, `def`)
  - Logical and arithmetic operators
  - JSLT built-in functions
  - Variables (`$variable`)
  - Properties (`.field`)
- **File Explorer**: Dedicated tree view showing all `.jslt` and `.json` files in your workspace
- **Clean Visualization**: Preview shows only the result, without distractions

## 📋 Requirements

- **Visual Studio Code**: v1.106.1 or higher

### 📌 Note about the JSLT Engine

> ⚠️ This extension includes an internal JSLT engine that is an interpreted implementation based on the original JSLT language. This means that:
> - There may be behavioral differences compared to the official JSLT
> - Not all features of the original JSLT may be supported
> - Features will be completed gradually
> - For use cases requiring full compatibility, we recommend consulting the [official JSLT repository](https://github.com/schibsted/jslt) or using its Java implementation directly

## � JSLT Feature Support

### Implementation Status (~50% Complete)

This extension currently supports **~50%** of the official JSLT language specification. Below is a summary of what's implemented:

#### ✅ Fully Supported Features

| Category | Features |
|----------|----------|
| **Basic Syntax** | Dot accessors (`.field`), Array indexing (`[0]`), Array slicing (`[1:3]`, `[-1]`), JSON construction |
| **Advanced Syntax** | Object for expressions (`{for (.items) .key : .value}`) |
| **Variables** | Declaration (`let`), Usage (`$var`), Local scope |
| **Conditionals** | `if-else` expressions, Falsy values |
| **Loops** | `for` loops with arrays, Filtering with `if` |
| **Operators** | Arithmetic (`+`, `-`, `*`, `/`, `%`), Comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`), Logical (`and`, `or`, `not`) |
| **Basic Functions** | `size()`, `string()`, `number()`, `boolean()`, `round()`, `not()`, `split()`, `join()`, `lowercase()`, `uppercase()`, `trim()`, `flatten()`, `all()`, `any()`, `floor()`, `ceiling()`, `min()`, `max()` |

#### ❌ Not Yet Supported

<details>
<summary><strong>Click to expand full list of missing features</strong></summary>

| Category | Missing Features |
|----------|------------------|
| **Advanced Syntax** | Pipe operator (`\|`), Object matching (`*`), Dynamic keys |
| **Function Declarations** | `def` keyword, Custom functions, Imports |
| **String Functions** | `test()`, `replace()`, `starts-with()`, `ends-with()`, and 7 more |
| **Numeric Functions** | `sum()`, `random()`, `mod()`, and 4 more |
| **Array Functions** | `zip()`, `index-of()`, and 3 more |
| **Object Functions** | `is-object()`, `get-key()` |
| **Time Functions** | `now()`, `parse-time()`, `format-time()` |
| **Type Checking** | `is-array()`, `is-object()`, `is-string()`, `is-number()`, `is-boolean()`, `is-integer()`, `is-decimal()` |

</details>

#### 📈 Detailed Breakdown

```
Syntax & Operators:    ████████████░░░░░░░░  67%
Basic Functions:       █████████░░░░░░░░░░░  45%
Advanced Features:     ░░░░░░░░░░░░░░░░░░░░   0%
Overall:               █████████░░░░░░░░░░░  45%
```

> 📖 **For a complete feature comparison**, see [JSLT-FEATURE-COMPARISON.md](JSLT-FEATURE-COMPARISON.md)

### 🎯 Upcoming Features (Roadmap)

**Next Release (High Priority):**
- Pipe operator (`|`)
- Type checking functions (`is-array()`, `is-object()`, etc.)
- Regular expression support
- Function declarations (`def`)
- Import statements

**Future Releases:**
- Advanced object matching and dynamic keys
- Additional built-in functions from the JSLT specification

## �📖 Usage

### Workflow

#### Option 1: From a JSON file

1. **Open a JSON file** in VS Code
2. **Click the "▶️ Transform with JSLT" button** in the editor toolbar
3. **Choose an option**:
   - 📂 Open existing JSLT file
   - ➕ Create new JSLT file
4. **The preview opens automatically** showing the transformation result
5. **Edit your JSLT** in the normal VS Code editor
6. **Save (Ctrl+S)** → The preview updates automatically

#### Option 2: From a JSLT file

1. **Open a JSLT file** in VS Code
2. **Click the "👁️ Open JSLT Preview" button** in the toolbar
3. **Select the context JSON file** (if it's the first time)
4. **The preview opens** showing the result
5. **Edit your JSLT or JSON** in the editor
6. **Save (Ctrl+S)** → The preview updates automatically

### The Preview

The preview panel displays:
- **Header**: Names of the JSLT and context JSON files
- **Content**: Transformation result in formatted JSON
- **Footer**: Transformation status and execution time

> 💡 **Tip**: The preview updates automatically every time you save the JSLT file or the context JSON

### JSLT Explorer

The explorer in the left sidebar shows:
- 📁 **JSON Files**: All `.json` files in your workspace
- 📄 **JSLT Files**: All `.jslt` files in your workspace
- 🔄 **Refresh Button**: Updates the file list

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "JSLT Preview":

| Setting | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `jsltPreview.autoRefresh` | boolean | `true` | Automatically update the preview when saving JSLT or JSON files |
| `jsltPreview.defaultJsonFile` | string | `""` | Path to the default JSON file |

### Example configuration in `settings.json`:

```json
{
  "jsltPreview.autoRefresh": true,
  "jsltPreview.defaultJsonFile": "data/example.json"
}
```

## 🎨 Available Commands

- `Transform with JSLT` - Starts the transformation flow from a JSON file (▶️ button in .json files)
- `Open JSLT Preview` - Opens the preview panel from a JSLT file (👁️ button in .jslt files)
- `JSLT: Change Context JSON` - Changes the JSON file used as context
- `JSLT: Open JSLT File` - Opens and associates a JSLT file with the preview
- `JSLT: Refresh Explorer` - Updates the file list in the explorer
- `JSLT: Transform with Current File` - Transforms using the file selected in the explorer

## 📝 Usage Example

**Input file (`data.json`):**
```json
{
  "name": "John Doe",
  "age": 30,
  "skills": ["JavaScript", "Python", "JSLT"]
}
```

**JSLT Template (`transform.jslt`):**
```jslt
let skillCount = size(.skills)
{
  "fullName": .name,
  "isAdult": .age >= 18,
  "totalSkills": $skillCount,
  "skillList": [for (.skills) string(.)]
}
```

**Result:**
```json
{
  "fullName": "John Doe",
  "isAdult": true,
  "totalSkills": 3,
  "skillList": ["JavaScript", "Python", "JSLT"]
}
```



## 🐛 Troubleshooting

### Preview not updating
- Verify that `jsltPreview.autoRefresh` is enabled
- Try manually refreshing the JSLT explorer
- Make sure you have saved changes to the JSLT or JSON file (Ctrl+S)

### Transformation error
- Verify that the JSLT syntax is correct
- Check that the input JSON is valid
- Review the VS Code output panel for more error details

### Syntax highlighting not working
- Verify that the file has the `.jslt` extension
- Try closing and reopening the file

## 🛣️ Roadmap

- [ ] Support for JSLT code snippets
- [ ] Real-time validation while typing
- [ ] Transformation history
- [ ] Export results
- [ ] Diff mode to compare input/output
- [ ] Unit tests in preview
- [ ] Save favorite JSON-JSLT pairs

## 🧰 Development Commands

If you are rebuilding or iterating on the extension locally, these are the commands you will usually use:

```bash
npm install
npm run compile
npm run watch
npm test
```

To run the extension in development mode, open the workspace in VS Code and press `F5`.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources

- [JSLT Documentation](https://github.com/schibsted/jslt)
- [JSLT Tutorial](https://github.com/schibsted/jslt/blob/master/tutorial.md)
- [VS Code Extension API](https://code.visualstudio.com/api)

## 👨‍💻 Author

Fabián - JSLT Preview Extension

---

**Enjoy transforming JSON with JSLT!** 🎉
