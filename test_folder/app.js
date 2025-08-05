// Sample JavaScript File
// This demonstrates modern JavaScript features and functionality

class FileProcessor {
    constructor(name) {
        this.name = name;
        this.files = [];
    }

    addFile(file) {
        this.files.push(file);
        console.log(`Added file: ${file.name}`);
    }

    processFiles() {
        console.log(`Processing ${this.files.length} files...`);
        
        this.files.forEach((file, index) => {
            setTimeout(() => {
                this.processFile(file);
            }, index * 100);
        });
    }

    processFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch(extension) {
            case 'js':
            case 'ts':
                console.log(`${file.name} is a JavaScript/TypeScript file`);
                break;
            case 'py':
                console.log(`${file.name} is a Python file`);
                break;
            case 'java':
                console.log(`${file.name} is a Java file`);
                break;
            default:
                console.log(`${file.name} is a ${extension} file`);
        }
    }
}

// Usage example
const processor = new FileProcessor('Test Processor');
processor.addFile({ name: 'app.js', size: 1024 });
processor.addFile({ name: 'main.py', size: 2048 });
processor.addFile({ name: 'index.html', size: 512 });

processor.processFiles();
