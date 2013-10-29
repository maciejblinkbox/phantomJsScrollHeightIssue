scrollHeight DOM element property holds out of date value
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

__Issue:__
While testing my application using PhantomJS 1.9.2 I realized that some tests are failing because scrollHeight DOM element property is not updated correctly.

Sequance of events is:
- page is loaded, height of div #foo is 128px, .clientHeight is 128px, .scrollHeight is 128px
- child element of #foo gets text changed from very short to quite long
- .scrollHeight is expected to be greater than 128px but the value is not refreshed

I can use remote debugger to step through the test and as soon as I modify #foo (which forces the browser to update the properties) scrollHeight starts to return correct value.

Issue only happens when the document is in 2 nested iframes ( I use this setup when running e2e tests through testswarm ).
The issue does not happen when I run the same test in 1 iframe (without second nested iframe).

I have put together jasmine unit test that reproduces this problem in PhantomJS 1.9.2, 1.9.1 and 1.8.2 (haven't tried any other versions). The test shows how the issue is not a problem with 1 iframe and is a problem in 2 nested iframes.

This issue has been raised on PhantomJS github project:
https://github.com/ariya/phantomjs/issues/11717
