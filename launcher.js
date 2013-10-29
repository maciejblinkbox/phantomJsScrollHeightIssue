(function() {
  var args = require('system').args;

  if (args.length !== 2) {
      console.log('Usage: launcher.js URL');
      return;
  }

  url = args[1];

  console.log('url', url);

  var page = require('webpage').create();

  page.viewportSize = { width: 1600, height: 1200 };

  page.onConsoleMessage = function(msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
  };

  page.onLoadFinished = function(status) {
      console.log('onLoadFinished');
      takeScreenshot('onLoadFinished');
  };

  function takeScreenshot(name){
    var now = new Date();
    var filename = 'screenshots\\screenshot-' + name + '-' + now.getTime() + '.png';
    console.log('taking a screenshot', filename);
    page.render(filename);    
  }

  page.onError = function(msg, trace) {
      var msgStack = ['ERROR: ' + msg];
      if (trace && trace.length) {
          msgStack.push('TRACE:');
          trace.forEach(function(t) {
              msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
          });
      }
      console.error('error:');
      console.error(msgStack.join('\n'));
  };

  page.onCallback = function(data) {
      console.log(data);

      switch(data.action){
        case 'screenshot':
          takeScreenshot(data.name);
          break;
        case 'exit':
          console.log('exit');
          takeScreenshot('exiting');

          window.setTimeout(function(){
            phantom.exit();  
          }, 2000);        
          break;
        default:
          console.log('unknown action', data);
          break;
      }
  };

  page.open(url);

  //window.setInterval(takeScreenshot, 500);
}) ();