var uk = uk || {};
uk.co = uk.co || {};
uk.co.darrenhurley = uk.co.darrenhurley || {};
uk.co.darrenhurley.logger = uk.co.darrenhurley.logger || {};
uk.co.darrenhurley.logger.JUnit = function(lineWriter){
	
	// use print method to wite lines by default
	this.lineWriter = lineWriter || print;
	this.suites = {};
	this.currentSuite = '';
	this.tabSize = 4;
	
};

uk.co.darrenhurley.logger.JUnit.prototype.addSuite = function(name){
	
	if(!name) throw 'No suite name supplied';
	this.suites[name] = {};
	this.currentSuite = name;
	
};

uk.co.darrenhurley.logger.JUnit.prototype.addTest = function(name, result, message){

	if(!name) throw 'No test name supplied';
	this.suites[this.currentSuite][name] = {
		result: result,
		message: message
	};

};

uk.co.darrenhurley.logger.JUnit.prototype.write = function(){
    
	// print header
    this.lineWriter('<?xml version="1.0" encoding="UTF-8">');
    this.lineWriter('<testsuites>');
    
    // print each testsuite
    for(var suiteName in this.suites){
        var suite         = this.suites[suiteName],
            failuresCount = 0,
            testsCount    = 0,
            i             = 0;
        for(testName in suite){
            testsCount++
            if(!suite[testName].result) failuresCount++;
        }
        this.lineWriter(new Array(this.tabSize).join(' ') + '<testsuite errors="0" failures="' + failuresCount + '" name="' + suiteName + '" tests="' + testsCount + '">');
        // print the tests in the testsuite
        for(testName in suite){
            var test = suite[testName]
            if(test.result){
                this.lineWriter(new Array(2 * this.tabSize).join(' ') + '<testcase name="' + testName + '" />');
            }
            else{
                this.lineWriter(new Array(2 * this.tabSize).join(' ') + '<testcase name="' + testName + '">');
                this.lineWriter(new Array(3 * this.tabSize).join(' ') + '<failure message="' + test.message + '" type="failed" />');
                this.lineWriter(new Array(2 * this.tabSize).join(' ') + '</testcase>');
            }
        }
        this.lineWriter(new Array(this.tabSize).join(' ') + '</testsuite>')
    }
    
    this.lineWriter('</testsuites>');
	
};
