process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require('crypto');

const start = Date.now();

/* A & B start at the same time */

// A
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('1:', Date.now() - start);
});

// B
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('2:', Date.now() - start);
});

// C
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('3:', Date.now() - start);
});

// D
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('4:', Date.now() - start);
});

// E
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('5:', Date.now() - start);
});