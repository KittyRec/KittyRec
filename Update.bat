@echo off
setlocal
echo Checking and installing requirements... (MAKE SURE YOU RAN THE NODE.JS INSTALLER)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    set "PYTHON_INSTALLER=https://www.python.org/ftp/python/3.10.4/python-3.10.4-amd64.exe"
    powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%PYTHON_INSTALLER%', 'python-installer.exe')"
    start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1
    del python-installer.exe
    echo Python installation complete.
) else (
    echo Python is already installed.
)

npm ls -g --depth=0 2>nul | findstr /i "discord-rpc" >nul
if %errorlevel% neq 0 (
    npm install -g discord-rpc --silent
)

python -m pip show windows-curses >nul 2>nul
if %errorlevel% neq 0 (
    python -m pip install windows-curses --quiet
)

:: Install other npm dependencies
npm ls -g --depth=0 2>nul | findstr /i "json-cyclic" >nul
if %errorlevel% neq 0 (
    npm install -g json-cyclic --silent
)

npm ls -g --depth=0 2>nul | findstr /i "axios" >nul
if %errorlevel% neq 0 (
    npm install -g axios --silent
)

if exist package.json (
    npm i --silent
)

python -m pip show requests >nul 2>nul
if %errorlevel% neq 0 (
    python -m pip install requests --quiet
)

python -m pip show tqdm >nul 2>nul
if %errorlevel% neq 0 (
    python -m pip install tqdm --quiet
)

echo.
title KittyRec Updater
echo Everything is checked and all required tools are installed.
echo.
echo Checking for updates...
pause
