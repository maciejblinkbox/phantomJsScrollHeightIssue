phantomJsScrollHeightIssue
==========================

This repo contains jasmine tests that reproduce .scrollHeight issue on PhantomJS.

scrollHeight DOM object property is not updated with the correct value when certain conditions occour:
* test needs to run in 2 nested iframes. Same test passes when it is executed in 1 iframe.
* html is not trivial

__Files in the project:__

* /tests/SpecRunner.html - Jasmine spec runner, you can run this in any PhantomJS or Chrome or other browsers (not tested)
* /tests/height.spec.js - the actual test that reproduces the problem

* /phantomjs-1.8.2-windows - directory holds phantomjs-1.8.2 browser for windows
* /phantomjs-1.9.1-windows - directory holds phantomjs-1.9.1 browser for windows
* /phantomjs-1.9.2-windows - directory holds phantomjs-1.9.2 browser for windows

* /start.bat - runs the tests on phantomjs-1.9.2 with debugging enabled
* /launcher.js - start document for phantomjs. this allows jasmine test runner to take screenshots during execution (after each test is finished)
* /screenshots - directory holds screenshots from last execution. *.png files are ignored by this repo

* /screenshot-exiting-1383057641030.png sample failure
