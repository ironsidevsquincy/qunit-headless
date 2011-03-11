var uk=uk||{};uk.co=uk.co||{};uk.co.darrenhurley=uk.co.darrenhurley||{};uk.co.darrenhurley.logger=uk.co.darrenhurley.logger||{};uk.co.darrenhurley.logger.JUnit=function(a){this.lineWriter=a||print;this.suites=[];this.tabSize=4;this.currentTestSuite=undefined;this.currentTestSuiteTime=undefined;this.currentTest=undefined;this.currentTestTime=undefined;};uk.co.darrenhurley.logger.JUnit.getTime=function(){return new Date().getTime();};uk.co.darrenhurley.logger.JUnit.prototype.startTestSuite=function(a){if(!a){throw"No suite supplied";}this.currentTestSuite={name:a.name,tests:[]};this.suites.push(this.currentTestSuite);this.currentTestSuiteTime=uk.co.darrenhurley.logger.JUnit.getTime();};uk.co.darrenhurley.logger.JUnit.prototype.endTestSuite=function(a){if(!a){throw"No suite supplied";}if(!this.currentTestSuite){throw"Call startTestSuite first";}this.currentTestSuite.failed=a.failed;this.currentTestSuite.passed=a.passed;this.currentTestSuite.time=(uk.co.darrenhurley.logger.JUnit.getTime()-this.currentTestSuiteTime)/1000;this.currentTestSuite=undefined;};uk.co.darrenhurley.logger.JUnit.prototype.startTest=function(a){if(!a){throw"No test supplied";}this.currentTest={name:a.name,assertions:[]};this.currentTestSuite.tests.push(this.currentTest);this.currentTestTime=uk.co.darrenhurley.logger.JUnit.getTime();};uk.co.darrenhurley.logger.JUnit.prototype.endTest=function(a){if(!a){throw"No test supplied";}if(!this.currentTest){throw"Call startTest first";}this.currentTest.time=(uk.co.darrenhurley.logger.JUnit.getTime()-this.currentTestTime)/1000;this.currentTest=undefined;};uk.co.darrenhurley.logger.JUnit.prototype.addAssertion=function(a){if(!a){throw"No assertion supplied";}if(!this.currentTest){throw"Call startTest first";}this.currentTest.assertions.push(a);};uk.co.darrenhurley.logger.JUnit.prototype.write=function(){var d,c,b,e,h,a,g;this.lineWriter('<?xml version="1.0" encoding="UTF-8"?>');this.lineWriter("<testsuites>");for(d in this.suites){e=this.suites[d];this.lineWriter(new Array(this.tabSize+1).join(" ")+'<testsuite errors="0" failures="'+e.failed+'" name="'+e.name+'" tests="'+e.tests.length+'" time="'+e.time+'">');for(c in e.tests){h=e.tests[c];var f=new Array((2*this.tabSize)+1).join(" ")+'<testcase name="'+h.name+'" assertions="'+h.assertions.length+'" time="'+h.time+'"';g=false;for(b in h.assertions){a=h.assertions[b];if(!a.result){if(!g){this.lineWriter(f+">");}this.lineWriter(new Array((3*this.tabSize)+1).join(" ")+'<failure message="'+a.message+'" type="failed" />');g=true;}}if(!g){this.lineWriter(f+" />");}else{this.lineWriter(new Array((2*this.tabSize)+1).join(" ")+"</testcase>");}}this.lineWriter(new Array(this.tabSize+1).join(" ")+"</testsuite>");}this.lineWriter("</testsuites>");};