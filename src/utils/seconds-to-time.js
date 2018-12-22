function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

export function seconds_to_time (seconds) {
	let mins = Math.floor(seconds / 60, 10);
	let secs = Math.floor(seconds, 10) - mins * 60;
	if (isNaN(mins)) mins = 0;
	if (isNaN(secs)) secs = 0;
	const realmin = mins % 60;
	const hours = Math.floor(mins / 60);
	let hour = '';


	if (hours != 0) {
		hour = `${pad(hours)}:`;
	}

	return {
		mins, secs, rendered: `${hour}${pad(realmin)}:${(secs > 9 ? secs : '0' + secs)}`
	}
};