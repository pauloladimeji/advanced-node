const crypto = require('crypto');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

process.env.UV_THREADPOOL_SIZE = 1;

function doWork(duration) {
    const start = Date.now();
    while(Date.now() - start < duration) {}
}

// is the file being executed in master mode?
if(cluster.isMaster) {

    let numReqs = 0;
    let timeout;
    /* setInterval(() => {
        console.log(`numReqs = ${numReqs}`);
    }, 1000); */
    
    // cause index.js to be executed again but in child mode
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    for (const id in cluster.workers) {
        if (cluster.workers.hasOwnProperty(id)) {
            const worker = cluster.workers[id];
            
            worker.on('online', (address) => {
                numReqs += 1;            
            });
            worker.on('listening', (address) => {
                numReqs += 1;            
            });
            worker.on('message', (message) => {
                // numReqs += 1;
                worker.send(`${worker.id}`);
                console.log(`msg from worker => ${message}`);
            });
            
            /* timeout = setTimeout(() => {
                worker.disconnect();
            }, 3000); */
            worker.on('disconnect', () => {
                numReqs -= 1;
                console.log(`worker ${worker.id} disconnected`);
                console.log(worker.exitedAfterDisconnect);
                // clearTimeout(timeout);
            });
        }
    }
    cluster.on('message', (message) => {
        // console.log(message);
    })
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.id} disconnected`);
        console.log(worker.exitedAfterDisconnect);
        cluster.fork();
    })
} else {
    // im a child, i;m going to act like a server
    const express = require('express');
    const app = express();

    app.get('/', (req, res) => {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            process.send('long req from worker');
            res.send(`Hi there`);
        });
        // res.send('Hi there');
    });

    app.get('/fast', (req, res) => {
        process.send('short req from worker');
        res.send('This was fast');
    });

    process.send('some kinda message');

    process.on('message', (message) => {
        console.log(`from cluster to worker ${message}`);
    })

    app.listen(3000);
}