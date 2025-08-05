
---

# 🗂️ Automatic File Sorting System

<p align="center">
  <img src="screenshots/app-logo.png" alt="Automatic File Sorting System Logo" width="300"/>
</p>

<p align="center">
  <a href="https://github.com/JashanMaan28/Automatic-File-Sorting-System/stargazers"><img src="https://img.shields.io/github/stars/JashanMaan28/Automatic-File-Sorting-System?style=for-the-badge&color=yellow" alt="Stars"></a>
  <a href="https://github.com/JashanMaan28/Automatic-File-Sorting-System/network/members"><img src="https://img.shields.io/github/forks/JashanMaan28/Automatic-File-Sorting-System?style=for-the-badge&color=blue" alt="Forks"></a>
  <a href="https://github.com/JashanMaan28/Automatic-File-Sorting-System/issues"><img src="https://img.shields.io/github/issues/JashanMaan28/Automatic-File-Sorting-System?style=for-the-badge&color=red" alt="Issues"></a>
  <a href="https://github.com/JashanMaan28/Automatic-File-Sorting-System/blob/main/LICENSE"><img src="https://img.shields.io/github/license/JashanMaan28/Automatic-File-Sorting-System?style=for-the-badge&color=green" alt="License"></a>
</p>

<p align="center">
  <b>🚀 A modern, web-based file organization system with a beautiful Vercel-inspired UI</b>
</p>

<p align="center">
  Automatically sort and organize your files into categorized folders with a sleek, user-friendly interface. Built with Flask, modern CSS, and vanilla JavaScript.
</p>

---

## 📸 Screenshots

### Main Application Interface
<p align="center">
  <img src="screenshots/main-interface.gif" alt="Main Interface" width="800"/>
</p>

---

## ✨ Features

### 🎨 **Modern UI/UX**
- **Vercel-inspired design** with clean, minimalist aesthetics
- **Dark/Light theme toggle** with system preference detection
- **Smooth animations** and transitions throughout the interface
- **Fully responsive** design that works on all devices
- **Interactive category cards** with real-time file counts

### 📁 **Smart File Organization**
- **6 Built-in Categories**: Images, Documents, Media, Executables, Code, Archives
- **22+ File Extensions** supported out of the box
- **Custom category management** through intuitive settings modal
- **Persistent settings** saved to JSON file
- **Real-time file processing** with loading states and animations

### ⚙️ **Advanced Settings**
- **Expandable category sections** with smooth animations
- **Add/Remove file extensions** with visual feedback
- **Extension validation** and duplicate prevention
- **Reset to defaults** functionality
- **Export/Import settings** capability

### 🔧 **Technical Features**
- **REST API endpoints** for settings management
- **File-based persistence** that survives server restarts
- **Error handling** with user-friendly messages
- **Cross-platform compatibility** (Windows, macOS, Linux)
- **Clean, modular codebase** with modern JavaScript

---

## ⚡️ Installation

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/JashanMaan28/Automatic-File-Sorting-System.git
   cd Automatic-File-Sorting-System
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   ```
   Navigate to: http://127.0.0.1:5000
   ```

---

## 🚀 Usage

### Basic File Sorting

1. **Launch the application** by running `python app.py`
2. **Enter the folder path** you want to organize
3. **Click "Organize Files"** to start the sorting process
4. **Watch the magic happen** as files are automatically categorized!

### Customizing Categories

1. **Click the settings icon** (⚙️) in the top navigation
2. **Expand any category** to view its file extensions
3. **Add new extensions** by typing them in the input field
4. **Remove extensions** by clicking on the extension tags
5. **Save your changes** to persist them across sessions

---

## 🎭 Before & After Examples

### Test Folder Organization

#### Before Sorting
<p align="center">
  <img src="screenshots/before-sorting.png" alt="Messy folder before sorting" width="600"/>
  <br/>
  <em>Cluttered folder with mixed file types</em>
</p>

#### After Sorting
<p align="center">
  <img src="screenshots/after-sorting.png" alt="Organized folders after sorting" width="600"/>
  <br/>
  <em>Clean, organized folders by category</em>
</p>

### File Categories Breakdown

| Category | Extensions | Example Files |
|----------|------------|---------------|
| **Images** | `.jpg`, `.png`, `.gif`, `.svg`, `.webp` | photos, logos, icons |
| **Documents** | `.pdf`, `.docx`, `.txt`, `.csv`, `.xlsx` | reports, spreadsheets, notes |
| **Media** | `.mp3`, `.mp4`, `.avi`, `.flac`, `.mov` | music, videos, audio |
| **Executables** | `.exe`, `.msi`, `.sh`, `.bat`, `.app` | programs, installers, scripts |
| **Code** | `.js`, `.py`, `.html`, `.css`, `.java` | source code, web files |
| **Archives** | `.zip`, `.rar`, `.7z`, `.tar.gz`, `.iso` | compressed files, backups |

---

## 🏗️ Project Structure

```
Automatic-File-Sorting-System/
├── 📁 static/
│   ├── 📁 css/
│   │   └── styles.css          # Modern CSS with custom properties
│   └── 📁 Js/
│       └── script.js           # Interactive JavaScript functionality
├── 📁 templates/
│   └── index.html              # Main application template
├── 📁 test_folder/             # Sample files for testing
│   ├── sample_photo.jpg
│   ├── report.pdf
│   ├── music.mp3
│   ├── app.js
│   ├── backup.zip
│   └── ... (22 test files total)
├── 📁 screenshots/             # Application screenshots
│   ├── main-interface.png
│   ├── settings-modal.png
│   └── before-after/
├── app.py                      # Flask backend application
├── imports.py                  # Python imports and dependencies
├── settings.json              # Persistent user settings
├── requirements.txt           # Python dependencies
├── .gitignore                # Git ignore rules
├── LICENSE                   # BSD License
└── README.md                 # This file
```

---

## 🎯 API Endpoints

### Settings Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Retrieve current file categories |
| `POST` | `/api/categories` | Update file categories |
| `POST` | `/api/categories/reset` | Reset categories to defaults |

### File Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main application interface |
| `POST` | `/organize` | Organize files in specified directory |

---

## 🧪 Testing

### Using the Test Folder

The project includes a comprehensive test folder with 22 sample files:

```bash
# Navigate to the test folder
cd test_folder

# View the test files
ls -la

# Use this path in the application
# Windows: e:\Github Projects\Automatic-File-Sorting-System\test_folder
# macOS/Linux: /path/to/Automatic-File-Sorting-System/test_folder
```

### Expected Results

After running the sorting process on the test folder, you should see:
- ✅ 6 new category folders created
- ✅ 22 files sorted into appropriate categories
- ✅ Clean, organized directory structure

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow PEP 8 for Python code
- Use modern JavaScript (ES6+) features
- Maintain consistent CSS formatting
- Add comments for complex logic
- Write descriptive commit messages

### Areas for Contribution

- 🌟 **New Features**: Drag & drop, file preview, batch operations
- 🐛 **Bug Fixes**: Report and fix issues
- 📖 **Documentation**: Improve README, add code comments
- 🎨 **UI/UX**: Enhance design, add animations
- 🔧 **Performance**: Optimize file processing, reduce load times

---

## 📋 Roadmap

### Version 2.0 (Planned)
- [ ] Drag & drop file interface
- [ ] File preview system
- [ ] Undo/Redo functionality
- [ ] Batch file operations
- [ ] Watch folder monitoring
- [ ] Cloud storage integration

### Version 2.5 (Future)
- [ ] Mobile app companion
- [ ] Advanced file rules engine
- [ ] Multi-user support
- [ ] Analytics dashboard
- [ ] Plugin system

---

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **Python 3.7+** - Core programming language
- **JSON** - Settings persistence

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Interactive functionality
- **SVG Icons** - Scalable vector graphics

### Design
- **Vercel-inspired UI** - Clean, modern aesthetics
- **Inter Font Family** - Beautiful typography
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Animations** - Smooth transitions

---

## 📊 Performance

### Benchmarks
- **Small folders** (< 50 files): ~1-2 seconds
- **Medium folders** (50-200 files): ~3-5 seconds
- **Large folders** (200+ files): ~5-10 seconds

### Optimization Features
- **Efficient file processing** with Python's `pathlib`
- **Asynchronous UI updates** with smooth animations
- **Minimal memory footprint** with streaming operations
- **Fast categorization** with optimized extension matching

---

## 🔒 Security

- **Path validation** prevents directory traversal
- **File extension filtering** blocks potentially harmful files
- **Safe file operations** with proper error handling
- **No external dependencies** for core functionality

---

## 📄 License

This project is licensed under the **BSD 3-Clause License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

---

## 🙏 Acknowledgments

- **Vercel** - Design inspiration for the modern UI
- **Inter Font** - Beautiful typography
- **Flask Community** - Excellent web framework
- **Open Source Contributors** - Making development possible

---

## 📞 Support

### Getting Help

- 📖 **Documentation**: Check this README first
- 💬 **Issues**: [GitHub Issues](https://github.com/JashanMaan28/Automatic-File-Sorting-System/issues)
- 📧 **Email**: Contact through GitHub profile
- 🌟 **Star the repo** if this project helped you!

### Frequently Asked Questions

**Q: Can I add custom file categories?**
A: Yes! Use the settings modal to add new extensions to existing categories.

**Q: Does this work on all operating systems?**
A: Yes! The system works on Windows, macOS, and Linux.

**Q: Are my files safe during sorting?**
A: Absolutely! Files are moved (not copied), and the system includes error handling.

**Q: Can I undo the sorting operation?**
A: Currently, you would need to manually move files back. An undo feature is planned for v2.0.

---

<p align="center">
  <b>Made with ❤️ by <a href="https://github.com/JashanMaan28">Jashanpreet Singh</a></b>
</p>

<p align="center">
  <a href="#-automatic-file-sorting-system">⬆️ Back to Top</a>
</p>

---
