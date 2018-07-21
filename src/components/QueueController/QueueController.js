let position = 0;
let tracks = [];
let title = "Untitled queue";

export class QueueController {

	events = { 'set:tracks': tracks => {} };

	on (event, handler) {
		this.events[event] = handler;
	}
	
	get tracks () {
		return tracks.concat([]);
	}

	set tracks (t = []) {
		if (Array.isArray(t) === false) {
			throw new Error('Tracks must be an array.');
		}
		tracks = t;
		this.events['set:tracks'](tracks);
	}

	get title () {
		return title;
	}

	set title (t = "Untitled queue") {
		if (typeof t !== "string") {
			t = "Untitled queue";
		}

		title = t;
	}

	get current () {
		return tracks[position];
	}

	first () {
		return tracks[0];
	}

	last () {
		return tracks[tracks.length - 1];
	}

	next () {
		position += 1;
		return tracks[position];
	}

	previous () {
		position -= 1;
		return tracks[position];
	}

	shuffle () {
		let currentIndex = tracks.length;
		let temporaryValue;
		let randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = tracks[currentIndex];
			tracks[currentIndex] = tracks[randomIndex];
			tracks[randomIndex] = temporaryValue;
		}
	
		tracks = array.concat([]);
	}

}