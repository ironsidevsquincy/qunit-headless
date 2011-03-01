// use EnvJS to load js in test runner
load('../lib/env.rhino.1.2.js');

// use our junit logging
load('../dist/junit-logger-min.js');

// write to a file
var fstream = new java.io.FileWriter(arguments[1] + '/TEST-junit.xml');
var out = new java.io.BufferedWriter(fstream);

var lineWriter = function(line){
    out.write(line + '\n');
}

// create a new logger
var logger = new uk.co.darrenhurley.logger.JUnit(lineWriter);

Envjs({
    scriptTypes: {
        '': true, //anonymous and inline
        'text/javascript': true
    },
    afterScriptLoad:{
        'qunit': function(script){
	    	QUnit.init();
	    	QUnit.config.blocking = false;
	    	QUnit.config.autorun = true;
	    	QUnit.config.updateRate = 0;
	    	
	    	// override logging
	    	QUnit.moduleStart = function(obj){
	    	    logger.addSuite(obj.name);
	    	};
	    	QUnit.log = function(obj){
                // Envjs.log('{' + module + '}(' + testCount++ + ')[' + (obj.result ? 'PASS' : 'FAIL' ) + ']' + (obj.message ? ' ' + obj.message : ''));
	    	};
	    	QUnit.testDone = function(obj){
	    	    logger.addTest(obj.name, !obj.failed);
	    	};
        }
    }
});

window.location = arguments[0];

// write to the log
logger.write();
//Close the output stream
out.close();

// if there are failures, exit with a non-zero result
if(errors = QUnit.config.stats.bad){
	Envjs.log();
	Envjs.log('--------------------------------------------')
	Envjs.log('--- Build failed - There were ' + errors + ' error(s) ---')
	Envjs.log('--------------------------------------------')
	Envjs.log();
	quit(1);
}