# Advanced Node

## Ch1: Node Internals

NodeJs has collection of dependencies. Common deps include V8 + libuv.
V8 allows execution of JS code outside browser.
libuv is a C++ lib that gives access to underlying filesystem, networking and concurrency in system.

V8 - JS code
libuv - underlying system

Node provides modules - wrappers for functionality provided by (mostly) libuv

C++ specific code lives in the src folder of node

The v8 engine imports JS keywords, functions and methods and converts them into their C++ equivalent

e.g.

``
using v8::Array;
using v8::ArrayBufferView;
using v8::Boolean;
``

### Threads

A process is an instance of a program running on a PC. A process has multiple threads. A thread is a queue of instructions being executed by the CPU (running in a queue).

The OS schedules which threads to run at specific periods. It prioritizes urgent threads while queuing up less critical threads.

#### We can increase the number of threads being run through several ways, including

- Adding more cores (Quad-core CPU) = more threads being run (or using multi-threading).

- Using the scheduler to detect thread inactivity (during time-consuming I/O activity - reading from a disk, DB) and running a less time-consuming thread during this period

### The Event Loop

Some articles discuss how I/O operations run in parallel (asynchronously), while CPU-intensive operations are synchronous and "block" the event loop.

No proof of this, but I believe the OS scheduler delegation of I/O threads is what enables the parallelism / asynchronity.

So setTimeout ops, I/O ops, http calls, etc (asynchronous operations) are placed at the bottom of the call stack, and run only when other synchronous operations are done.

BUT CPU operations are synchronous and WILL block the event loop, so we need to make sure we never block it. using promises and "async/await" can be seen as a way to sort of "block" the loop. therefore, these operations should NEVER be expensive (see StackOverflow)

How about HTTP calls like media streaming?

Some articles on async JS & event loop

- [https://flaviocopes.com/node-event-loop/](NodeJS Event Loop)
- [https://blog.bitsrc.io/understanding-asynchronous-javascript-the-event-loop-74cd408419ff](Understanding Async JS)
- [http://latentflip.com/loupe/](Philip Robert's Event Loop Viz)

### Single-Threadedness of Node

Event Loop -> Single Threaded
however, some parts of Node's standard libraries are multi-threaded.

e.g. the `pbkdf2()` method in the crypto library

Node's C++ libraries (through libuv) perform "computationally intensive operations" on the OS using the Thread Pool, e.g. hashing, fs module functions, and others, depending on the OS. This Thread Pool runs 4 threads in parallel.

Thread pool size is customizable through `process.env.UV_THREADPOOL_SIZE` constant.

### How Node Handles Network Requests

Node's standard libraries makes use of the OS's async helpers through libuv. The OS has capabilities for asynchronously handling multiple network requests at a time. libuv just gives access to these capabilities by delegating the task to the Operating System.

This leads to non-blocking code through HTTP requests.

The event loop iterates through the OS tasks stack and checks if any pending network requests have been completed.

## Ch.2: Enhancing Node Performance

Node is not multi-threaded, but using it in 'cluster' mode runs multiple instances of the NodeJS runtime which communicate with each other, thus giving the impression of running multi threads.

Worker Threads: make use of libuv's thread pool to perform resource intensive tasks

Cluster mode is more stable, while worker threads are experimental (even in 2020?)

Nodemon by default does not work well with clustering (why?)

Long running processes block the event loop (which runs on a single thread). As we've explained before, generally  http calls run on the event loop (and are async by nature thru)

### Clusters

When a cluster is created, a Cluster Manager manages the instances of Node running on the server.

Starting a Node process in cluste rmode starts the cluster manager (the cluster module on NodeJS), which initiates the cluster.fork method, which then starts index.js as a worker instance