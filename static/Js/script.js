document.addEventListener("DOMContentLoaded", async () => {
    const folderPathInput = document.getElementById("folderPath");
    const sortButton = document.getElementById("sortButton");
    const themeToggle = document.getElementById("themeToggle");
    const settingsButton = document.getElementById("settingsButton");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsModal = document.getElementById("closeSettingsModal");
    const resetSettings = document.getElementById("resetSettings");
    const saveSettings = document.getElementById("saveSettings");

    // Default categories
    const defaultCategories = {
        images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
        documents: [".pdf", ".docx", ".doc", ".txt", ".xls", ".xlsx", ".csv", ".rtf"],
        media: [".mp3", ".wav", ".mp4", ".avi", ".mov", ".mkv", ".flac", ".ogg"],
        executables: [".exe", ".msi", ".app", ".sh", ".bat", ".cmd", ".dmg"],
        code: [".js", ".ts", ".py", ".java", ".cpp", ".c", ".html", ".css", ".json", ".xml", ".sql", ".php", ".rb", ".go", ".rs", ".kt", ".swift"],
        archives: [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".tar.gz", ".tar.bz2", ".iso"]
    };

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Initialize categories from backend or localStorage
    let currentCategories = {};
    
    // Load categories from backend on startup
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const backendCategories = await response.json();
                currentCategories = backendCategories;
            } else {
                // Fallback to default if backend fails
                currentCategories = { ...defaultCategories };
            }
        } catch (error) {
            console.error('Failed to load categories from backend:', error);
            // Check localStorage as fallback
            const localCategories = localStorage.getItem("fileCategories");
            currentCategories = localCategories ? JSON.parse(localCategories) : { ...defaultCategories };
        }
    }

    // Initialize the app
    await loadCategories();

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    // Settings Modal Functions
    settingsButton.addEventListener("click", () => {
        openSettingsModal();
    });

    closeSettingsModal.addEventListener("click", () => {
        closeModal();
    });

    settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && settingsModal.classList.contains("show")) {
            closeModal();
        }
    });

    function openSettingsModal() {
        updateSettingsModal();
        settingsModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        settingsModal.classList.remove("show");
        document.body.style.overflow = "";
    }

    function updateSettingsModal() {
        // Update extension lists in the modal
        for (const [category, extensions] of Object.entries(currentCategories)) {
            const extensionsList = document.querySelector(`#${category}-extensions .extensions-list`);
            if (extensionsList) {
                extensionsList.innerHTML = "";
                extensions.forEach(ext => {
                    const tag = document.createElement("span");
                    tag.className = "extension-tag";
                    tag.textContent = ext;
                    tag.addEventListener("click", () => removeExtension(category, ext));
                    extensionsList.appendChild(tag);
                });
            }
        }
    }

    // Handle category expansion (whole header clickable)
    document.querySelectorAll(".category-setting-header").forEach(header => {
        header.addEventListener("click", (e) => {
            const button = header.querySelector(".expand-button");
            if (!button) return;
            const category = button.dataset.category;
            const extensions = document.getElementById(`${category}-extensions`);
            const isExpanded = extensions.classList.contains("show");
            if (!isExpanded) {
                extensions.classList.add("show");
                button.classList.add("expanded");
            } else {
                extensions.classList.remove("show");
                button.classList.remove("expanded");
            }
        });
    });

    // Handle adding extensions
    document.querySelectorAll(".add-extension-btn").forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
            const input = document.querySelector(`.extension-input[data-category="${category}"]`);
            const extension = input.value.trim();
            
            if (extension) {
                addExtension(category, extension);
                input.value = "";
            }
        });
    });

    // Handle Enter key in extension inputs
    document.querySelectorAll(".extension-input").forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const category = input.dataset.category;
                const extension = input.value.trim();
                
                if (extension) {
                    addExtension(category, extension);
                    input.value = "";
                }
            }
        });
    });

    function addExtension(category, extension) {
        // Ensure extension starts with a dot
        if (!extension.startsWith('.')) {
            extension = '.' + extension;
        }
        
        // Check if extension already exists
        if (!currentCategories[category].includes(extension.toLowerCase())) {
            currentCategories[category].push(extension.toLowerCase());
            updateSettingsModal();
        }
    }

    function removeExtension(category, extension) {
        const index = currentCategories[category].indexOf(extension);
        if (index > -1) {
            currentCategories[category].splice(index, 1);
            updateSettingsModal();
        }
    }

    // Reset settings
    resetSettings.addEventListener("click", async () => {
        if (confirm("Are you sure you want to reset all categories to default? This action cannot be undone.")) {
            try {
                // Reset on backend
                const response = await fetch('/api/categories/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    currentCategories = result.categories;
                    updateSettingsModal();
                    // Also update localStorage
                    localStorage.setItem("fileCategories", JSON.stringify(currentCategories));
                } else {
                    const error = await response.json();
                    alert(`Failed to reset settings: ${error.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error resetting settings:', error);
                // Fallback to local reset
                currentCategories = { ...defaultCategories };
                updateSettingsModal();
                localStorage.setItem("fileCategories", JSON.stringify(currentCategories));
                alert('Reset locally only. Server connection failed.');
            }
        }
    });

    // Save settings
    saveSettings.addEventListener("click", async () => {
        try {
            // Save to backend
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentCategories)
            });

            if (response.ok) {
                // Also save to localStorage as backup
                localStorage.setItem("fileCategories", JSON.stringify(currentCategories));
                closeModal();
                
                // Show success message
                const originalText = saveSettings.textContent;
                saveSettings.textContent = "Saved!";
                saveSettings.style.backgroundColor = "var(--gradient-from)";
                
                setTimeout(() => {
                    saveSettings.textContent = originalText;
                    saveSettings.style.backgroundColor = "";
                }, 2000);
            } else {
                const error = await response.json();
                alert(`Failed to save settings: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            // Fallback to localStorage only
            localStorage.setItem("fileCategories", JSON.stringify(currentCategories));
            alert('Saved to local storage only. Server connection failed.');
            closeModal();
        }
    });

    sortButton.addEventListener("click", async () => {
        const folderPath = folderPathInput.value.trim();

        if (!folderPath) {
            alert("Please enter a valid folder path!");
            return;
        }

        // Add loading state
        sortButton.disabled = true;
        sortButton.classList.add('loading');
        
        // Add loading state to category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.add('loading');
        });

        try {
            const response = await fetch("/organize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    path: folderPath,
                    categories: currentCategories 
                })
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            updateUI(data);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while sorting files.");
        } finally {
            // Remove loading state
            sortButton.disabled = false;
            sortButton.classList.remove('loading');
            
            // Remove loading state from category cards
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('loading');
            });
        }
    });

    function updateUI(categories) {
        // Clear all file lists first
        document.querySelectorAll(".file-list").forEach((list) => {
            list.innerHTML = "";
        });

        for (const [category, files] of Object.entries(categories)) {
            const fileList = document.getElementById(`${category}List`);
            const categoryCard = document.querySelector(`[data-type="${category}"]`);
            const fileCount = categoryCard.querySelector('.file-count');

            // Update file count with animation
            fileCount.textContent = files.length;
            
            // Add files to the list with animation
            files.forEach((file, index) => {
                setTimeout(() => {
                    const fileItem = document.createElement("div");
                    fileItem.className = "file-item";
                    fileItem.textContent = file;
                    fileList.appendChild(fileItem);
                }, index * 50); // Stagger animation
            });

            // Add success state if files were found
            if (files.length > 0) {
                categoryCard.classList.add('has-files');
                setTimeout(() => {
                    categoryCard.classList.remove('has-files');
                }, 1000);
            }
        }
    }

    // Add keyboard support for Enter key
    folderPathInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sortButton.click();
        }
    });

    // Add visual feedback for file input
    folderPathInput.addEventListener("input", () => {
        const value = folderPathInput.value.trim();
        if (value) {
            folderPathInput.style.borderColor = "var(--ring)";
        } else {
            folderPathInput.style.borderColor = "var(--border)";
        }
    });
});
