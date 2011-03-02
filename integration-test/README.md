# Integration test

Test runners for QUnit, either run in browser or command line

## In browser:
 * Open test-runner.html in a browser. Tests will run (and report on page) automatically.
 * Add new tests (and associated src) to html file directly
    
## On command line:
Use rhino to run test through test-runner.js:
    $ java -cp ../build-static/lib/build/js.jar org.mozilla.javascript.tools.shell.Main -opt -1 test-runner.js test-runner.html
(This just basically runs test-runner.html headlessly) 
    
## Or run the ant build:
    $ ant
With a different test runner:
    $ ant -Dtest.runner=./path/to/test-runner.html
    
### TODO:
 * Better reporting on command line (JUnit-style output)