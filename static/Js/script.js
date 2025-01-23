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

        sortButton.disabled = true;
        sortButton.textContent = "Sorting...";

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
            sortButton.disabled = false;
            sortButton.textContent = "Sort Files";
        }
    });

    function updateUI(categories) {
        document.querySelectorAll(".file-list").forEach((list) => {
            list.innerHTML = ""; // Clear all file lists
        });

        for (const [category, files] of Object.entries(categories)) {
            const fileList = document.getElementById(`${category}List`);

            files.forEach((file) => {
                const fileItem = document.createElement("div");
                fileItem.className = "file-item";
                fileItem.textContent = file;
                fileList.appendChild(fileItem);
            });

            // Update file count
            const fileCount = document.querySelector(`.folder[data-type="${category}"] .file-count`);
            fileCount.textContent = `${files.length} file${files.length !== 1 ? "s" : ""}`;
        }
    }
});
