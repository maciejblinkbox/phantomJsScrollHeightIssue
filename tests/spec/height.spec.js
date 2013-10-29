(function(){
	var noop = function(){

		},
		getTopLevelDocument = function() {
			return document;
		};

	// create iframe and run all tests inside
	describe('1 iframe', function(){	
		createIframe(getTopLevelDocument, createTests, noop);
	});

	// create two nested iframes and run all tests inside
	describe('2 nested iframes', function(){
		var createInnerIframe = function(getDocumentFn, cleanupFn){
			createIframe(getDocumentFn, createTests, cleanupFn);
		};

		// create parent iframe
		createIframe(getTopLevelDocument, createInnerIframe, noop);
	});

	// create an iframe
	function createIframe(getParentDocumentFn, callback, parentCleanupFn){
		var doc;
		var iframe;

		var getDocumentFn = function() {		
			doc = getParentDocumentFn();	
			iframe = doc.createElement('iframe');
			iframe.style.width = '1400px';
			iframe.style.height = '1000px';			
			iframe.src = 'about:blank';
			doc.body.appendChild(iframe);
			return iframe.contentDocument;
		}

		var cleanupFn = function(){
			doc.body.removeChild(iframe);
			parentCleanupFn();
		}

		callback(getDocumentFn, cleanupFn);
	}

	// create tests in parent document
	function createTests(getDocumentFn, cleanupFn) {
		describe('long div tests', function(){

			var doc, 
				styleElements,
				// html for the test
				html = '<div id="layersContainer"><div id="assetDetailsSection"><div id="overview" test-id="synopsisBox" synopsis="viewModel.synopsis" cast="viewModel.cast" directors="viewModel.directors" studio="viewModel.studio" genres="viewModel.genres" entitlement="viewModel.entitlement" guidance="viewModel.guidance" transition-key="movieOverviewBox" class="ng-scope">    <div class="assetSynopsisContent slideFastTransition">                <div class="assetSynopsis" test-id="assetSynopsis">            <div class="assetText assetSynopsisText ng-binding">{{assetSynopsisText}}</div>        </div>        <div class="assetExtraDetails" test-id="assetExtraDetails">                        <div class="assetExtraDetail">                <span class="assetSynopsisLabel">Cast and Crew</span>                <span class="assetText ng-binding">{{castAndCrew}}</span>            </div>        </div>    </div></div></div></div>',
				// some text to replace
				dynamicText1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquet eu velit eu pellentesque. Donec et interdum orci, eu sagittis augue. Quisque dapibus massa ac mi tempus porttitor. Vivamus ac erat in turpis aliquam varius. Etiam nec est molestie, placerat leo vitae, auctor libero. In ac nulla id leo vehicula fermentum. Nullam eleifend dolor dapibus, egestas nunc a, iaculis felis. Sed adipiscing volutpat ligula et mollis. Quisque pellentesque libero non tempor convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquet eu velit eu pellentesque. Donec et interdum orci, eu sagittis augue. Quisque dapibus massa ac mi tempus porttitor. Vivamus ac erat in turpis aliquam varius. Etiam nec est molestie, placerat leo vitae, auctor libero. In ac nulla id leo vehicula fermentum. Nullam eleifend dolor dapibus, egestas nunc a, iaculis felis. Sed adipiscing volutpat ligula et mollis. Quisque pellentesque libero non tempor convallis.',
				dynamicText2 = 'Lorem ipsum dolor sit amet';

			beforeEach(function(){
				doc = getDocumentFn();

				var styles = [
					// inline
					'body {font-size: 16px;font-family: AvalonBook, Arial, sans-serif;color: #f4f4f4;background-color: black;margin: 0;width: 1280px;height: 720px;}#layersContainer {width: 1280px;height: 720px;overflow: hidden;position: relative;background-color: #0b1320;background-repeat: no-repeat;background-image: -webkit-gradient(radial, center center, 0, center center, 700, from(#1b3254), to(#080f19));background-image: -webkit-radial-gradient(center, ellipse farthest-corner, #1b3254 0%, #080f19 100%);background-image: -moz-radial-gradient(center, ellipse farthest-corner, #1b3254 0%, #080f19 100%);background-image: -o-radial-gradient(center, ellipse farthest-corner, #1b3254 0%, #080f19 100%);}#assetDetailsSection {background-color: #162944;margin: 0 -64px -69px -64px;padding: 0;border-bottom: 69px solid #0d192f;}#overview {position: relative;overflow: hidden;padding: 20px 82px 0 82px;z-index: 1;background: #162944;}#overview .assetSynopsisContent {height: 128px;}.slideFastTransition {position: relative;transition: top 0.5s,right 0.5s,bottom 0.5s,left 0.75s,height 0.5s;-moz-transition: top 0.5s,right 0.5s,bottom 0.5s,left 0.75s,height 0.5s;-webkit-transition: top 0.5s,right 0.5s,bottom 0.5s,left 0.75s,height 0.5s;-o-transition: top 0.5s,right 0.5s,bottom 0.5s,left 0.75s,height 0.5s;}#overview .assetSynopsis {width: 782px;padding-right: 22px;float: left;height: inherit;margin-bottom: 30px;}#overview .assetText {text-align: justify;line-height: 22px;}#overview .assetSynopsisText {white-space: pre-line;}#overview .assetExtraDetails {width: 282px;height: inherit;padding-left: 22px;float: left;margin-bottom: 30px;}#overview .assetExtraDetail {margin-bottom: 9px;}#overview .assetSynopsisLabel {text-transform: uppercase;color: #a8a8a8;}#overview .assetText {text-align: justify;line-height: 22px;}'
				];

				styleElements = [];

				for(var i = 0; i < styles.length; i++){
					var style = doc.createElement('style');
					style.type = 'text/css';
					style.innerText = styles[i];
					doc.head.appendChild(style);
					styleElements.push(style);
				}
			});

			afterEach(function(){
				doc.body.innerHTML = "";
				doc.body.style.width = '1300px';
				doc.body.style.height = '900px';			
				while(styleElements.length){
					var style = styleElements.pop();
					doc.head.removeChild(style);
				}
				cleanupFn();
			});

			// modifying the dom synchronously seems to work fine in any number of iframes
			it('dynamic synchronous content', function(){
				doc.body.innerHTML = html;	

				doc.querySelector('.assetSynopsisText').innerHTML = dynamicText1;
				doc.querySelector('.assetExtraDetail').children[1].innerHTML = dynamicText2;

				var synopsis = doc.querySelector('.assetSynopsisContent');
				console.log(synopsis.scrollHeight, synopsis.clientHeight);
				
				expect(synopsis.clientHeight).toBe(128);
				expect(synopsis.scrollHeight).toBeGreaterThan(synopsis.clientHeight);	
			});

			// modifying the dom asynchronously seems to be buggy when test runs in second nested iframe
			it('dynamic asynchronous content - BUG on phantomJs 1.9.2', function(){
				// populate the body of the iframe with some html
				doc.body.innerHTML = html;	
				
				// wait some time
				// https://github.com/pivotal/jasmine/wiki/Asynchronous-specs
				waits(100);	

				runs(function(){
					// set some text
					doc.querySelector('.assetSynopsisText').innerHTML = dynamicText1;
					doc.querySelector('.assetExtraDetail').children[1].innerHTML = dynamicText2;
					
					var synopsis = doc.querySelector('.assetSynopsisContent');
					console.log(synopsis.scrollHeight, synopsis.clientHeight);
					
					// scroll height is expected to be greater than client height
					expect(synopsis.clientHeight).toBe(128);
					expect(synopsis.scrollHeight).toBeGreaterThan(synopsis.clientHeight);	
				});
			});
		});
	}
})();