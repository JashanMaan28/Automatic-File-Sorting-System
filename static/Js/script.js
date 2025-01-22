async function organizeFiles() {
    const folderPath = document.getElementById('folderPath').value;
    const resultDiv = document.getElementById('result');

    if (!folderPath) {
        alert('Please enter a folder path');
        return;
    }

    try {
        const response = await fetch('/organize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: folderPath }),
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        } else {
            let resultHtml = '<h2>Organization Results:</h2>';
            
            for (const [category, files] of Object.entries(data)) {
                resultHtml += `
                    <div class="category">
                        <div class="category-title">${category}</div>
                        <div class="file-list">
                            ${files.length > 0 ? files.join('<br>') : 'No files'}
                        </div>
                    </div>`;
            }

            resultDiv.innerHTML = resultHtml;
        }

        resultDiv.style.display = 'block';
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        resultDiv.style.display = 'block';
    }
}