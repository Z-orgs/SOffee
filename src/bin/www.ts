import app from '../app';
import connectDB from '../config/connect';
import { createServer } from 'http';
import debug from 'debug';
import { normalizePort } from '../function';
const debugApp = debug('SOffee:server');
const PORT = normalizePort(process.env.PORT || '80');
app.set('port', PORT);
const server = createServer(app);
connectDB();
server.listen(PORT, () => {
	console.log(`PORT: ${PORT}`);
});
server.on('error', onError);
server.on('listening', onListening);
function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
	debugApp('Listening on ' + bind);
}
