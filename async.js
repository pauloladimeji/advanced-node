const https = require('https');

const start = Date.now();

function doRequest() {
    https.request('https://google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log(Date.now() - start);
        });
    }).end();
}

let i = 0;

while (i < 8) {
    doRequest();
    i++;
}