const formatDate = (date: Date | string | undefined) => {
	if (!date) {
		return '';
	}
	let d = new Date(date);
	let month = (d.getMonth() + 1).toString();
	let day = d.getDate().toString();
	let year = d.getFullYear();
	if (month.length < 2) {
		month = '0' + month;
	}
	if (day.length < 2) {
		day = '0' + day;
	}
	return [year, month, day].join('-');
};
function normalizePort(val: string) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}
export { normalizePort };
export default formatDate;
