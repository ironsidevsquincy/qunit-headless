module('JUnit');

test('Should be able to instantiate', function(){
    var jUnit = new uk.co.darrenhurley.logger.JUnit();
    ok(jUnit, 'Shouldn\'t be a false value');
});

test('Should have default line writer', function(){
    var jUnit = new uk.co.darrenhurley.logger.JUnit();
    strictEqual(print, jUnit.lineWriter, 'Default line writer should be \'print\'');
});

test('Should be able to set line writer', function(){
    var lineWriter = function(){};
    var jUnit = new uk.co.darrenhurley.logger.JUnit(lineWriter);
    strictEqual(lineWriter, jUnit.lineWriter, 'Line writer should be supplied value');
});

module('JUnit.startTestSuite');

var suites = [
    {
        name: 'suiteOne',
        failed: 0,
        passed: 1,
        total: 1
    }
];

for(var i in suites){
 test('Should be able to start a test suite [#' + i + ']', function(){
     var jUnit = new uk.co.darrenhurley.logger.JUnit();
     var suite = suites[i];
     jUnit.startTestSuite(suite);
     var expectedSuite = {
         name: suite.name,
         tests: []
     };
     deepEqual(expectedSuite, jUnit.suites[0], 'Has not started suite correctly');
 });
}

test('Should throw error if no suite given', function(){
 var jUnit = new uk.co.darrenhurley.logger.JUnit();
 raises(function(){
     jUnit.startTestSuite();
 }, 'Should have thrown an error when no suite name was supplied');
});

module('JUnit.endTestSuite');

for(var j in suites){
 test('Should be able to end a test suite [#' + j + ']', function(){
     var jUnit = new uk.co.darrenhurley.logger.JUnit();
     var suite = suites[j];
     jUnit.startTestSuite(suite);
     jUnit.endTestSuite(suite);
     var expectedSuite = suite;
     suite.tests = [];
     deepEqual(expectedSuite, jUnit.suites[0], 'Has not ended suite correctly');
 });
}

test('Should throw error if no suite given', function(){
 var jUnit = new uk.co.darrenhurley.logger.JUnit();
 // use first suite
 jUnit.startTestSuite(suites[0]);
 raises(function(){
     jUnit.endTestSuite();
 }, 'Should have thrown an error when no suite name was supplied');
});

module('JUnit.startTest');

var tests = [
    {
        name: 'testOne'
    }
];

for(var k in tests){
    test('Should be able to start a test [#' + k + ']', function(){
        var jUnit = new uk.co.darrenhurley.logger.JUnit();
        // take the first suite name
        jUnit.startTestSuite(suites[0]);
        var test = tests[k];
        jUnit.startTest(test)
        var expectedTest = {
            name: test.name,
            assertions: []
        };
        deepEqual(expectedTest, jUnit.suites[0].tests[0], 'Test not started correctly');
    });
}

test('Should throw error if no test given', function(){
    var jUnit = new uk.co.darrenhurley.logger.JUnit();
    // take the first suite name
    jUnit.startTestSuite(suites[0]);
    raises(function(){
        jUnit.addTest();
    }, 'Should have thrown an error when no test supplied');
});

module('JUnit.endTest');

for(var l in tests){
    test('Should be able to end a test [#' + l + ']', function(){
        var jUnit = new uk.co.darrenhurley.logger.JUnit();
        // take the first suite name
        jUnit.startTestSuite(suites[0]);
        var test = tests[l];
        jUnit.startTest(test);
        jUnit.endTest(test);
        var expectedTest = test;
        expectedTest.assertions = [];
        deepEqual(expectedTest, jUnit.suites[0].tests[0], 'Test not ended correctly');
    });
}

test('Should throw error if no test given', function(){
    var jUnit = new uk.co.darrenhurley.logger.JUnit();
    // take the first suite name
    jUnit.startTestSuite(suites[0]);
    jUnit.startTest(tests[0]);
    raises(function(){
        jUnit.endTest();
    }, 'Should have thrown an error when no test supplied');
});

module('JUnit.addAssertions');

var assertions = [
    {
        result: false,
        message: 'Failed'
    }
];

for(var m in assertions){
    test('Should be able to add an assertion [#' + m + ']', function(){
        var jUnit = new uk.co.darrenhurley.logger.JUnit();
        // take the first suite name
        jUnit.startTestSuite(suites[0]);
        // and first test
        jUnit.startTest(tests[0]);
        var assertion = assertions[m];
        jUnit.addAssertion(assertions[m]);
        deepEqual(assertion, jUnit.suites[0].tests[0].assertions[0], 'Assertion not add correctly');
    });
}

test('Should throw error if no assertion given', function(){
    var jUnit = new uk.co.darrenhurley.logger.JUnit();
    // take the first suite name
    jUnit.startTestSuite(suites[0]);
    jUnit.startTest(tests[0]);
    raises(function(){
        jUnit.addAssertions();
    }, 'Should have thrown an error when no assertion supplied');
});


module('JUnit.write');

var outputs = [
 [
     [
         {
             name: 'suiteOne',
             passed: 1,
             failed: 1,
             total: 2,
             tests: [
                {
                    name: 'testOne',
                    assertions: [
                        {
                            result: true
                        }
                    ]
                },
                {
                    name: 'testTwo',
                    assertions: [
                        {
                            result: false,
                            message: 'Failed!!!'
                        }
                    ]
                }
             ]
         }
     ],
     [
         '<?xml version="1.0" encoding="UTF-8"?>',
         '<testsuites>',
         '    <testsuite errors="0" failures="1" name="suiteOne" tests="2">',
         '        <testcase name="testOne">',
         '        </testcase>',
         '        <testcase name="testTwo">',
         '            <failure message="Failed!!!" type="failed" />',
         '        </testcase>',
         '    </testsuite>',
         '</testsuites>'
     ]
 ]
];

for(var n in outputs){
    test('Should write xml correctly [#' + n + ']', function(){
        var config          = outputs[n][0],
            xml             = outputs[n][1],
            lineWriterCount = 0;
        // how many assertions to we expect
        expect(xml.length);
        // use our own line writer
        var jUnit = new uk.co.darrenhurley.logger.JUnit(function(line){
            equal(line, xml[lineWriterCount++], 'Should output correct line');
        });
        // add the suites and tests
        for(var i in config){
            var suite = config[i];
            jUnit.startTestSuite(suite);
            for(var j in suite.tests){
                var test = suite.tests[j];
                jUnit.startTest(test);
                for(var k in test.assertions){
                    jUnit.addAssertion(test.assertions[k]);
                }
                jUnit.endTest(test);
            }
            jUnit.endTestSuite(suite);
        }    
        // write out the log
        jUnit.write();
    });
}