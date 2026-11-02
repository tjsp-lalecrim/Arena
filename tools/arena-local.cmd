@echo off
setlocal
rem Prefer the already installed Codex runtime; do not install or change nvm.
set "ARENA_DEV_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%ARENA_DEV_NODE%" goto run
node --version >nul 2>&1
if errorlevel 1 (
  echo Node.js funcional nao encontrado. Use Node.js 20 ou superior, sem alterar os saves.
  exit /b 1
)
set "ARENA_DEV_NODE=node"
:run
"%ARENA_DEV_NODE%" "%~dp0serve-dev.cjs" "%~1"
exit /b %errorlevel%
