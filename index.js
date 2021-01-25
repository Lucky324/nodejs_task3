const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;
const db = 'names_and_ip.json';

let users = [];

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, 'utf-8'));
    for (let user of users) {
        console.log(`Name: ${user.name}, IP: ${user.ip}`);
    }
}

function getName(request) {
    return request.query.name;
}
function getIP(request) {
    return request.ip;
}

app.use((request, response, next) => {
    const userName = getName(request);
    if (request.method === 'POST') {
        console.log(`Hello, ${userName}!`);
        next();
    } else {
        response.end('Wrong request.');
    }
});

app.post('/', (request, response) => {
    const userName = getName(request);
    const userIP = getIP(request);
    if (userName && request.headers.iknowyoursecret === 'TheOwlAreNotWhatTheySeem') {
        users.push({name: userName, ip: userIP});
        fs.writeFile(db, JSON.stringify(users, null, ' '), err => {
            if (err) {
                throw err;
            }
        });
    } else {
        console.log('Something went wrong(');
    }
    response.end();
});

app.listen(port, err => {
    if (err) {
        console.log(`The exception happened: ${err}`);
    } else {
        console.log(`Server is listening on ${port}`);
    }
});
