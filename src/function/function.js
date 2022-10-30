'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.formatDate = void 0;
const formatDate = (date) => {
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
exports.formatDate = formatDate;
