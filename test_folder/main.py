#!/usr/bin/env python3
"""
Sample Python File
This demonstrates Python programming concepts and file processing
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Optional

class FileOrganizer:
    """A class to organize files by their extensions"""
    
    def __init__(self, base_path: str):
        self.base_path = base_path
        self.categories = {
            'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
            'documents': ['.pdf', '.docx', '.doc', '.txt', '.csv'],
            'media': ['.mp3', '.mp4', '.avi', '.mov', '.flac'],
            'code': ['.py', '.js', '.html', '.css', '.java', '.cpp']
        }
    
    def categorize_file(self, filename: str) -> str:
        """Determine the category of a file based on its extension"""
        _, ext = os.path.splitext(filename)
        ext = ext.lower()
        
        for category, extensions in self.categories.items():
            if ext in extensions:
                return category
        return 'others'
    
    def organize_files(self) -> Dict[str, List[str]]:
        """Organize files in the base path by category"""
        if not os.path.exists(self.base_path):
            raise FileNotFoundError(f"Path does not exist: {self.base_path}")
        
        organized = {category: [] for category in self.categories.keys()}
        organized['others'] = []
        
        for filename in os.listdir(self.base_path):
            if os.path.isfile(os.path.join(self.base_path, filename)):
                category = self.categorize_file(filename)
                organized[category].append(filename)
        
        return organized
    
    def generate_report(self) -> str:
        """Generate a report of organized files"""
        organized = self.organize_files()
        report = f"File Organization Report - {datetime.now()}\n"
        report += "=" * 50 + "\n\n"
        
        for category, files in organized.items():
            if files:
                report += f"{category.upper()}:\n"
                for file in files:
                    report += f"  - {file}\n"
                report += f"  Total: {len(files)} files\n\n"
        
        return report

if __name__ == "__main__":
    organizer = FileOrganizer("./test_folder")
    try:
        print(organizer.generate_report())
    except Exception as e:
        print(f"Error: {e}")
