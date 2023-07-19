// Create web server application
// 1. Create a web server application
// 2. Create a GET request handler for the path '/comments'
// 3. Read the 'comments.json' file and send the content back to the client
// 4. Create a POST request handler for the path '/comments'
// 5. Read the 'comments.json' file, add a new comment to the array and save the file
// 6. Redirect the client back to the path '/comments'

const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const url = require('url');

const server = http.createServer((req, res) => {
    const urlObj = url.parse(req.url, true);
    const pathName = urlObj.pathname;
    const method = req.method;

    if (pathName === '/comments') {
        if (method === 'GET') {
            fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(data);
            });
        } else if (method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                const params = qs.parse(body);
                fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
                    if (err) throw err;
                    const comments = JSON.parse(data);
                    comments.push(params.comment);
                    fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), err => {
                        if (err) throw err;
                        res.writeHead(302, {
                            'Location': '/comments'
                        });
                        res.end();
                    });
                });
            });
        }
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(8080);
console.log('Server is listening on port 8080...');