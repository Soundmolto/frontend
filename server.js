'use strict';

const superstatic = require('superstatic');
const connect = require('connect');
const https = require('https');
const http = require('http');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const key = readFileSync(resolve(__dirname, './certs/_wildcard.musicstreaming.dev-key.pem'), { encoding: 'UTF8' });
const cert = readFileSync(resolve(__dirname, './certs/_wildcard.musicstreaming.dev.pem'), { encoding: 'UTF8' });

const spec = {
  config: {
    public: './build',
    rewrites: [
        {
            source: "/**",
            destination: "/index.html"
        }
    ]
  },
  cwd: process.cwd()
};

const httpsOptions = { key, cert };

const app = connect().use(superstatic(spec));

https.createServer(httpsOptions, app).listen(8081, err => {
    if (err) {
        console.log(err);
    }
});

http.createServer((req, res) => {
	res.writeHead(301, { "Location": `https://${req.headers['host']}${req.url}` });
	res.end();
}).listen(8080);
