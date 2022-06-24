import http from 'node:http';
import serveStatic from 'serve-static';

const HOSTNAME = '0.0.0.0';
const PORT = process.env.PORT || 8888;
const server = http.createServer();
let retryTimeoutId = -1;

// #region HTTP SERVER
const serve = serveStatic('public', { index: 'index.html' });

server.on('request', (req, res) => {
    console.log(`[HTTP] "${req.socket.remoteAddress}" ${req.method} ${req.headers.host}${req.url}`);

    serve(req, res, () => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    });
});

server.on('listening', () => console.log(`[HTTP] Server is listening on ${HOSTNAME}:${PORT}`));
server.on('close', () => console.log('[HTTP] Server is closed'));
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`[HTTP] Port "${PORT}" is in use. Retrying...`);
        retryTimeoutId = setTimeout(() => {
            server.close();
            server.listen(PORT, HOSTNAME);
        }, 1000);
    } else {
        console.error(e);
    }
});

server.listen(PORT, HOSTNAME);
// #endregion

// #region HANDLE PROCESS EXIT SIGNALS
function exit(msg) {
    console.log(msg);
    clearTimeout(retryTimeoutId);
    server.close();
    wss.close();
    wss.clients.forEach((c) => c.terminate());
}

process.once('SIGINT', (code) => {
    exit(`[APP] SIGINT: ${code}`);
});

process.once('SIGTERM', (code) => {
    exit(`[APP] SIGTERM: ${code}`);
});
// #endregion
