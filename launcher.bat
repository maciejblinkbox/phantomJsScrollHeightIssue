@echo off

if "%1"=="" goto usage
if "%2"=="" goto usage

goto run

:usage
echo.
echo Usage:
echo %0 phantomJsVersion url
echo.
goto :end

:run

set phantomJsVersion=%1
set url=%2
echo PhantomJs version=%phantomJsVersion%
echo url=%url%

set phantomjs=%phantomJsVersion%\phantomjs.exe
set launcher=launcher.js

set params=--remote-debugger-port=9000 --remote-debugger-autorun=yes --ignore-ssl-errors=yes --web-security=no
set phantomJsCmd=%phantomjs% %params% %launcher% %url%

set chrome="C:\Users\maciej\AppData\Local\Google\Chrome\Application\chrome.exe"
set debuggerCmd=start %chrome% http://localhost:9000

echo delete previous screenshots:
del screenshots\screenshot-*.png
echo.

echo starting debugger: %debuggerCmd%
%debuggerCmd%
echo.

echo starting phantomjs: %phantomJsCmd%
%phantomJsCmd%
echo.

echo Done!
pause

:end