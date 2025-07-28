@echo off
title Discord Guard Bot Başlatıcı
echo ================================
echo Discord Guard Bot Başlatılıyor...
echo ================================

:: Node.js kurulu mu kontrol et
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js yüklü değil. Lütfen https://nodejs.org adresinden indirip kur.
    pause
    exit /b
)

:: node_modules klasörü var mı?
IF NOT EXIST node_modules (
    echo Gerekli paketler yükleniyor...
    npm install discord.js @discordjs/voice advanced-logs chalk chillout cron dotenv moment, mongoose
) ELSE (
    echo Paketler zaten yuklu, atlanıyor...
)

:: index.js var mı?
IF EXIST index.js (
    echo Bot başlatılıyor...
    node index.js
) ELSE (
    echo index.js bulunamadı! Lütfen bot dosyasının dizininde olduğundan emin ol.
    pause
)

pause
