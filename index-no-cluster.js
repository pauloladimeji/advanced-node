const crypto = require('crypto');

// im a child, i;m going to act like a server
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        res.send(`Hi there`);
    });
    // res.send('Hi there');
});

app.get('/fast', (req, res) => {
    res.send('This was fast');
});

app.listen(3000);