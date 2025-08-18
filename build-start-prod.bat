@echo off
setlocal
set "ROOT=%~dp0"
set "SKIP_CLIENT="

REM ---- Parse args ----
:parseArgs
if "%~1"=="" goto run
if /I "%~1"=="--skip-client" set "SKIP_CLIENT=1" & shift & goto parseArgs
if /I "%~1"=="-sc"          set "SKIP_CLIENT=1" & shift & goto parseArgs

echo Unknown option: %~1
echo Usage: %~nx0 [--skip-client ^| -sc]
exit /b 1

:run
REM ---- Build client (optional) ----
if defined SKIP_CLIENT (
  echo [info] Skipping client build
) else (
  call npm --prefix "%ROOT%client" run build || goto :err
)

REM ---- Build + start server ----
call npm --prefix "%ROOT%server" run build || goto :err
call npm --prefix "%ROOT%server" run start:prod
goto :eof

:err
echo Build failed (errorlevel %errorlevel%).
exit /b %errorlevel%
