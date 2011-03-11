var uk = uk || {};
uk.co = uk.co || {};
uk.co.darrenhurley = uk.co.darrenhurley || {};
uk.co.darrenhurley.logger = uk.co.darrenhurley.logger || {};
uk.co.darrenhurley.logger.JUnit = function(lineWriter){
	
	// use print method to wite lines by default
	this.lineWriter = lineWriter || print;
	this.suites = [];
	this.tabSize = 4;
	
};

uk.co.darrenhurley.logger.JUnit.prototype.startTestSuite = function(suite){
	if(!suite) throw 'No suite supplied';
	this.suites.push({
	    name: suite.name,
	    tests: []
	});
};

uk.co.darrenhurley.logger.JUnit.prototype.endTestSuite = function(suite){
	if(!suite) throw 'No suite supplied';
	// get current suite
	var currentSuite = this.suites[this.suites.length - 1];
	currentSuite.failed = suite.failed;
	currentSuite.passed = suite.passed;
	currentSuite.total  = suite.total;
};

uk.co.darrenhurley.logger.JUnit.prototype.startTest = function(test){
	if(!test) throw 'No test supplied';
	// get current suite
    this.suites[this.suites.length - 1].tests.push({
        name: test.name,
        assertions: []
    });
};

uk.co.darrenhurley.logger.JUnit.prototype.endTest = function(test){
	if(!test) throw 'No test supplied';
};

uk.co.darrenhurley.logger.JUnit.prototype.addAssertion = function(assertion){
	if(!assertion) throw 'No assertion supplied';
	// get current test
	var currentSuite = this.suites[this.suites.length - 1];
	currentSuite.tests[currentSuite.tests.length - 1].assertions.push(assertion);
};

uk.co.darrenhurley.logger.JUnit.prototype.write = function(){
    
	// print header
    this.lineWriter('<?xml version="1.0" encoding="UTF-8">');
    this.lineWriter('<testsuites>');
    
    // print each testsuite
    for(var i in this.suites){
        var suite         = this.suites[i];
        this.lineWriter(new Array(this.tabSize + 1).join(' ') + '<testsuite errors="0" failures="' + suite.failed + '" name="' + suite.name + '" tests="' + suite.total + '">');
        // print the tests in the testsuite
        for(j in suite.tests){
            var test = suite.tests[j];
            this.lineWriter(new Array((2 * this.tabSize) + 1).join(' ') + '<testcase name="' + test.name + '">');
            for(var k in test.assertions){
                var assertion = test.assertions[k];
                if(!assertion.result){
                    this.lineWriter(new Array((3 * this.tabSize) + 1).join(' ') + '<failure message="' + assertion.message + '" type="failed" />');
                }
            }
            this.lineWriter(new Array((2 * this.tabSize) + 1).join(' ') + '</testcase>');
        }
        this.lineWriter(new Array(this.tabSize + 1).join(' ') + '</testsuite>')
    }
    
    this.lineWriter('</testsuites>');
	
};
