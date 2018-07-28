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

	get currentPosition () {
		return position;
	}

	shuffle () {
		const a = this.tracks;
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			if (j !== this.currentPosition && i !== this.currentPosition) {
				[a[i], a[j]] = [a[j], a[i]]; // Always
			}
			
		}
		this.tracks = a.concat([]);
	}

}