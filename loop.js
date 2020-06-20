// node faker.js

// LIFO Queue
const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// new timers, tasks and operations are recorded from myFile
myFile.runContents();

/* 
 * @return Boolean
 * checks if event loop should run, and returns true/false if 
*/
function shouldContinue() {
    // Check 1: checks if there are any pending setTimeout, setInterval, setImmediate functions
    // Check 2: if any OS-related tasks [HTTP server listening to port]
    // Check 3: long-running operations (e.g. reading files through fs module)
    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// entire body executes in one 'tick'
while (shouldContinue()) {
    // 1. node looks at pendingTimers, 
    // and checks if their callback functions are ready to be called 
    // (e.g if milliseconds have elapsed in setTimeout)

    // 2. node looks at pendingOSTasks and pendingOperations, 
    // and checks if their callback functions are ready to be called

    // 3. Pause execution of the event loop. Continues when
    // pendingOSTask is done
    // pendingOperation is done - thread pool tasks
    // a timer is about to complete

    // 4. Look at pendingTimers. Call any setImmediate

    // 5. Handle any 'close' events, from event emitters e.g. readStream
}


// exit back to term