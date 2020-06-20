process.env.UV_THREADPOOL_SIZE = 10;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
    https.request('https://google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log('Request:', Date.now() - start);
        });
    }).end();
}

function doHash(index) {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log(`Hash ${index}:`, Date.now() - start);
    });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
});

doHash(1);
doHash(2);
/* setTimeout(() => {
    console.log('timeout chilling');
}, 2000); */
// console.log('Just chilling 1');
doHash(3);
doHash(4);

// console.log('Just chilling 2');


/* 
 * Why is HTTP #1?
 *      It is an OS-specific function that doesnt give a fuck about the thread.
 * Why is the FS after the first hash
 *      Due to the "wait" that happens when the thread requests for access to the file from the HARD DRIVE, the OS Thread Scheduler frees up the thread pool to the idle hash function. Then after the first hash function is completed, the thread is freed for the FS to "continue"
 * ------------------
 * Why does the fs take so long
 *      There is a "wait period" during which the OS waits for 
 * FS & crypto modules make use of the thread pool
 * HTTP requests make use of the OS directly
 * 
 * Are there OS limitations on the maximum thread pool size? since increasing / decreasing will enable or disable queuing as deemed fit
*/