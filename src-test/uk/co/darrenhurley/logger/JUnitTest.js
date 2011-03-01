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

module('JUnit.addSuite');

var suiteNames = ['foo'];

for(var i in suiteNames){
	
	test('Should be able to add a suite [#' + i + ']', function(){
		var jUnit = new uk.co.darrenhurley.logger.JUnit();
		var suiteName = suiteNames[i];
		jUnit.addSuite(suiteName);
		strictEqual(suiteName, jUnit.currentSuite, 'Should have set current suite to \'' + suiteName + '\'');
		deepEqual({}, jUnit.suites[suiteName], 'Should have stored an empty object against the suite name');
	});
	
}

test('Should throw error if no name given', function(){
	var jUnit = new uk.co.darrenhurley.logger.JUnit();
	raises(function(){
		jUnit.addSuite();
	}, 'Should have thrown an error when no suite name was supplied');
});

module('JUnit.addTest');

var tests = [
	['bar_one', true, ''],
	['bar_two', false, 'A message'],
];

for(var j in tests){

	test('Should be able to add a test [#' + j + ']', function(){
		var jUnit = new uk.co.darrenhurley.logger.JUnit();
		// take the first suite name
		var suiteName = suiteNames[0];
		jUnit.addSuite(suiteName);
		jUnit.addTest(tests[j][0], tests[j][1], tests[j][2])
		strictEqual(tests[j][1], jUnit.suites[suiteName][tests[j][0]].result);
		strictEqual(tests[j][2], jUnit.suites[suiteName][tests[j][0]].message);
	});

}

test('Should throw error if no name given', function(){
	var jUnit = new uk.co.darrenhurley.logger.JUnit();
	// take the first suite name
	var suiteName = suiteNames[0];
	jUnit.addSuite(suiteName);
	raises(function(){
		jUnit.addTest();
	}, 'Should have thrown an error when no test name was supplied');
});

module('JUnit.write');

var suites = [
	[
		{
		    'suite_one': [
			    ['test_one', true],
			    ['test_two', false, 'A message']
		    ]
	    },
	    [
            '<?xml version="1.0" encoding="UTF-8">',
            '<testsuites>',
	        '   <testsuite errors="0" failures="1" name="suite_one" tests="2">',
    	    '       <testcase name="test_one" />',
    	    '       <testcase name="test_two">',
    	    '           <failure message="A message" type="failed" />',
    	    '       </testcase>',
    	    '   </testsuite>',
    	    '</testsuites>'
	    ]
	]
];

for(var k in suites){

	test('Should write xml correctly [#' + k + ']', function(){
	    // how many assertions are we expecting
	    var expectCount = 0
	        i           = 0;
	    while(suites[i]){
	        expectCount += suites[i++][1].length;
	    }
	    expect(expectCount);
        // add the suites and tests
        for(var suiteName in suites[k][0]){
    	    var lineWriterCount = 0;
    	    // use our own line writer
            var jUnit = new uk.co.darrenhurley.logger.JUnit(function(line){
                equal(line, suites[k][1][lineWriterCount++], 'Should output correct line');
            });
            jUnit.addSuite(suiteName);
            var suite = suites[k][0][suiteName];
            for(var m in suite){
                var test = suite[m];
                jUnit.addTest(test[0], test[1], test[2])
            }
            // write out the log
            jUnit.write();
        }
	});

}