export function seconds_to_time (seconds) {
	let mins = Math.floor(seconds / 60, 10);
	let secs = Math.floor(seconds, 10) - mins * 60;
	if (isNaN(mins)) mins = 0;
	if (isNaN(secs)) secs = 0;

	return {
		mins, secs, rendered: mins + ':' + (secs > 9 ? secs : '0' + secs)
	}
};