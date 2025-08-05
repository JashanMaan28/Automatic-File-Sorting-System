document.addEventListener("DOMContentLoaded", () => {
    const folderPathInput = document.getElementById("folderPath");
    const sortButton = document.getElementById("sortButton");
    const themeToggle = document.getElementById("themeToggle");

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

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
                body: JSON.stringify({ path: folderPath })
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
