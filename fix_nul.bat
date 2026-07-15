@echo off
title Windows Null Device Repair Tool
echo ===================================================
echo   DIAGNOSING AND REPAIRING WINDOWS NULL DEVICE
echo ===================================================
echo.

echo Checking administrative status...
echo (If you see access denied errors below, please right-click this file and run as Administrator)
echo.

echo [1/3] Checking the status of the Null driver service...
sc query Null
echo.

echo [2/3] Configuring the Null driver to start automatically...
sc config Null start= system
echo.

echo [3/3] Starting the Null driver service...
sc start Null
echo.

echo ===================================================
echo   Null device repair commands completed.
echo   Please restart the Antigravity IDE and try again!
echo ===================================================
echo.
pause
