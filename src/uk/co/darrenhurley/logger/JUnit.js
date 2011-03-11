uk.co.darrenhurley.logger.JUnit = function(lineWriter){
	
	// use print method to wite lines by default
	this.lineWriter = lineWriter || print;
	this.suites = [];
	this.tabSize = 4;
	this.currentTestSuite = undefined;
	this.currentTestSuiteTime = undefined;
	this.currentTest = undefined;
	this.currentTestTime = undefined;
	
};

uk.co.darrenhurley.logger.JUnit.getTime = function(){
    return new Date().getTime();
};

uk.co.darrenhurley.logger.JUnit.prototype.startTestSuite = function(suite){
	if(!suite) throw 'No suite supplied';
	this.currentTestSuite = {
	    name: suite.name,
	    tests: []
	};
	this.suites.push(this.currentTestSuite);
	this.currentTestSuiteTime = uk.co.darrenhurley.logger.JUnit.getTime();
};

uk.co.darrenhurley.logger.JUnit.prototype.endTestSuite = function(suite){
	if(!suite) throw 'No suite supplied';
	// get current suite
	if(!this.currentTestSuite) throw 'Call startTestSuite first';
	this.currentTestSuite.failed = suite.failed;
	this.currentTestSuite.passed = suite.passed;
	this.currentTestSuite.time   = (uk.co.darrenhurley.logger.JUnit.getTime() - this.currentTestSuiteTime) / 1000;
	this.currentTestSuite = undefined;
};

uk.co.darrenhurley.logger.JUnit.prototype.startTest = function(test){
	if(!test) throw 'No test supplied';
	// store this as current test
	this.currentTest = {
        name: test.name,
        assertions: []
    };
    this.currentTestSuite.tests.push(this.currentTest);
	this.currentTestTime = uk.co.darrenhurley.logger.JUnit.getTime();
};

uk.co.darrenhurley.logger.JUnit.prototype.endTest = function(test){
	if(!test) throw 'No test supplied';
	if(!this.currentTest) throw 'Call startTest first';
	this.currentTest.time = (uk.co.darrenhurley.logger.JUnit.getTime() - this.currentTestTime) / 1000;
	this.currentTest      = undefined;
};

uk.co.darrenhurley.logger.JUnit.prototype.addAssertion = function(assertion){
	if(!assertion) throw 'No assertion supplied';
	// get current test
	if(!this.currentTest) throw 'Call startTest first';
	this.currentTest.assertions.push(assertion);
};

uk.co.darrenhurley.logger.JUnit.prototype.write = function(){
    
    var i, j, k, suite, test, assertion, testCaseFailed, testCaseElement;
    
	// print header
    this.lineWriter('<?xml version="1.0" encoding="UTF-8"?>');
    this.lineWriter('<testsuites>');
    
    // print each testsuite
    for(i in this.suites){
        suite = this.suites[i];
        // write out the opening testsuite element
        this.lineWriter(new Array(this.tabSize + 1).join(' ') + '<testsuite name="' + suite.name + '" errors="0" failures="' + suite.failed + '" tests="' + suite.tests.length + '" time="' + suite.time + '">');
        // print the tests in the testsuite
        for(j in suite.tests){
            test = suite.tests[j];
            testCaseElement = new Array((2 * this.tabSize) + 1).join(' ') + '<testcase name="' + test.name + '" assertions="' + test.assertions.length + '" time="' +  test.time + '"';
            testCaseFailed = false;
            for(k in test.assertions){
                assertion = test.assertions[k];
                if(!assertion.result){
                    if(!testCaseFailed){
                        this.lineWriter(testCaseElement + '>');
                    }
                    this.lineWriter(new Array((3 * this.tabSize) + 1).join(' ') + '<failure message="' + assertion.message + '" type="failed" />');
                    testCaseFailed = true;
                }
            }
            if(!testCaseFailed){
                this.lineWriter(testCaseElement + ' />');
            }
            else{
                this.lineWriter(new Array((2 * this.tabSize) + 1).join(' ') + '</testcase>');
            }
        }
        this.lineWriter(new Array(this.tabSize + 1).join(' ') + '</testsuite>')
    }
    
    this.lineWriter('</testsuites>');
	
};