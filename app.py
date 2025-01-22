from imports import *

app = Flask(__name__)

# File Categories

CATEGORIES = {
    "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "documents": [".pdf", ".docx", ".doc", ".txt", ".xls", ".xlsx", ".csv", ".rtf"],
    "media": [".mp3", ".wav", ".mp4", ".avi", ".mov", ".mkv", ".flac", ".ogg"],
    "executables": [".exe", ".msi", ".app", ".sh", ".bat", ".cmd", ".dmg"],
    "others": []
    # Add more categories and their extensions if you want to, I have added the most common ones.
}

# This function is used to determine the file extension of a file to sort them into the correct categories.
def get_file_category(filename):
    extension = os.path.splitext(filename)[1].lower()
    for category, extensions in CATEGORIES.items():
        if extension in extensions:
            return category
    return "others"

# App Route to the Html page
@app.route("/")
def index():
    return render_template("index.html")

# App Route to sort the files
@app.route("/organize", methods=["POST"])

# This function is used to sort the files into categories based on their extensions.
def organize_files():
    data = request.get_json()
    folder_path = data.get("path")

    if not folder_path or not os.path.exists(folder_path):
        return jsonify({"error": "Invalid folder path provided!"})

    try:
        # Initialize result dictionary
        file_categories = {category: [] for category in CATEGORIES.keys()}
        folder = Path(folder_path)

        # Process each file in the folder and categorize it
        for file in folder.iterdir():
            if file.is_file() and file.name not in ["script.js", "styles.css", "index_1.html"]:  # Filter out static files
                category = get_file_category(file.name)
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
    app.run(debug=True)
