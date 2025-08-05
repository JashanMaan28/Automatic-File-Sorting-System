from imports import *
import json
import os

app = Flask(__name__)

# Settings file path
SETTINGS_FILE = "settings.json"

# Default File Categories
DEFAULT_CATEGORIES = {
    "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "documents": [".pdf", ".docx", ".doc", ".txt", ".xls", ".xlsx", ".csv", ".rtf"],
    "media": [".mp3", ".wav", ".mp4", ".avi", ".mov", ".mkv", ".flac", ".ogg"],
    "executables": [".exe", ".msi", ".app", ".sh", ".bat", ".cmd", ".dmg"],
    "code": [".js", ".ts", ".py", ".java", ".cpp", ".c", ".html", ".css", ".json", ".xml", ".sql", ".php", ".rb", ".go", ".rs", ".kt", ".swift"],
    "archives": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".tar.gz", ".tar.bz2", ".iso"]
}

def load_categories():
    """Load categories from settings file or return defaults"""
    try:
        if os.path.exists(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Create settings file with defaults
            save_categories(DEFAULT_CATEGORIES)
            return DEFAULT_CATEGORIES.copy()
    except Exception as e:
        print(f"Error loading categories: {e}")
        return DEFAULT_CATEGORIES.copy()

def save_categories(categories):
    """Save categories to settings file"""
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(categories, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving categories: {e}")
        return False

# Load categories from file on startup
CATEGORIES = load_categories()

# This function is used to determine the file extension of a file to sort them into the correct categories.
def get_file_category(filename, categories=None):
    if categories is None:
        categories = CATEGORIES
    
    extension = os.path.splitext(filename)[1].lower()
    for category, extensions in categories.items():
        if extension in extensions:
            return category
    return "others"

# App Route to the Html page
@app.route("/")
def index():
    return render_template("index.html")

# API Routes for Settings Management

# Get current categories
@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Get current file categories configuration"""
    return jsonify(CATEGORIES)

# Update categories
@app.route("/api/categories", methods=["POST"])
def update_categories():
    """Update file categories configuration"""
    global CATEGORIES
    
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid data format"}), 400
        
        # Validate categories structure
        for category, extensions in data.items():
            if not isinstance(category, str) or not isinstance(extensions, list):
                return jsonify({"error": "Invalid category structure"}), 400
            
            # Validate extensions format
            for ext in extensions:
                if not isinstance(ext, str) or not ext.startswith('.'):
                    return jsonify({"error": f"Invalid extension format: {ext}"}), 400
        
        # Save to file
        if save_categories(data):
            # Update global categories
            CATEGORIES.clear()
            CATEGORIES.update(data)
            return jsonify({"success": True, "message": "Categories updated successfully"})
        else:
            return jsonify({"error": "Failed to save categories to file"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Reset categories to default
@app.route("/api/categories/reset", methods=["POST"])
def reset_categories():
    """Reset categories to default configuration"""
    global CATEGORIES
    
    try:
        # Save defaults to file
        if save_categories(DEFAULT_CATEGORIES):
            CATEGORIES.clear()
            CATEGORIES.update(DEFAULT_CATEGORIES.copy())
            return jsonify({"success": True, "message": "Categories reset to default", "categories": CATEGORIES})
        else:
            return jsonify({"error": "Failed to save default categories to file"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# App Route to sort the files
@app.route("/organize", methods=["POST"])

# This function is used to sort the files into categories based on their extensions.
def organize_files():
    data = request.get_json()
    folder_path = data.get("path")
    
    # Get custom categories from request or use current categories
    custom_categories = data.get("categories", CATEGORIES)

    if not folder_path or not os.path.exists(folder_path):
        return jsonify({"error": "Invalid folder path provided!"})

    try:
        # Initialize result dictionary with all categories including "others"
        file_categories = {category: [] for category in custom_categories.keys()}
        if "others" not in file_categories:
            file_categories["others"] = []
            
        folder = Path(folder_path)

        # Process each file in the folder and categorize it
        for file in folder.iterdir():
            if file.is_file() and file.name not in ["script.js", "styles.css", "index_1.html"]:  # Filter out static files
                category = get_file_category(file.name, custom_categories)
                file_categories[category].append(file.name)

                # Create category folder if it doesn't exist
                category_folder = folder / category
                category_folder.mkdir(exist_ok=True)

                # Move the file to the category folder
                shutil.move(str(file), str(category_folder / file.name))

        return jsonify(file_categories)

    except Exception as e:
        return jsonify({"error": str(e)})

# Run the app
if __name__ == "__main__":
    app.run(debug=False)
