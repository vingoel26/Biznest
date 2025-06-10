@echo off
echo Starting BizNest Backend Server...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher and add it to your PATH
    pause
    exit /b 1
)

REM Check Java version
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%g
)
echo Java version: %JAVA_VERSION%

REM Navigate to backend directory
cd /d "%~dp0"

REM Clean and compile the project
echo.
echo Cleaning and compiling the project...
call mvnw.cmd clean compile

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to compile the project
    pause
    exit /b 1
)

REM Run the Spring Boot application
echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo API endpoints will be available at: http://localhost:8080/api/
echo.
echo Press Ctrl+C to stop the server
echo.

call mvnw.cmd spring-boot:run

pause