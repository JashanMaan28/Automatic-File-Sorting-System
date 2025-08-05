@echo off
REM Sample Windows Batch File
REM This is a simple script that demonstrates batch file functionality

echo Welcome to the Sample Batch Script!
echo Current date and time: %date% %time%
echo Current directory: %cd%

REM Display system information
echo.
echo System Information:
echo Computer Name: %COMPUTERNAME%
echo User Name: %USERNAME%
echo OS Version: %OS%

REM Simple file operations
echo.
echo Creating a temporary file...
echo This is a test file > temp.txt
echo File created successfully!

REM Cleanup
del temp.txt 2>nul
echo Temporary file cleaned up.

echo.
echo Script execution completed!
pause
