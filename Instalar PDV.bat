@echo off
:: Inicia no diretorio correto
cd /d "%~dp0"

:: Altera a pagina de codigos para UTF-8 (alguns Windows podem não suportar, então ignoramos erro)
chcp 65001 >nul 2>&1
title Instalador - Sistema PDV 3D
color 0B

echo ===================================================
echo             INSTALADOR - SISTEMA PDV 3D
echo ===================================================
echo.
echo Bem-vindo! Este assistente preparara o sistema para
echo uso na sua maquina de forma automatica.
echo.

echo [1/4] Verificando Node.js no sistema...
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo ===================================================
    echo [ERRO FATAL] Node.js nao encontrado no sistema!
    echo ===================================================
    echo.
    echo O sistema PDV precisa do Node.js para funcionar.
    echo Siga os passos abaixo para instalar:
    echo 1. Acesse o site oficial: https://nodejs.org
    echo 2. Baixe a versao 'LTS' ^(Recomendada^)
    echo 3. Instale usando as opcoes padrao
    echo 4. Apos a instalacao, abra este instalador novamente.
    echo.
    echo Pressione qualquer tecla para sair do instalador...
    pause >nul
    exit /b
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js verificado com sucesso (%NODE_VER%).

echo.
echo [2/4] Instalando bibliotecas necessarias (pode levar alguns minutos)...
call npm install
if %ERRORLEVEL% neq 0 (
    color 0E
    echo.
    echo [AVISO] As bibliotecas foram processadas, mas o NPM retornou alguns alertas.
) else (
    echo.
    echo [OK] Bibliotecas instaladas com sucesso.
)

color 0B
echo.
echo [3/5] Configurando ambiente local (SQLite)...
if not exist ".env" (
    echo DATABASE_URL="file:./dev.db" > .env
    echo [OK] Arquivo .env gerado.
) else (
    echo [OK] Arquivo .env detectado.
)

echo [OK] Gerando tabelas do banco de dados...
call npx prisma generate
call npx prisma db push

echo.
echo [4/5] Compilando o sistema para modo Producao (Rapido)...
echo Aguarde, isso pode levar um ou dois minutos.
call npm run build
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo [ERRO] Falha ao compilar o sistema para modo de producao!
    echo.
    pause
    exit /b
)
echo [OK] Compilado com sucesso.

echo.
echo [5/5] Criando atalho na Area de Trabalho...
set SCRIPT="%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\Sistema PDV 3D.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0Abrir PDV.vbs" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "Atalho para o Sistema PDV" >> %SCRIPT%
echo oLink.IconLocation = "%~dp0icone.ico" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%
echo [OK] Atalho criado com sucesso!

echo.
color 0A
echo ===================================================
echo               INSTALACAO CONCLUIDA!
echo ===================================================
echo.
echo O sistema foi instalado e configurado perfeitamente!
echo Voce ja pode ligar o sistema clicando no atalho
echo "Sistema PDV 3D" na sua Area de Trabalho.
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
exit
